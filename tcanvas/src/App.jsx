import { useState } from "react";
import "./App.css";
import Perlin from "../../utils/perlinNoise";
import { cubicNoiseConfig, cubicNoiseSample2 } from "../../utils/cubicNoise";

function App() {
  useState(() => {
    const noise = new Perlin();
    const perlinRes = noise.noise(1, 4);
    console.log("perlin res", perlinRes);

    const cubicNoise = cubicNoiseSample2(cubicNoiseConfig(5, 0, 0), 1, 4);
    console.log("cubic res", cubicNoise);

    const canvas = document.querySelector("canvas");
    if (!canvas) {
      return;
    }

    console.log(canvas);
    const ctx = canvas.getContext("2d");

    const newImgData = ctx.createImageData(canvas.width, canvas.height);
    for (let i = 0; i < newImgData.data.length; i += 4) {
      newImgData.data[i] = 0;
      newImgData.data[i + 1] = 0;
      newImgData.data[i + 2] = 0;
      newImgData.data[i + 3] = 255;
    }
    ctx.putImageData(newImgData, 0, 0);
  }, []);

  return (
    <div className="App">
      <h2>Map</h2>
      <canvas width={640} height={640}></canvas>
    </div>
  );
}

export default App;
