import { Container } from "pixi.js";
import { HouseView } from "./view/HouseView";
import config from "../config.json";
import { ElevatorController } from "./ElevatorController";
import { FloorController } from "./FloorController";

export class HouseController {
  private house: HouseView;
  constructor(stage: Container) {
    this.house = new HouseView(config.floors);
    stage.addChild(this.house);

    new ElevatorController(this.house);
    new FloorController(this.house);
  }
}
