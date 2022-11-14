import * as THREE from 'three';
import AssetManager from './AssetManager.js';
import data from './dungeon.json';
import {tilesTextures} from './utils/textures.js';

export default class Dungeon extends THREE.Object3D {
  constructor() {
    super();
    this.name = 'dungeon';
    this.unitInPixels = 0.5;

    this.tileGroup = new THREE.Group();
    this.add(this.tileGroup);
    this.propGroup = new THREE.Group();
    this.add(this.propGroup);
    this.monsterGroup = new THREE.Group();
    this.add(this.monsterGroup);

    this.position.set(
      (-data.width * this.unitInPixels) / 2,
      0,
      (-data.height * this.unitInPixels) / 2,
    );
  }

  async waitForLoad() {
    const assetManager = new AssetManager();
    const assets = await assetManager.load();
    this.generate(assets);
  }

  generate(assets) {
    // Draw
    this.drawTiles(data.layers.tiles, tilesTextures(assets));
  }

  drawTiles = (tilemap, sprites) => {
    for (let y = 0; y < tilemap.length; y++) {
      for (let x = 0; x < tilemap[y].length; x++) {
        const id = tilemap[y][x];
        const texture = sprites[id];
        if (texture) {
          const geometry = new THREE.PlaneGeometry(
            this.unitInPixels,
            this.unitInPixels,
            1,
            1,
          );
          geometry.rotateX(-Math.PI / 2);
          const material = new THREE.MeshStandardMaterial({map: texture});
          const sprite = new THREE.Mesh(geometry, material);
          sprite.position.set(x * this.unitInPixels, 0, y * this.unitInPixels);
          this.tileGroup.add(sprite);
        } else {
          const geometry = new THREE.PlaneGeometry(
            this.unitInPixels,
            this.unitInPixels,
            1,
            1,
          );
          geometry.rotateX(-Math.PI / 2);
          const material = new THREE.MeshStandardMaterial({color: 0xff0000});
          const sprite = new THREE.Mesh(geometry, material);
          sprite.position.set(x * this.unitInPixels, 0, y * this.unitInPixels);
          this.tileGroup.add(sprite);
        }
      }
    }
  };
}
