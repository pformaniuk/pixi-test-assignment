import { Container } from "pixi.js";
import { HouseView } from "./House";
import config from '../config.json';
import { Elevator } from "./Elevator";
import { ElevatorShaftView, ElevatorCageView } from "./Elevator";

export class HouseController {
    private ELEVATOR_SHAFT_WIDTH: number = 100;

    private house: HouseView;
    constructor(stage: Container) {
        this.house = new HouseView(config.floors);
        stage.addChild(this.house);
       
        const elevator = new Elevator(config.elevatorMaxCapacity, config.elevatorSpeed, config.elevatorDelayTime);
        const elevatorShaftView = new ElevatorShaftView(this.ELEVATOR_SHAFT_WIDTH, this.house.height);
        const elevatorCageView = new ElevatorCageView(elevator, this.ELEVATOR_SHAFT_WIDTH, this.house.floorHeightValue );

        this.house.attachElevator(elevatorShaftView, elevatorCageView);
    }
}