import * as THREE from 'three';

const textureLoader = new THREE.TextureLoader();

const _loadTexture = u =>
  new Promise((accept, reject) => {
    // TODO : use ktx2 loader instead
    textureLoader.load(
      u,
      t => {
        accept(t);
      },
      function onProgress() {},
      err => {
        console.error('Asset manager : Loading texture failed : ', err);
      },
    );
  });

export default class AssetManager {
  constructor(textures) {
    this.textures = textures;
  }

  static async loadUrls(urls) {
    const assets = await Promise.all(urls.map(_loadTexture));
    console.log('assets loaded:', assets);
    const d = assets[0].source.data.src.split('/');
    console.log(
      'first src:',
      assets[0].source.data.src,
      'name:',
      d[d.length - 1],
    );

    const manager = new AssetManager(assets);
    return manager;
  }
}
