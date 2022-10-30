export default class biome {
  name;
  minHeight;
  minMoisture;
  minHeat;
  maxProps;
  tiles;

  constructor(name, minHeight, minMoisture, minHeat, maxProps, tiles) {
    this.name = name;
    this.minHeight = minHeight;
    this.minMoisture = minMoisture;
    this.minHeat = minHeat;
    this.maxProps = maxProps;
    this.tiles = tiles;
  }

  getRandomTile() {
    console.log(this.name, ':tiles:', this.tiles);
    return this.tiles[Math.floor(Math.random() * this.tiles.length)];
  }

  matchCondition(height, moisture, heat) {
    return (
      height > this.minHeight &&
      moisture >= this.minMoisture &&
      heat >= this.minHeat
    );
  }
}
