import * as THREE from 'three';
import AssetManager from './asset-manager.js';

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

const TILE_SIZE = 0.3;
const TILE_AMOUNT = 200;

export default class Tiles extends THREE.Object3D {
  constructor() {
    super();
    this.name = 'tiles';
  }

  generate(assetManager) {
    const meshes = [];
    for (let i = 0; i < assetManager.textures.length; i++) {
      const material = new THREE.MeshBasicMaterial({
        map: assetManager.textures[i],
        side: THREE.DoubleSide,
      });
      const geometry = new THREE.PlaneGeometry(TILE_SIZE, TILE_SIZE);
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
          0,
          (z - TILE_AMOUNT / 2) * TILE_SIZE,
        );
        this.add(cloneMesh);
      }
    }
  }

  async waitForLoad() {
    const assetManager = await AssetManager.loadUrls(TILES);
    this.generate(assetManager);
  }
}

function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
