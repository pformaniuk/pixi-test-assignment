import { Application } from "pixi.js";
import { HouseController } from "./house/HouseController";
import * as TWEEN from "@tweenjs/tween.js";

(async () => {
  // Create a new application
  const app = new Application();

  await app.init({ background: "#1099bb", resizeTo: window });
  document.getElementById("pixi-container")!.appendChild(app.canvas);

  new HouseController(app.stage);

  // Listen for animate update
  app.ticker.add((ticker) => {
    TWEEN.update(ticker.lastTime);
  });
})();
