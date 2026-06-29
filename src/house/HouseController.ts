import { Container } from "pixi.js";
import { HouseView } from "./view/HouseView";
import config from '../config.json';
import { ElevatorModel } from "./model/ElevatorModel";
import { ElevatorShaftView } from "./view/ElevatorShaftView";
import { ElevatorCageView } from "./view/ElevatorCageView";

export class HouseController {
    private ELEVATOR_SHAFT_WIDTH: number = 100;

    private house: HouseView;
    constructor(stage: Container) {
        this.house = new HouseView(config.floors);
        stage.addChild(this.house);
       
        const elevator = new ElevatorModel(config.elevatorMaxCapacity, config.elevatorSpeed, config.elevatorDelayTime);
        const elevatorShaftView = new ElevatorShaftView(this.ELEVATOR_SHAFT_WIDTH, this.house.height);
        const elevatorCageView = new ElevatorCageView(elevator, this.ELEVATOR_SHAFT_WIDTH, this.house.floorHeightValue );

        this.house.attachElevator(elevatorShaftView, elevatorCageView);
    }
}