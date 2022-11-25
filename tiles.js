import * as THREE from 'three';
import AssetManager from './asset-manager';
import generateForest from './forest';
import {generateImage} from './request_manager';

// this file's base url
const BASE_URL = import.meta.url.replace(/(\/)[^\/\\]*$/, '$1');

export const TILE_SIZE = 1;
export const TILE_AMOUNT = 50;

export default class Tiles extends THREE.Object3D {
  ioManager = new EventTarget();
  tempTiles = [];
  allMeshes = [];

  constructor() {
    super();
    this.name = 'tiles';
    document.addEventListener('keydown', e => {
      if (e.key == 'u') {
        console.log('regenerating tiles');
        this.regenerateTiles(this.tempTiles);
      }
    });
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

    return res;
  }

  generate(type, assetManager, textures, info) {
    const meshes = {};
    const data = {};

    for (const [key, value] of Object.entries(textures)) {
      data[key] = [];
      for (let i = 0; i < value.length; i++) {
        if (Object.prototype.toString.call(value[i]) === '[object Array]') {
          console.log('is array:', i);
          const d = [];
          for (let j = 0; j < value[i].length; j++) {
            const material =
              key.includes('deep forest') ||
              key.includes('forest') ||
              key.includes('stone ground') ||
              key.includes('grass') ||
              key.includes('sand') ||
              key.includes('water')
                ? new THREE.MeshStandardMaterial({
                    map: value[i][j],
                  })
                : new THREE.MeshStandardMaterial({
                    map: value[i][j],
                    blending: 1,
                    transparent: true,
                  });
            const geometry = new THREE.PlaneGeometry(1, 1);
            geometry.rotateX(-Math.PI / 2);
            const mesh = new THREE.Mesh(geometry, material);
            mesh.position.set(0, 0, 0);
            meshes[key + '_' + i + '_' + j] = mesh;
            d.push(key + '_' + i + '_' + j);
            console.log('pushed:', key + '_' + i + '_' + j);
          }
          data[key].push(d);
          console.log('this.d:', d, "data:', data");
        } else {
          if (key.includes('tree')) {
            let material =
              key.includes('deep forest') ||
              key.includes('forest') ||
              key.includes('stone ground') ||
              key.includes('grass') ||
              key.includes('sand') ||
              key.includes('water')
                ? new THREE.MeshStandardMaterial({
                    map: value[i],
                  })
                : new THREE.MeshStandardMaterial({
                    map: value[i],
                    blending: 1,
                    transparent: true,
                  });
            let geometry = new THREE.PlaneGeometry(1, 1);
            geometry.rotateX(-Math.PI / 2);
            let mesh = new THREE.Mesh(geometry, material);
            mesh.position.set(0, 0, 0);
            meshes[key + '_' + i + '_' + 0] = mesh;
            data[key].push(key + '_' + i + '_' + 0);

            i++;
            material =
              key.includes('deep forest') ||
              key.includes('forest') ||
              key.includes('stone ground') ||
              key.includes('grass') ||
              key.includes('sand') ||
              key.includes('water')
                ? new THREE.MeshStandardMaterial({
                    map: value[i],
                  })
                : new THREE.MeshStandardMaterial({
                    map: value[i],
                    blending: 1,
                    transparent: true,
                  });
            geometry = new THREE.PlaneGeometry(1, 1);
            geometry.rotateX(-Math.PI / 2);
            mesh = new THREE.Mesh(geometry, material);
            mesh.position.set(0, 0, 0);
            meshes[key + '_' + (i - 1) + '_' + 1] = mesh;
            data[key].push(key + '_' + (i - 1) + '_' + 1);
          } else {
            const material =
              key.includes('deep forest') ||
              key.includes('forest') ||
              key.includes('stone ground') ||
              key.includes('grass') ||
              key.includes('sand') ||
              key.includes('water')
                ? new THREE.MeshStandardMaterial({
                    map: value[i],
                  })
                : new THREE.MeshStandardMaterial({
                    map: value[i],
                    blending: 1,
                    transparent: true,
                  });
            const geometry = new THREE.PlaneGeometry(1, 1);
            geometry.rotateX(-Math.PI / 2);
            const mesh = new THREE.Mesh(geometry, material);
            mesh.position.set(0, 0, 0);
            meshes[key + '_' + i] = mesh;
            data[key].push(key + '_' + i);
          }
        }
      }
    }

    const start = new Date();
    console.log('OUTDATA:', data);
    const output = generateForest(
      meshes,
      data[info + ' deep forest'],
      data[info + ' forest'],
      data[info + ' stone ground'],
      data[info + ' grass'],
      data[info + ' sand'],
      data[info + ' water'],
      data[info + ' tree'],
      data[info + ' rock'],
      data[info + ' flower'],
      data[info + ' bush'],
      data[info + ' sand bush'],
      data[info + ' torch'],
      info,
    );
    output.meshes.map(f => this.add(f));
    this.allMeshes = output.allMeshes;

    const timeDiff = new Date() - start;
    console.log('time ran:', timeDiff);
    /*if (type === 'forest') {
      const meshes = {};
      for (let i = 0; i < assetManager.textures.length; i++) {
        let material =
          (i > 168 && i < 192) || i > 199
            ? new THREE.MeshBasicMaterial({
                map: assetManager.textures[i],
                blending: 1,
                transparent: true,
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
    }*/
  }

