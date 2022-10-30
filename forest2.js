import {TILE_AMOUNT, TILE_SIZE} from './tiles';
import Perlin from './utils/perlinNoise';

export default function forest2(_meshes) {
  const snowTiles = ['sprite_146', 'sprite_147', 'sprite_148', 'sprite_149'];
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
  const sandTiles = ['sprite_135', 'sprite_136', 'sprite_137'];
  const waterTiles = ['sprite_150', 'sprite_151', 'sprite_152'];
  const deepSeeTiles = ['sprite_153', 'sprite_154', 'sprite_155'];

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
        if (num <= 20) {
          tileName = snowTiles[Math.floor(Math.random() * snowTiles.length)];
        } else if (num <= 35) {
          tileName = stoneTiles[Math.floor(Math.random() * stoneTiles.length)];
        } else if (num <= 40) {
          tileName =
            forestTiles[Math.floor(Math.random() * forestTiles.length)];
        } else if (num <= 60) {
          tileName = grassTiles[Math.floor(Math.random() * grassTiles.length)];
        } else if (num <= 63) {
          tileName = sandTiles[Math.floor(Math.random() * sandTiles.length)];
        } else if (num <= 80) {
          tileName = waterTiles[Math.floor(Math.random() * waterTiles.length)];
        } else {
          tileName =
            deepSeeTiles[Math.floor(Math.random() * deepSeeTiles.length)];
        }

        console.log('num:', num, 'tilename:', tileName);

        if (!tileName) {
          console.log("couldn't get tile name");
        } else {
          const cloneMesh = _meshes[tileName].clone();
          cloneMesh.position.set(
            (y - TILE_AMOUNT / 2) * TILE_SIZE,
            0.1,
            (x - TILE_AMOUNT / 2) * TILE_SIZE,
          );
          meshes.push(cloneMesh);
        }

        console.log(num);
      }
    }
  }

  return meshes;
}
