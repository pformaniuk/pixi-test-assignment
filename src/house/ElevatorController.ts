import config from '../config.json';
import { HouseView } from "./view/HouseView";
import { ElevatorModel } from "./model/ElevatorModel";
import { ElevatorShaftView } from "./view/ElevatorShaftView";
import { ElevatorCageView } from "./view/ElevatorCageView";

export class ElevatorController {
    private ELEVATOR_SHAFT_WIDTH: number = 100;
    
    constructor(private house: HouseView) {
        const elevatorModel = new ElevatorModel(config.elevatorMaxCapacity, config.elevatorSpeed, config.elevatorDelayTime);
        const elevatorShaftView = new ElevatorShaftView(this.ELEVATOR_SHAFT_WIDTH, this.house.height);
        const elevatorCageView = new ElevatorCageView(elevatorModel, this.ELEVATOR_SHAFT_WIDTH, this.house.floorHeightValue );

        this.house.attachElevator(elevatorShaftView, elevatorCageView);
    }
}   