import {TILE_AMOUNT, TILE_SIZE} from './tiles';
import Perlin from './utils/perlinNoise';
import {BufferedCubicNoise} from './utils/bufferedCubicNoise';

export default function generateForest(_meshes) {
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

  const pn = new Perlin();
  const cubicNoise = new BufferedCubicNoise(TILE_AMOUNT, TILE_AMOUNT);
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
    props.push({type, x, y});

    const prop =
      type === 'tree'
        ? treeTiles[Math.floor(Math.random() * treeTiles.length)]
        : type === 'stone'
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
    for (let x = i; x < TILE_AMOUNT + i; x += 0.5) {
      for (let y = i; y < TILE_AMOUNT + i; y += 0.5) {
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
          tileName =
            deepForestTiles[Math.floor(Math.random() * deepForestTiles.length)];
          const rnd = Math.random();
          if (rnd < 0.25) {
            addProp('tree', x, y);
          }
        } else if (num <= 35) {
          tileName = stoneTiles[Math.floor(Math.random() * stoneTiles.length)];

          const rnd = Math.random();
          if (rnd < 0.1) {
            addProp('stone', x, y);
          }
        } else if (num <= 40) {
          tileName =
            forestTiles[Math.floor(Math.random() * forestTiles.length)];

          const rnd = Math.random();
          if (rnd < 0.05) {
            addProp('tree', x, y);
          } else if (rnd < 0.075) {
            addProp('stone', x, y);
          } else if (rnd < 0.25) {
            addProp('flower', x, y);
          }
        } else if (num <= 69) {
          tileName = grassTiles[Math.floor(Math.random() * grassTiles.length)];
          const rnd = Math.random();
          if (rnd < 0.1) {
            addProp('bush_normal', x, y);
          } else if (rnd < 0.5) {
            addProp('flower', x, y);
          }
        } else if (num <= 73) {
          tileName = sandTiles[Math.floor(Math.random() * sandTiles.length)];
          const rnd = Math.random();
          if (rnd < 0.05) {
            addProp('rock', x, y);
          } else if (rnd < 0.025) {
            addProp('bush_sand', x, y);
          }
        } else {
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
        }
      }
    }
  }

  return meshes;
}
