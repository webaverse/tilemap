export default class biome {
  name;
  minHeight;
  minMoisture;
  minHeat;
  maxProps;

  constructor(name, minHeight, minMoisture, minHeat, maxProps) {
    this.name = name;
    this.minHeight = minHeight;
    this.minMoisture = minMoisture;
    this.minHeat = minHeat;
    this.maxProps = maxProps;
  }

  matchCondition(height, moisture, heat) {
    return (
      height > this.minHeight &&
      moisture >= this.minMoisture &&
      heat >= this.minHeat
    );
  }
}
