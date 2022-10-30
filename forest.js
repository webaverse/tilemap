import map from './utils/map';
import biome from './utils/biome';

export function generateForest(width, height, meshes) {
  const biomes = [
    new biome('forest', 0.2, 0.4, 0.4, 10, [
      'sprite_159',
      'sprite_160',
      'sprite_161',
      'sprite_162',
      'sprite_163',
      'sprite_164',
    ]),
    new biome('grass', 0.2, 0.5, 0.3, 10, [
      'sprite_010',
      'sprite_013',
      'sprite_016',
      'sprite_050',
    ]),
    new biome('water', 0, 0, 0, 0, ['sprite_150', 'sprite_151', 'sprite_152']),
    new biome('ground', 0.2, 0, 0, 5, [
      'sprite_138',
      'sprite_139',
      'sprite_140',
      'sprite_141',
      'sprite_142',
      'sprite_143',
    ]),
  ];

  const heightWaves = [
    {seed: 500, frequency: 0.05, amplitude: 1},
    {seed: 12.5, frequency: 0.1, amplitude: 0.5},
  ];

  const moistureWaves = [{seed: 0.5, frequency: 0.03, amplitude: 1}];

  const heatWaves = [
    {seed: 841, frequency: 0.04, amplitude: 1},
    {seed: 125.4, frequency: 0.02, amplitude: 0.5},
  ];

  const m = new map(
    biomes,
    width,
    height,
    1,
    [0, 0],
    heightWaves,
    moistureWaves,
    heatWaves,
    meshes,
  );

  return m;
}
