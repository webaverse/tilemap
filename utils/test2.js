import Perlin from './perlinNoise.js';
import PF from 'pathfinding';

const TILE_AMOUNT = 50;
const pn = new Perlin();
const mapArr = {};
const i = 0;

const scales = [40, 10];
const persistance = [1, 0.2];
const range = 100;

function addLayers(n1, n2) {
  const sum = n1 * persistance[0] + n2 * persistance[1];
  const max = range * persistance[0] + range * persistance[1];
  return Math.round(map(sum, 0, max, 0, range));
}
function map(n, start1, stop1, start2, stop2) {
  return ((n - start1) / (stop1 - start1)) * (stop2 - start2) + start2;
}

function addProp(type, x, y) {
  if (!mapArr[y]) {
    mapArr[y] = {};
  }

  mapArr[y][x] = type == 'flower' ? 0 : 1;
}

for (let x = i; x < TILE_AMOUNT + i; x++) {
  for (let y = i; y < TILE_AMOUNT + i; y++) {
    if (!mapArr[y]) {
      mapArr[y] = {};
    }

    const n1 = Math.round(
      //cubicNoise.sample(x / scales[0], y / scales[0], 0) * range,
      pn.noise(x / scales[0], y / scales[0], 0) * range,
    );
    const n2 = Math.round(
      //cubicNoise.sample(x / scales[1], y / scales[1], 0) * range,
      pn.noise(x / scales[1], y / scales[1], 0) * range,
    );
    const num = addLayers(n1, n2);

    let tileName = '';

    if (num <= 20) {
      mapArr[y][x] = 0;
      const rnd = Math.random();
      if (rnd < 0.25) {
        addProp('tree', x, y);
      }
    } else if (num <= 35) {
      mapArr[y][x] = 0;

      const rnd = Math.random();
      if (rnd < 0.1) {
        addProp('stone', x, y);
      }
    } else if (num <= 40) {
      mapArr[y][x] = 0;

      const rnd = Math.random();
      if (rnd < 0.025) {
        addProp('tree', x, y);
      } else if (rnd < 0.075) {
        addProp('stone', x, y);
      } else if (rnd < 0.4) {
        addProp('flower', x, y);
      }
    } else if (num <= 69) {
      mapArr[y][x] = 0;
      const rnd = Math.random();
      if (rnd < 0.1) {
        addProp('bush_normal', x, y);
      } else if (rnd < 0.75) {
        addProp('flower', x, y);
      }
    } else if (num <= 73) {
      mapArr[y][x] = 0;
      const rnd = Math.random();
      if (rnd < 0.1) {
        addProp('rock', x, y);
      } else if (rnd < 0.0125) {
        addProp('bush_sand', x, y);
      }
    } else {
      mapArr[y][x] = 1;
    }
  }
}

let str = '';
for (const x in mapArr) {
  for (const y in mapArr[x]) {
    str += mapArr[x][y] + ' ';
  }
  str += '\n';
}
console.log(str);

//find areas inside the map with 0s that a house can be placed
const houseAreas = [];
for (let i = 0; i < TILE_AMOUNT; i++) {
  for (let j = 0; j < TILE_AMOUNT; j++) {
    const x = j;
    const y = i;
    if (mapArr[x][y] === 0) {
      try {
        if (
          mapArr[x][y + 1] === 0 &&
          mapArr[x][y + 2] === 0 &&
          mapArr[x + 1][y] === 0 &&
          mapArr[x + 1][y + 1] === 0 &&
          mapArr[x + 1][y + 2] === 0 &&
          mapArr[x + 2][y] === 0 &&
          mapArr[x + 2][y + 1] === 0 &&
          mapArr[x + 2][y + 2] === 0
        ) {
          houseAreas.push([x, y]);
        }
      } catch (e) {}
    }
  }
}
console.log('houses:', houseAreas.length);

//remove overlapping areas
let houseAreasFiltered = houseAreas.filter((area, index) => {
  return houseAreas.every((area2, index2) => {
    if (index === index2) return true;
    return !(
      area[0] >= area2[0] &&
      area[0] <= area2[0] + 2 &&
      area[1] >= area2[1] &&
      area[1] <= area2[1] + 2
    );
  });
});

