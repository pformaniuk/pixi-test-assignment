import config from '../config.json';
import { HouseView } from "./view/HouseView";
import { ElevatorModel } from "./model/ElevatorModel";
import { ElevatorShaftView } from "./view/ElevatorShaftView";
import { ElevatorCageView } from "./view/ElevatorCageView";
import * as TWEEN from "@tweenjs/tween.js";
import { ElevatorDirection } from './model/ElevatorStatus';

export class ElevatorController {
    private ELEVATOR_SHAFT_WIDTH: number = 100;

    private elevatorCageView: ElevatorCageView;
    private elevatorShaftView: ElevatorShaftView;
    private elevatorModel: ElevatorModel;
    private direction: ElevatorDirection = ElevatorDirection.UP;
    
    constructor(private house: HouseView) {
        this.elevatorModel = new ElevatorModel(config.elevatorMaxCapacity, config.elevatorSpeed, config.elevatorDelayTime);
        this.elevatorShaftView = new ElevatorShaftView(this.ELEVATOR_SHAFT_WIDTH, this.house.height);
        this.elevatorCageView = new ElevatorCageView(this.elevatorModel, this.ELEVATOR_SHAFT_WIDTH, this.house.floorHeightValue );
        this.elevatorCageView.position.y = this.house.buildingHeightValue - this.house.floorHeightValue;

        this.house.attachElevator(this.elevatorShaftView, this.elevatorCageView );
        this.moveElevatorToNextFloor();
    }

    private moveElevatorToNextFloor() {
        let nextFloor: number;
        if (this.elevatorModel.currentFloor === config.floors) {
            this.direction = ElevatorDirection.DOWN;
        } else if (this.elevatorModel.currentFloor === 1) {
            this.direction = ElevatorDirection.UP;
        }

        if (this.direction === ElevatorDirection.UP) {
            nextFloor = this.elevatorModel.currentFloor + 1;
        } else {
            nextFloor = this.elevatorModel.currentFloor - 1;
        }

        console.log('nextFloor', nextFloor);
        this.moveElevatorToFloor(nextFloor);
    }

    private moveElevatorToFloor(floor: number) {
        const y = this.house.buildingHeightValue - (floor * this.house.floorHeightValue);
        new TWEEN.Tween(this.elevatorCageView.position, true).to({ y }, config.elevatorSpeed * 1000)
        .onComplete(async () => {
            this.elevatorModel.currentFloor = floor;
            await new Promise(resolve => setTimeout(resolve, config.elevatorDelayTime));
            this.moveElevatorToNextFloor();
        })
        .start();
    }
}   