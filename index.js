import * as THREE from 'three';
import metaversefile from 'metaversefile';
import Tiles from './tiles';
import {
  getBiomeInfo,
  getBiomeType,
  generateImage,
  generateImageCache,
} from './request_manager';

const {useApp, useFrame, useCleanup, usePhysics} = metaversefile;

const TEST_PROMPTS = [
  //'Unicorn Forest',
  //'Icy Forest',
  //'Haunted Forest',
  //"Wizard's Forest",
  'Rainbow Forest',
  //'Dark Forest',
  //'Blazing Forest',
  //'Crystal Cave',
  //'Haunted Dungeon',
];
//get random prompt
const TEST_PROMPT =
  TEST_PROMPTS[Math.floor(Math.random() * TEST_PROMPTS.length)];

const available_biomes = [
  {
    name: 'forest',
    tiles: [
      'deep forest',
      'forest',
      'stone ground',
      'grass',
      'sand',
      'water',
      'tree',
      'rock',
      'flower',
      'bush',
      'sand bush',
      'house Up Left',
      'house Up Middle',
      'house Up Right',
      'house Middle Left',
      'house Middle Middle',
      'house Middle Right',
      'house Down Left',
      'house Down Middle',
      'house Down Right',
      'path Up Straight',
      'path Down Straight',
      'path Up Left',
      'path Up Right',
      'path Down Left',
      'path Down Right',
      'path Middle',
      'path Left Straight',
      'path Right Straight',
      'path Up End',
      'path Down End',
      'path Left End',
      'path Right End',
      'path Misc',
      'torch',
    ],
  },
  {name: 'dungeon', tiles: []},
];

export default e => {
  const app = useApp();
  const physics = usePhysics();

  // locals

  let frameCb = null;

  // initialization
  e.waitUntil(
    (async () => {
      //Get the biome information from the prompt
      const biomeType = (await getBiomeType(TEST_PROMPT)).trim();
      const biomeInfo = (await getBiomeInfo(TEST_PROMPT)).trim();
      const biome = available_biomes.find(b => b.name === biomeType);

      //Update the tile names of the selected biome based on the prompt
      for (let i = 0; i < biome.tiles.length; i++) {
        biome.tiles[i] = biomeInfo.trim() + ' ' + biome.tiles[i];
      }

      const tempTiles = biome.tiles;

      const textures = {};

      //generate the new tiles
      const start = new Date();
      for (let i = 0; i < biome.tiles.length; i++) {
        let prev = '';
        textures[biome.tiles[i]] = [];
        const num =
          biome.tiles[i].includes('path') || biome.tiles[i].includes('house')
            ? 1
            : Math.floor(Math.random() * 5) + 1;
        for (let j = 0; j < num; j++) {
          if (biome.tiles[i].includes('tree')) {
            const img1 = await generateImageCache(biome.tiles[i] + '_' + 1);
            textures[biome.tiles[i]].push(img1);
            const img2 = await generateImageCache(biome.tiles[i] + '_' + 2);
            textures[biome.tiles[i]].push(img2);
          } else {
            const img = await generateImageCache(biome.tiles[i]);
            textures[biome.tiles[i]].push(img);
            prev = img;
          }
        }
      }
      console.log('generated images:', textures);
      const timeDiff = new Date() - start;
      console.log('Execution time: %dms', timeDiff);

      const tiles = new Tiles();
      app.add(tiles);

      // load
      const _waitForLoad = async () => {
        await Promise.all([
          tiles.waitForLoad('forest', 230, textures, biomeInfo, tempTiles),
        ]);
      };
      await _waitForLoad();

      // frame handling
      frameCb = () => {};
    })(),
  );

  // add physics
  const geometry = new THREE.PlaneGeometry(0.01, 0.01);
  geometry.rotateY(Math.PI / 2); // note: match with physx' default plane rotation.
  const material = new THREE.MeshStandardMaterial({color: 'red'});
  const physicsPlane = new THREE.Mesh(geometry, material);
  physicsPlane.rotation.set(0, 0, Math.PI / 2);
  app.add(physicsPlane);
  physicsPlane.updateMatrixWorld();

  const physicsObject = physics.addPlaneGeometry(
    new THREE.Vector3(0, 0, 0),
    new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, Math.PI / 2)),
    false,
  );

  useFrame(() => {
    frameCb && frameCb();
  });

  useCleanup(() => {
    physics.removeGeometry(physicsObject);
  });

  return app;
};
