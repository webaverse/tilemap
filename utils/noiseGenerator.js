import { cubicNoiseConfig, cubicNoiseSample2 } from "./cubicNoise";
import Perlin from "./perlinNoise";

export default function Generate(width, height, scale, waves, offset) {
  const noiseMap = [,];
  const noise = new Perlin();

  for (let x = 0; x < width; ++x) {
    for (let y = 0; y < height; ++y) {
      const samplePosX = x * scale + offset[0];
      const samplePosY = y * scale + offset[1];

      let normalization = 0;

      for (let i = 0; i < waves; ++i) {
        const perlinRes = noise.noise(
          samplePosX * waves[i].frequency + waves[i].seed,
          samplePosY * waves[i].frequency + waves[i].seed
        );
        noiseMap[(x, y)] = waves[i].amplitude * perlinRes;
        normalization += waves[i].amplitude;
      }

      noiseMap[(x, y)] /= normalization;
    }
  }

  return noiseMap;
}

export function GenerateCubic(seed, width, height, scale, waves, offset) {
  const noiseMap = [,];

  for (let x = 0; x < width; ++x) {
    for (let y = 0; y < height; ++y) {
      const samplePosX = x * scale + offset[0];
      const samplePosY = y * scale + offset[1];

      let normalization = 0;

      for (let i = 0; i < waves; ++i) {
        const noise = cubicNoiseSample2(
          cubicNoiseConfig(seed, 0, 0),
          samplePosX * waves[i].frequency + waves[i].seed,
          samplePosY * waves[i].frequency + waves[i].seed
        );
        noiseMap[(x, y)] = waves[i].amplitude * noise;
        normalization += waves[i].amplitude;
      }

      noiseMap[(x, y)] /= normalization;
    }
  }

  return noiseMap;
}

export class Wave {
  seed;
  frequency;
  amplitude;

  constructor(seed, frequency, amplitude) {
    this.seed = seed;
    this.frequency = frequency;
    this.amplitude = amplitude;
  }
}
