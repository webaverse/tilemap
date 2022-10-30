import * as THREE from 'three';
import AssetManager from './asset-manager';
import {generateForest} from './forest';
import forest2 from './forest2';

// this file's base url
const BASE_URL = import.meta.url.replace(/(\/)[^\/\\]*$/, '$1');

const TILES = [
  'assets/tiles/all.png',
  'assets/tiles/e.png',
  'assets/tiles/edge.png',
  'assets/tiles/ground.png',
  'assets/tiles/w-e.png',
].map(url => {
  return `${BASE_URL}${url}`;
});

export const TILE_SIZE = 1;
export const TILE_AMOUNT = 200;

export default class Tiles extends THREE.Object3D {
  constructor() {
    super();
    this.name = 'tiles';
  }

  loadTiles(type, length) {
    const res = [];

    for (let i = 0; i < length; i++) {
      res.push(
        `${BASE_URL}assets/tiles/${type}/sprite_${
          i >= 100 ? i : i >= 10 ? `0${i}` : `00${i}`
        }.png`,
      );
    }

    console.log('loaded ' + res.length + ' tiles');
    return res;
  }

  generate(type, assetManager) {
    if (type === 'forest') {
      console.log('Spawning all');
      const meshes = {};
      for (let i = 0; i < assetManager.textures.length; i++) {
        const material = new THREE.MeshBasicMaterial({
          map: assetManager.textures[i],
        });
        const geometry = new THREE.PlaneGeometry(1, 1);
        geometry.rotateX(-Math.PI / 2);
        const mesh = new THREE.Mesh(geometry, material);
        const meshName = assetManager.textures[i].source.data.src
          .split('/')
          [
            assetManager.textures[i].source.data.src.split('/').length - 1
          ].split('.')[0];
        meshes[meshName] = mesh;
      }

      const m = forest2(meshes);
      m.map(mesh => {
        this.add(mesh);
      });
    } else {
      console.log("SPAWNING OTHER')");
      const meshes = [];
      for (let i = 0; i < assetManager.textures.length; i++) {
        const material = new THREE.MeshBasicMaterial({
          map: assetManager.textures[i],
        });
        const geometry = new THREE.PlaneGeometry(1, 1);
        geometry.rotateX(-Math.PI / 2);
        const mesh = new THREE.Mesh(geometry, material);
        meshes.push(mesh);
      }

      for (let z = 0; z < TILE_AMOUNT; z++) {
        for (let x = 0; x < TILE_AMOUNT; x++) {
          const idx = randomIntFromInterval(0, meshes.length - 1);
          const cloneMesh = meshes[idx].clone();
          cloneMesh.position.set(
            (x - TILE_AMOUNT / 2) * TILE_SIZE,
            0.1,
            (z - TILE_AMOUNT / 2) * TILE_SIZE,
          );
          this.add(cloneMesh);
        }
      }
    }
  }

  async waitForLoad(type, length) {
    const tiles = this.loadTiles(type, length);
    const assetManager = await AssetManager.loadUrls(tiles);
    this.generate(type, assetManager);
  }
}

function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
