import { Container } from "pixi.js";
import { HouseView } from "./House";
import config from '../config.json';
import { ElevatorStatus } from "./Elevator";
import { Elevator } from "./Elevator";
import { ElevatorView } from "./Elevator";

export class HouseController {
    private house: HouseView;
    constructor(stage: Container) {
        this.house = new HouseView(config.floors);
        stage.addChild(this.house);
       
        const elevator = new Elevator(config.elevatorMaxCapacity, config.elevatorSpeed, config.elevatorDelayTime, 1, 1, ElevatorStatus.STOPPED, []);
        const elevatorView = new ElevatorView(elevator);
        this.house.attachElevator(elevatorView);
    }
}