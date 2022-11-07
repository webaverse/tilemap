import {TILE_AMOUNT, TILE_SIZE} from './tiles';
import Perlin from './utils/perlinNoise';
import {BufferedCubicNoise} from './utils/bufferedCubicNoise';
import PF from 'pathfinding';

export default function generateForest(_meshes) {
  const multipliers = {};
  multipliers['trees'] = 1;
  multipliers['rocks'] = 1;
  multipliers['stones'] = 1;
  multipliers['flowers'] = 1;
  multipliers['bush_normal'] = 1;
  multipliers['bush_sand'] = 1;

  const deepForestTiles = ['sprite_199'];
  const forestTiles = ['sprite_199'];
  const stoneTiles = ['sprite_064'];
  const grassTiles = ['sprite_010', 'sprite_013', 'sprite_016'];
  const sandTiles = ['sprite_197', 'sprite_198'];
  const waterTiles = [
    'sprite_192',
    'sprite_193',
    'sprite_194',
    'sprite_195',
    'sprite_196',
  ];
  const treeTiles = ['sprite_169', 'sprite_170', 'sprite_171', 'sprite_172'];
  const rockTiles = ['sprite_176', 'sprite_177', 'sprite_178'];
  const flowerTiles = [
    'sprite_179',
    'sprite_180',
    'sprite_181',
    'sprite_182',
    'sprite_183',
    'sprite_184',
    'sprite_185',
    'sprite_186',
    'sprite_187',
    'sprite_188',
    'sprite_189',
    'sprite_190',
    'sprite_191',
  ];
  const bushNormalTiles = ['sprite_173', 'sprite_175'];
  const bushSandTiles = ['sprite_174'];
  const monsterTiles = [
    'sprite_200',
    'sprite_201',
    'sprite_202',
    'sprite_203',
    'sprite_204',
    'sprite_205',
  ];

  const pn = new Perlin();
  const cubicNoise = new BufferedCubicNoise(TILE_AMOUNT, TILE_AMOUNT);
  const mapArr = {};
  const allMeshes = [];
  const props = [];

  const scales = [40, 10];
  const persistance = [1, 0.2];
  const range = 100;

  const meshes = [];
  run();

  function run() {
    init(0);
  }

  function addProp(type, x, y) {
    if (!mapArr[y]) {
      mapArr[y] = {};
    }

    mapArr[y][x] = type == 'flower' ? 0 : 1;

    props.push({type, x: y, y: x});

    const prop =
      type === 'tree'
        ? treeTiles[Math.floor(Math.random() * treeTiles.length)]
        : type === 'stone' || type === 'rock'
        ? rockTiles[Math.floor(Math.random() * rockTiles.length)]
        : type === 'flower'
        ? flowerTiles[Math.floor(Math.random() * flowerTiles.length)]
        : type === 'bush_normal'
        ? bushNormalTiles[Math.floor(Math.random() * bushNormalTiles.length)]
        : bushSandTiles[Math.floor(Math.random() * bushSandTiles.length)];

    const cloneTreeMesh = _meshes[prop].clone();
    cloneTreeMesh.position.set(
      (y - TILE_AMOUNT / 2) * TILE_SIZE,
      0.01,
      (x - TILE_AMOUNT / 2) * TILE_SIZE,
    );
    meshes.push(cloneTreeMesh);
    allMeshes.push({type: 'prop', x, y, mesh: cloneTreeMesh});
  }

  function addLayers(n1, n2) {
    const sum = n1 * persistance[0] + n2 * persistance[1];
    const max = range * persistance[0] + range * persistance[1];
    return Math.round(map(sum, 0, max, 0, range));
  }
  function map(n, start1, stop1, start2, stop2) {
    return ((n - start1) / (stop1 - start1)) * (stop2 - start2) + start2;
  }

  function init(i) {
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
          tileName =
            deepForestTiles[Math.floor(Math.random() * deepForestTiles.length)];
          const rnd = Math.random();
          if (rnd < 0.25 * multipliers['trees']) {
            addProp('tree', x, y);
          }
        } else if (num <= 35) {
          mapArr[y][x] = 0;
          tileName = stoneTiles[Math.floor(Math.random() * stoneTiles.length)];

          const rnd = Math.random();
          if (rnd < 0.1 * multipliers['rocks']) {
            addProp('stone', x, y);
          }
        } else if (num <= 40) {
          mapArr[y][x] = 0;
          tileName =
            forestTiles[Math.floor(Math.random() * forestTiles.length)];

          const rnd = Math.random();
          if (rnd < 0.025 * multipliers['trees']) {
            addProp('tree', x, y);
          } else if (rnd < 0.075 * multipliers['rocks']) {
            addProp('stone', x, y);
          } else if (rnd < 0.4 * multipliers['flowers']) {
            addProp('flower', x, y);
          }
        } else if (num <= 69) {
          mapArr[y][x] = 0;
          tileName = grassTiles[Math.floor(Math.random() * grassTiles.length)];
          const rnd = Math.random();
          if (rnd < 0.1 * multipliers['bush_normal']) {
            addProp('bush_normal', x, y);
          } else if (rnd < 0.75 * multipliers['flowers']) {
            addProp('flower', x, y);
          }
        } else if (num <= 73) {
          mapArr[y][x] = 0;
          tileName = sandTiles[Math.floor(Math.random() * sandTiles.length)];
          const rnd = Math.random();
          if (rnd < 0.1 * multipliers['rocks']) {
            addProp('rock', x, y);
          } else if (rnd < 0.0125 * multipliers['bush_sand']) {
            addProp('bush_sand', x, y);
          }
        } else {
          mapArr[y][x] = 1;
          tileName = waterTiles[Math.floor(Math.random() * waterTiles.length)];
        }

        if (!tileName) {
          console.log("couldn't get tile name");
        } else {
          const cloneMesh = _meshes[tileName].clone();
          cloneMesh.position.set(
            (y - TILE_AMOUNT / 2) * TILE_SIZE,
            0,
            (x - TILE_AMOUNT / 2) * TILE_SIZE,
          );
          meshes.push(cloneMesh);
          allMeshes.push({type: 'tile', x: y, y: x, mesh: cloneMesh});
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

    console.log('===========================================');

    const upStraight = 'sprite_211';
    const downStraight = 'sprite_211';
    const upLeft = 'sprite_206';
    const upRight = 'sprite_207';
    const downLeft = 'sprite_208';
    const downRight = 'sprite_213';
    const upEnd = 'sprite_213';
    const pathMiddle = 'sprite_213';

    let path = [];
    const grid = new PF.Grid(TILE_AMOUNT, TILE_AMOUNT);
    for (let x = 0; x < TILE_AMOUNT; x++) {
      for (let y = 0; y < TILE_AMOUNT; y++) {
        console.log(x, y);
        grid.setWalkableAt(y, x, mapArr[y][x] === 0);
      }
    }
    const finder = new PF.AStarFinder();

    while (path.length <= 4) {
      const randomPoint = () => {
        let x = Math.floor(Math.random() * TILE_AMOUNT);
        let y = Math.floor(Math.random() * TILE_AMOUNT);

        while (mapArr[y][x] == 1) {
          x = Math.floor(Math.random() * TILE_AMOUNT);
          y = Math.floor(Math.random() * TILE_AMOUNT);
        }

        return {x, y};
      };

      const start = randomPoint();
      let end = randomPoint();
      while (end === start) {
        end = randomPoint();
      }

      console.log(start, end);

      //find path using astar
      path = finder.findPath(start.y, start.x, end.y, end.x, grid.clone());

      if (path && path.length > 4) {
        //asign spriutes to each path tile, according ot next one
        for (let i = 0; i < path.length; i++) {
          const x = path[i][1];
          const y = path[i][0];
          mapArr[y][x] = 1;
          grid.setWalkableAt(y, x, false);

          let spriteName = '';
          if (i === 0) {
            //first tile
            if (path[i + 1][1] === x) {
              //straight
              spriteName = upStraight;
            } else if (path[i + 1][1] > x) {
              //right
              spriteName = upLeft;
            } else {
              //left
              spriteName = upRight;
            }
          } else if (i === path.length - 1) {
            //last tile
            if (path[i - 1][1] === x) {
              //straight
              spriteName = downStraight;
            } else if (path[i - 1][1] > x) {
              //right
              spriteName = downLeft;
            } else {
              //left
              spriteName = downRight;
            }
          } else {
            //middle tile
            if (path[i - 1][1] === x && path[i + 1][1] === x) {
              //straight
              spriteName = upStraight;
            } else if (path[i - 1][1] === x && path[i + 1][1] > x) {
              //right
              spriteName = upLeft;
            } else if (path[i - 1][1] === x && path[i + 1][1] < x) {
              //left
              spriteName = upRight;
            } else if (path[i - 1][1] > x && path[i + 1][1] === x) {
              //right
              spriteName = downLeft;
            } else if (path[i - 1][1] < x && path[i + 1][1] === x) {
              //left
              spriteName = downRight;
            } else if (path[i - 1][1] > x && path[i + 1][1] > x) {
              //right
              spriteName = upEnd;
            } else if (path[i - 1][1] < x && path[i + 1][1] < x) {
              //left
              spriteName = upEnd;
            }
          }

          if (!spriteName) {
            spriteName = pathMiddle;
          }

          console.log('sprite name:', spriteName);
          const cloneMesh = _meshes[spriteName].clone();
          cloneMesh.position.set(
            (y - TILE_AMOUNT / 2) * TILE_SIZE,
            0.1,
            (x - TILE_AMOUNT / 2) * TILE_SIZE,
          );
          meshes.push(cloneMesh);
          allMeshes.push({type: 'path', x: y, y: x, mesh: cloneMesh});
        }
      }
    }

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

    //remove some houses randomly
    houseAreasFiltered = houseAreasFiltered.filter((area, index) => {
      return Math.random() < 0.5;
    });

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

    const resHouses = [];
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

        const cloneMesh = _meshes[sprites[i]].clone();
        cloneMesh.position.set(
          (locs[i][1] - TILE_AMOUNT / 2) * TILE_SIZE,
          0.1,
          (locs[i][0] - TILE_AMOUNT / 2) * TILE_SIZE,
        );
        meshes.push(cloneMesh);

        if (i === 7) {
          resHouses.push([locs[i][1], locs[i][0]]);
        }
      }
    });

    let tries = 0;
    let le = 0;
    while (le < 2) {
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
        console.log('path now:', path, start, end);

        tries++;
        if (path && path.length > 0) {
          le++;
          let has1s = false;

          if (path && path.length > 4) {
            //asign spriutes to each path tile, according ot next one
            for (let i = 0; i < path.length; i++) {
              const x = path[i][1];
              const y = path[i][0];
              mapArr[y][x] = 1;
              grid.setWalkableAt(y, x, false);

              let spriteName = '';
              if (i === 0) {
                //first tile
                if (path[i + 1][1] === x) {
                  //straight
                  spriteName = upStraight;
                } else if (path[i + 1][1] > x) {
                  //right
                  spriteName = upLeft;
                } else {
                  //left
                  spriteName = upRight;
                }
              } else if (i === path.length - 1) {
                //last tile
                if (path[i - 1][1] === x) {
                  //straight
                  spriteName = downStraight;
                } else if (path[i - 1][1] > x) {
                  //right
                  spriteName = downLeft;
                } else {
                  //left
                  spriteName = downRight;
                }
              } else {
                //middle tile
                if (path[i - 1][1] === x && path[i + 1][1] === x) {
                  //straight
                  spriteName = upStraight;
                } else if (path[i - 1][1] === x && path[i + 1][1] > x) {
                  //right
                  spriteName = upLeft;
                } else if (path[i - 1][1] === x && path[i + 1][1] < x) {
                  //left
                  spriteName = upRight;
                } else if (path[i - 1][1] > x && path[i + 1][1] === x) {
                  //right
                  spriteName = downLeft;
                } else if (path[i - 1][1] < x && path[i + 1][1] === x) {
                  //left
                  spriteName = downRight;
                } else if (path[i - 1][1] > x && path[i + 1][1] > x) {
                  //right
                  spriteName = upEnd;
                } else if (path[i - 1][1] < x && path[i + 1][1] < x) {
                  //left
                  spriteName = upEnd;
                }
              }

              if (!spriteName) {
                spriteName = pathMiddle;
              }

              console.log('sprite name:', spriteName);
              const cloneMesh = _meshes[spriteName].clone();
              cloneMesh.position.set(
                (y - TILE_AMOUNT / 2) * TILE_SIZE,
                0.1,
                (x - TILE_AMOUNT / 2) * TILE_SIZE,
              );
              meshes.push(cloneMesh);
              allMeshes.push({type: 'path', x: y, y: x, mesh: cloneMesh});
            }
          }
        }
      }

      if (tries > 50) {
        break;
      }
    }

    const c2 = [];
    for (let i = 0; i < mapArr.length - 3; i++) {
      for (let j = 0; j < mapArr[i].length - 3; j++) {
        if (
          mapArr[i][j] === 0 &&
          mapArr[i][j + 1] === 0 &&
          mapArr[i][j + 2] === 0 &&
          mapArr[i][j + 3] === 0 &&
          mapArr[i + 1][j] === 0 &&
          mapArr[i + 1][j + 1] === 0 &&
          mapArr[i + 1][j + 2] === 0 &&
          mapArr[i + 1][j + 3] === 0 &&
          mapArr[i + 2][j] === 0 &&
          mapArr[i + 2][j + 1] === 0 &&
          mapArr[i + 2][j + 2] === 0 &&
          mapArr[i + 2][j + 3] === 0 &&
          mapArr[i + 3][j] === 0 &&
          mapArr[i + 3][j + 1] === 0 &&
          mapArr[i + 3][j + 2] === 0 &&
          mapArr[i + 3][j + 3] === 0
        ) {
          c2.push([i, j]);
        }
      }
    }

    const centers = c2.filter((center, i) => {
      return !c2.some((otherCenter, j) => {
        return (
          i !== j &&
          center[0] >= otherCenter[0] &&
          center[0] <= otherCenter[0] + 3 &&
          center[1] >= otherCenter[1] &&
          center[1] <= otherCenter[1] + 3
        );
      });
    });

    console.log(centers);

    const monsters = [];
    for (const center of centers) {
      console.log('current center:', center);
      const rnd = Math.random();

      let monster =
        monsterTiles[Math.floor(Math.random() * monsterTiles.length)];

      const cloneMesh = _meshes[monster].clone();
      console.log('spawning the monster: ', monster, 'at:', center);
      cloneMesh.position.set(
        (center[1] - TILE_AMOUNT / 2) * TILE_SIZE,
        0.1,
        (center[0] - TILE_AMOUNT / 2) * TILE_SIZE,
      );
      meshes.push(cloneMesh);
      monsters.push({mob: monster, x: center[1], y: center[0]});
    }
  }

  return meshes;
}
