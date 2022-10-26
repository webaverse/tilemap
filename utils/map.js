import Generate from "./noiseGenerator";

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

  constructor(
    biomes,
    width,
    height,
    scale,
    offset,
    heightWaves,
    moistureWaves,
    heatWaves
  ) {
    this.biomes = biomes;
    this.width = width;
    this.height = height;
    this.scale = scale;
    this.offset = offset;
    this.heightWaves = heightWaves;
    this.moistureWaves = moistureWaves;
    this.heatWaves = heatWaves;

    this.heightMap = Generate(
      this.width,
      this.height,
      this.scale,
      this.heightWaves,
      this.offset
    );
    this.moistureMap = Generate(
      this.width,
      this.height,
      this.scale,
      this.moistureWaves,
      this.offset
    );
    this.heatMap = Generate(
      this.width,
      this.height,
      this.scale,
      this.heatWaves,
      this.offset
    );

    for (let x = 0; x < width; ++x) {
      for (let y = 0; y < height; ++y) {
        biome = getBiome(
          this.heightMap[(x, y)],
          this.moistureMap[(x, y)],
          this.heatMap[(x, y)]
        );

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
  }

  getBiome(height, moisture, heat) {
    res = null;
    biomeTemp = [];

    for (let i = 0; i < this.biomes.length; i++) {
      if (biones[i].matchCondition(height, moisture, heat)) {
        biomeTemp.push(new biomeTempData(biomes[i]));
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
      biome.minHeight +
      (moisture - biome.minMoisture) +
      (heat - biome.minHeat)
    );
  }
}