  async regenerateTiles(tiles) {
    const textures = {};

    for (let i = 0; i < tiles.length; i++) {
      textures[tiles[i]] = [];
      //get radnom int from 1 to 5
      const num =
        tiles[i].includes('path') || tiles[i].includes('house')
          ? 1
          : Math.floor(Math.random() * 5) + 1;
      for (let j = 0; j < num; j++) {
        const img = await generateImage(tiles[i]);
        textures[tiles[i]].push(img);
      }
    }

    const _tiles = [];
    for (const [key, value] of Object.entries(textures)) {
      for (let i = 0; i < value.length; i++) {
        _tiles.push(value[i]);
      }
    }

    const assetManager = await AssetManager.loadUrls(_tiles);

    for (const [key, value] of Object.entries(textures)) {
      for (let j = 0; j < value.length; j++) {
        for (let i = 0; i < assetManager.textures.length; i++) {
          if (value[j] == assetManager.textures[i].source.data.currentSrc) {
            textures[key][j] = assetManager.textures[i];
            break;
          }
        }
      }
    }

    const data = {};

    for (const [key, value] of Object.entries(textures)) {
      data[key] = [];
      for (let i = 0; i < value.length; i++) {
        data[key].push({name: key + '_' + i, texture: value[i]});
      }
    }

    //set the new texture to the material
    for (let i = 0; i < this.allMeshes.length; i++) {
      for (const [key, value] of Object.entries(data)) {
        const n = this.allMeshes[i].type
          .toLowerCase()
          .replace('_', '')
          .replace(/[0-9]/g, '');
        const k = key.toLowerCase();

        if (n.includes(k)) {
          this.allMeshes[i].mesh.material.map =
            value[randomIntFromInterval(0, value.length - 1)].texture;
          break;
        }
      }
    }
  }

  async waitForLoad(type, length, textures, info, tempTiles) {
    this.tempTiles = tempTiles;
    //const tiles = this.loadTiles(type, length);
    const _tiles = textures ? [] : tiles;
    if (textures) {
      for (const [key, value] of Object.entries(textures)) {
        for (let i = 0; i < value.length; i++) {
          _tiles.push(value[i]);
        }
      }
    }
    const assetManager = await AssetManager.loadUrls(_tiles);

    for (const [key, value] of Object.entries(textures)) {
      for (let j = 0; j < value.length; j++) {
        for (let i = 0; i < assetManager.textures.length; i++) {
          if (value[j] == assetManager.textures[i].source.data.currentSrc) {
            textures[key][j] = assetManager.textures[i];
            break;
          }
        }
      }
    }
    this.generate(type, assetManager, textures, info);
  }
}

function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