//remove the houses that are too close together
houseAreasFiltered = houseAreasFiltered.filter((area, index) => {
  return houseAreasFiltered.every((area2, index2) => {
    if (index === index2) return true;
    return !(
      area[0] >= area2[0] - 2 &&
      area[0] <= area2[0] + 4 &&
      area[1] >= area2[1] - 2 &&
      area[1] <= area2[1] + 4
    );
  });
});

console.log('filtered houses:', houseAreasFiltered.length);

console.log('filtered houses:', houseAreasFiltered.length);

const houseUpLeft = 'sprite_216';
const houseUpMiddle = 'sprite_217';
const houseUpRight = 'sprite_218';
const houseMiddleLeft = 'sprite_219';
const houseMiddleMiddle = 'sprite_220';
const houseMiddleRight = 'sprite_221';
const houseDownLeft = 'sprite_222';
const houseDownMiddle = 'sprite_223';
const houseDownRight = 'sprite_224';

const upStraight = 'sprite_211';
const downStraight = 'sprite_211';
const upLeft = 'sprite_207';
const upRight = 'sprite_206';
const downLeft = 'sprite_209';
const downRight = 'sprite_208';
const upEnd = 'sprite_213';

const resHouses = [];
const grid = new PF.Grid(TILE_AMOUNT, TILE_AMOUNT);

for (let x = 0; x < TILE_AMOUNT; x++) {
  for (let y = 0; y < TILE_AMOUNT; y++) {
    grid.setWalkableAt(y, x, mapArr[y][x] === 0);
  }
}

const finder = new PF.AStarFinder();

//place houses in the areas
houseAreasFiltered.forEach(area => {
  const i = area[1];
  const j = area[0];

  const locs = [
    [i, j],
    [i, j + 1],
    [i, j + 2],
    [i + 1, j],
    [i + 1, j + 1],
    [i + 1, j + 2],
    [i + 2, j],
    [i + 2, j + 1],
    [i + 2, j + 2],
  ];
  const sprites = [
    houseUpLeft,
    houseUpMiddle,
    houseUpRight,
    houseMiddleLeft,
    houseMiddleMiddle,
    houseMiddleRight,
    houseDownLeft,
    houseDownMiddle,
    houseDownRight,
  ];

  for (let i = 0; i < locs.length; i++) {
    mapArr[locs[i][1]][locs[i][0]] = 1; // i < 6 ? 0 : 1;
    grid.setWalkableAt(locs[i][1], locs[i][0], false); // i < 6 ? false : true);

    if (i === 7) {
      resHouses.push([locs[i][1], locs[i][0]]);
    }
  }
});

console.log('houses:', resHouses.length);
let _paths = [];
for (let i = 0; i < resHouses.length - 2; i += 2) {
  const start = resHouses[i];
  const end = resHouses[i + 1];

  //get one tile down from the start and end
  const startDown = [start[0], start[1] + 1];
  const endDown = [end[0], end[1] + 1];
  const path = finder.findPath(
    startDown[0],
    startDown[1],
    endDown[0],
    endDown[1],
    grid,
  );
  console.log('path now:', path);
  if (path.length > 0) {
    _paths.push(path);
  }
}

let paths = [];
for (let i = 0; i < _paths.length; i++) {
  //remove tiles that exist in other paths
  for (let j = 0; j < _paths.length; j++) {
    if (i === j) continue;
    _paths[i] = _paths[i].filter(tile => {
      return !_paths[j].some(tile2 => {
        return tile[0] === tile2[0] && tile[1] === tile2[1];
      });
    });
  }
}

_paths.forEach(path => {
  paths = paths.concat(path);
});

//remove duplicates
paths = paths.filter((tile, index) => {
  return paths.every((tile2, index2) => {
    if (index === index2) return true;
    return !(tile[0] === tile2[0] && tile[1] === tile2[1]);
  });
});

//rearange the path tiles to be in the right order
paths = paths.sort((a, b) => {
  if (a[0] === b[0]) {
    return a[1] - b[1];
  }
  return a[0] - b[0];
});

console.log('res paths:', paths);
for (let i = 0; i < paths.length; i++) {
  if (i > 0) {
    const distance = Math.sqrt(
      Math.pow(paths[i][0] - paths[i - 1][0], 2) +
        Math.pow(paths[i][1] - paths[i - 1][1], 2),
    );
    console.log(distance);
  }
}
