import * as THREE from 'three';
import AssetManager from './AssetManager.js';
import {generate} from './libs/generate/index.js';
import {Data} from './libs/utils/index.js';

export default class Dungeon extends THREE.Object3D {
  constructor() {
    super();
    this.name = 'dungeon';
    this.dungeon = generate({
      mapWidth: 40,
      mapHeight: 20,
      mapGutterWidth: 2,
      iterations: 15,
      containerMinimumSize: 4,
      containerMinimumRatio: 0.45,
      containerSplitRetries: 30,
      corridorWidth: 4,
      tileWidth: 32,
      seed: '5ML3875MwgFzyejjoFV9i',
      debug: false,
      rooms: Data.loadRooms(),
    });
    console.log(this.dungeon);
  }

  async waitForLoad() {
    const assetManager = new AssetManager();
    const assets = await assetManager.load();
    this.generate(assets);
  }

  generate(assets) {
    console.log(assets);
  }
}
