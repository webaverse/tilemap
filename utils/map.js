import {TILE_AMOUNT, TILE_SIZE} from '../tiles';
import Generate, {GenerateCubic} from './noiseGenerator';

export default class map {
  biomes;

  width = 100;
  height = 100;
  scale = 1;
  offset = [0, 0];

  heightWaves = [];
  heightMap = [,];

  moistureWaves = [];
  moistureMap = [,];

  heatWaves = [];
  heatMap = [,];

  propCounts = {};

  meshes = [];

  constructor(
    biomes,
    width,
    height,
    scale,
    offset,
    heightWaves,
    moistureWaves,
    heatWaves,
    meshes,
  ) {
    this.biomes = biomes;
    this.width = width;
    this.height = height;
    this.scale = scale;
    this.offset = offset;
    this.heightWaves = heightWaves;
    this.moistureWaves = moistureWaves;
    this.heatWaves = heatWaves;

    console.log('generating maps');
    this.heightMap = Generate(
      this.width,
      this.height,
      this.scale,
      this.heightWaves,
      this.offset,
    );
    console.log('map 2 done');
    this.moistureMap = Generate(
      this.width,
      this.height,
      this.scale,
      this.moistureWaves,
      this.offset,
    );
    console.log('map 3 done');
    this.heatMap = Generate(
      this.width,
      this.height,
      this.scale,
      this.heatWaves,
      this.offset,
    );
    console.log('map 4 done');

    for (let z = 0; z < TILE_AMOUNT; z++) {
      for (let x = 0; x < TILE_AMOUNT; x++) {
        const biome = this.getBiome(
          this.heightMap[z][x],
          this.moistureMap[z][x],
          this.heatMap[z][x],
        );

        const tile = biome.getRandomTile();
        const cloneMesh = meshes[tile].clone();
        cloneMesh.position.set(
          (x - TILE_AMOUNT / 2) * TILE_SIZE,
          0.1,
          (z - TILE_AMOUNT / 2) * TILE_SIZE,
        );
        this.meshes.push(cloneMesh);

        const addProp =
          !this.propCounts[biome.name] ||
          (this.propCounts[biome.name] &&
            this.propCounts[biome.name] < biome.maxProps);

        if (addProp) {
          this.propCounts[biome.name] = this.propCounts[biome.name]
            ? this.propCounts[biome.name] + 1
            : 1;
        }
      }
    }

    console.log('loaded ' + this.meshes.length + ' meshes');
  }

  getBiome(height, moisture, heat) {
    let res = null;
    let biomeTemp = [];

    for (let i = 0; i < this.biomes.length; i++) {
      console.log(
        'checking biome:',
        this.biomes[i].name,
        'match:',
        this.biomes[i].matchCondition(height, moisture, heat),
        'input:',
        {height, moisture, heat},
        "biome's:",
        {
          height: this.biomes[i].minHeight,
          moisture: this.biomes[i].minMoisture,
          heat: this.biomes[i].minHeat,
        },
      );
      if (this.biomes[i].matchCondition(height, moisture, heat)) {
        biomeTemp.push(new biomeTempData(this.biomes[i]));
      }
    }

    let curVal = 0;

    for (let i = 0; i < biomeTemp.length; i++) {
      if (res == null) {
        res = biomeTemp[i].biome;
        curVal = biomeTemp[i].getDiffValue(height, moisture, heat);
      } else {
        if (biomeTemp[i].getDiffValue(height, moisture, heat) < curVal) {
          res = biomeTemp[i].biome;
          curVal = biomeTemp[i].getDiffValue(height, moisture, heat);
        }
      }
    }

    if (res == null) {
      console.log('biome is null, returning first:', this.biomes[0].name);
      return this.biomes[0];
    }

    return res;
  }
}

class biomeTempData {
  biome;

  constructor(biome) {
    this.biome = biome;
  }

  getDiffValue(height, moisture, heat) {
    return (
      height -
      this.biome.minHeight +
      (moisture - this.biome.minMoisture) +
      (heat - this.biome.minHeat)
    );
  }
}
