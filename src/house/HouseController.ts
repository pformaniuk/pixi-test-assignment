import { Container } from "pixi.js";
import { HouseView } from "./view/HouseView";
import config from '../config.json';
import { ElevatorController } from "./ElevatorController";
import { FloorController } from "./FloorController";

export class HouseController {
    private elevatorController: ElevatorController;
    private floorController: FloorController;

    private house: HouseView;
    constructor(stage: Container) {
        this.house = new HouseView(config.floors);
        stage.addChild(this.house);

        this.elevatorController = new ElevatorController(this.house);
        this.floorController = new FloorController(this.house);
    }
}