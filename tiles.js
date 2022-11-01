import * as THREE from 'three';
import AssetManager from './asset-manager';
import generateForest from './forest';

// this file's base url
const BASE_URL = import.meta.url.replace(/(\/)[^\/\\]*$/, '$1');

export const TILE_SIZE = 1;
export const TILE_AMOUNT = 50;

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
      const meshes = {};
      for (let i = 0; i < assetManager.textures.length; i++) {
        let material =
          i > 168 && i < 192
            ? new THREE.MeshBasicMaterial({
                map: assetManager.textures[i],
                blending: 1,
                transparent: true,
              })
            : new THREE.MeshBasicMaterial({
                map: assetManager.textures[i],
              });

        const geometry = new THREE.PlaneGeometry(0.5, 0.5);
        geometry.rotateX(-Math.PI / 2);
        const mesh = new THREE.Mesh(geometry, material);
        const meshName = assetManager.textures[i].source.data.src
          .split('/')
          [
            assetManager.textures[i].source.data.src.split('/').length - 1
          ].split('.')[0];
        meshes[meshName] = mesh;
      }

      generateForest(meshes).map(mesh => {
        this.add(mesh);
      });
    } else {
      const meshes = [];
      for (let i = 0; i < assetManager.textures.length; i++) {
        const material = new THREE.MeshBasicMaterial({
          map: assetManager.textures[i],
          side: THREE.DoubleSide,
        });
        const geometry = new THREE.PlaneGeometry(1, 1);
        geometry.rotateX(-Math.PI / 2);
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(0, 0, 0);
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
