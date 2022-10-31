import {TILE_AMOUNT, TILE_SIZE} from './tiles';
import Perlin from './utils/perlinNoise';

export default function forest2(_meshes) {
  const deepForestTiles = ['sprite_159', 'sprite_160', 'sprite_161'];
  const forestTiles = [
    'sprite_159',
    'sprite_160',
    'sprite_161',
    'sprite_162',
    'sprite_163',
    'sprite_164',
  ];
  const stoneTiles = ['sprite_138', 'sprite_139'];
  const grassTiles = ['sprite_156', 'sprite_157', 'sprite_158'];
  const sandTiles = ['sprite_197', 'sprite_198'];
  const waterTiles = [
    'sprite_192',
    'sprite_193',
    'sprite_194',
    'sprite_195',
    'sprite_196',
  ];
  const treeTiles = ['sprite_169', 'sprite_171', 'sprite_172'];
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
  const bushTiles = ['sprite_173', 'sprite_174', 'sprite_175'];

  const pn = new Perlin();

  const scales = [40, 10];
  const persistance = [1, 0.2];
  const range = 100;

  const meshes = [];
  run();

  function run() {
    init(0);
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
        const n1 = Math.round(
          pn.noise(x / scales[0], y / scales[0], 0) * range,
        );
        const n2 = Math.round(
          pn.noise(x / scales[1], y / scales[1], 0) * range,
        );
        const num = addLayers(n1, n2);

        let tileName = '';

        /*
        Replace the snow with dense forest and add trees
        Add inside based on if it is dense forest or not have trees/bushes flowers etc
        Add rocks
        */
        if (num <= 20) {
          tileName =
            deepForestTiles[Math.floor(Math.random() * deepForestTiles.length)];
          const rnd = Math.random();
          if (rnd < 0.5) {
            const tree =
              treeTiles[Math.floor(Math.random() * treeTiles.length)];

            const cloneTreeMesh = _meshes[tree].clone();
            cloneTreeMesh.position.set(
              (y - TILE_AMOUNT / 2) * TILE_SIZE,
              0.05,
              (x - TILE_AMOUNT / 2) * TILE_SIZE,
            );
            meshes.push(cloneTreeMesh);
          }
        } else if (num <= 35) {
          tileName = stoneTiles[Math.floor(Math.random() * stoneTiles.length)];

          const rnd = Math.random();
          if (rnd < 0.2) {
            const rock =
              rockTiles[Math.floor(Math.random() * rockTiles.length)];

            const cloneRockMesh = _meshes[rock].clone();
            cloneRockMesh.position.set(
              (y - TILE_AMOUNT / 2) * TILE_SIZE,
              0.05,
              (x - TILE_AMOUNT / 2) * TILE_SIZE,
            );
            meshes.push(cloneRockMesh);
          }
        } else if (num <= 40) {
          tileName =
            forestTiles[Math.floor(Math.random() * forestTiles.length)];

          const rnd = Math.random();
          if (rnd < 0.1) {
            const tree =
              bushTiles[Math.floor(Math.random() * bushTiles.length)];

            const cloneTreeMesh = _meshes[tree].clone();
            cloneTreeMesh.position.set(
              (y - TILE_AMOUNT / 2) * TILE_SIZE,
              0.05,
              (x - TILE_AMOUNT / 2) * TILE_SIZE,
            );
            meshes.push(cloneTreeMesh);
          } else if (rnd < 0.15) {
            const rock =
              rockTiles[Math.floor(Math.random() * rockTiles.length)];

            const cloneRockMesh = _meshes[rock].clone();
            cloneRockMesh.position.set(
              (y - TILE_AMOUNT / 2) * TILE_SIZE,
              0.05,
              (x - TILE_AMOUNT / 2) * TILE_SIZE,
            );
            meshes.push(cloneRockMesh);
          } else if (rnd < 0.5) {
            const tree =
              flowerTiles[Math.floor(Math.random() * flowerTiles.length)];

            const cloneTreeMesh = _meshes[tree].clone();
            cloneTreeMesh.position.set(
              (y - TILE_AMOUNT / 2) * TILE_SIZE,
              0.05,
              (x - TILE_AMOUNT / 2) * TILE_SIZE,
            );
            meshes.push(cloneTreeMesh);
          }
        } else if (num <= 60) {
          tileName = grassTiles[Math.floor(Math.random() * grassTiles.length)];
        } else if (num <= 63) {
          tileName = sandTiles[Math.floor(Math.random() * sandTiles.length)];
        } else if (num <= 80) {
          tileName = waterTiles[Math.floor(Math.random() * waterTiles.length)];
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
