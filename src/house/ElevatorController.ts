import config from '../config.json';
import { HouseView } from "./view/HouseView";
import { ElevatorModel } from "./model/ElevatorModel";
import { ElevatorShaftView } from "./view/ElevatorShaftView";
import { ElevatorCageView } from "./view/ElevatorCageView";
import * as TWEEN from "@tweenjs/tween.js";
import { ElevatorDirection } from './model/ElevatorStatus';
import { eventBus, HouseEvents } from './model/EventEmitter';
import { PersonModel } from './model/PersonModel';

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
        eventBus.on(HouseEvents.LOAD_PASSENGERS, this.onLoadPassengers.bind(this));
        eventBus.on(HouseEvents.UNLOAD_PASSENGERS, this.onUnloadPassengers.bind(this));
    }

    private moveElevatorToNextFloor() {
        let nextFloor: number;
        if (this.elevatorModel.currentFloor === config.floors - 1) {
            this.direction = ElevatorDirection.DOWN;
        } else if (this.elevatorModel.currentFloor === 0) {
            this.direction = ElevatorDirection.UP;
        }

        if (this.direction === ElevatorDirection.UP) {
            nextFloor = this.elevatorModel.currentFloor + 1;
        } else {
            nextFloor = this.elevatorModel.currentFloor - 1;
        }

        this.moveElevatorToFloor(nextFloor);
    }

    private moveElevatorToFloor(floor: number) {
        const y = this.house.buildingHeightValue - (floor * this.house.floorHeightValue) - this.elevatorCageView.height;
        new TWEEN.Tween(this.elevatorCageView.position, true).to({ y }, config.elevatorSpeed * 1000)
        .onComplete(async () => {
            this.elevatorModel.currentFloor = floor;
            eventBus.emit(HouseEvents.ELEVATOR_ARRIVED, floor, this.direction, this.elevatorModel.passengers);

            await new Promise(resolve => setTimeout(resolve, config.elevatorDelayTime));

            this.moveElevatorToNextFloor();
        })
        .start();
    }

    private onLoadPassengers(passengers: PersonModel[]) {
        this.elevatorModel.passengers.push(...passengers);
    }

    private onUnloadPassengers(passengers: PersonModel[], floor: number, direction: ElevatorDirection) {
        const idsToRemove = new Set(passengers.map(p => p.id));
        this.elevatorModel.passengers = this.elevatorModel.passengers.filter(
            p => !idsToRemove.has(p.id)
        );
        eventBus.emit(HouseEvents.PASSENGER_UNLOADED, floor, direction, this.elevatorModel.passengers);
    }
}   