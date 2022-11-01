import * as THREE from 'three';
import metaversefile from 'metaversefile';
import Tiles from './tiles';

const {useApp, useFrame, useCleanup, usePhysics} = metaversefile;

export default e => {
  const app = useApp();
  const physics = usePhysics();

  // locals

  let frameCb = null;

  // initialization
  e.waitUntil(
    (async () => {
      const tiles = new Tiles();
      app.add(tiles);

      // load
      const _waitForLoad = async () => {
        await Promise.all([tiles.waitForLoad('forest', 200)]);
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
  console.log('added physics:', physicsObject);

  useFrame(() => {
    frameCb && frameCb();
  });

  useCleanup(() => {
    physics.removeGeometry(physicsObject);
  });

  return app;
};
