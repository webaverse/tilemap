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
export const TILE_AMOUNT = 50;

export default class Tiles extends THREE.Object3D {
  constructor() {
    super();
    this.name = 'tiles';
  }

  loadTiles(type, length) {
    if (type === 'summer') {
      const res = [
        'cliff 0.png',
        'cliff 1.png',
        'cliff 2.png',
        'cliff 3.png',
        'cliffcorner 0.png',
        'cliffcorner 1.png',
        'cliffcorner 2.png',
        'cliffcorner 3.png',
        'cliffturn 0.png',
        'cliffturn 1.png',
        'cliffturn 2.png',
        'cliffturn 3.png',
        'grass 0.png',
        'grasscorner 0.png',
        'grasscorner 1.png',
        'grasscorner 2.png',
        'grasscorner 3.png',
        'road 0.png',
        'road 1.png',
        'road 2.png',
        'road 3.png',
        'roadturn 0.png',
        'roadturn 1.png',
        'roadturn 2.png',
        'roadturn 3.png',
        'watercorner 0.png',
        'watercorner 1.png',
        'watercorner 2.png',
        'watercorner 3.png',
        'waterside 0.png',
        'waterside 1.png',
        'waterside 2.png',
        'waterside 3.png',
        'waterturn 0.png',
        'waterturn 1.png',
        'waterturn 2.png',
        'waterturn 3.png',
        'water_a 0.png',
        'water_b 0.png',
        'water_c 0.png',
      ];

      for (let i = 0; i < res.length; i++) {
        res[i] = `${BASE_URL}assets/tiles/${type}/${res[i]}`;
      }
      return res;
    } else {
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
  }

  generate(type, assetManager) {
    if (type === 'forest') {
      console.log('Spawning all');
      const meshes = {};
      for (let i = 0; i < assetManager.textures.length; i++) {
        let material =
          i > 168 && i < 192
            ? new THREE.MeshBasicMaterial({
                map: assetManager.textures[i],
              })
            : new THREE.MeshBasicMaterial({
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
