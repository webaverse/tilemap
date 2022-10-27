import metaversefile from 'metaversefile';
import Tiles from './tiles';

const {
  useApp,
  useFrame,
  useCamera,
  useLocalPlayer,
  usePhysics,
  useProcGenManager,
  useGPUTask,
  useGenerationTask,
} = metaversefile;

export default e => {
  const app = useApp();
  const camera = useCamera();
  const procGenManager = useProcGenManager();
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
        await Promise.all([tiles.waitForLoad()]);
      };
      await _waitForLoad();

      // frame handling
      frameCb = () => {};
    })(),
  );

  useFrame(() => {
    frameCb && frameCb();
  });

  return app;
};
