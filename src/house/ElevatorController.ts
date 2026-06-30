import config from "../config.json";
import { HouseView } from "./view/HouseView";
import { ElevatorModel } from "./model/ElevatorModel";
import { ElevatorShaftView } from "./view/ElevatorShaftView";
import { ElevatorCageView } from "./view/ElevatorCageView";
import * as TWEEN from "@tweenjs/tween.js";
import { ElevatorDirection } from "./model/ElevatorStatus";
import { eventBus, HouseEvents } from "./model/EventEmitter";
import { PersonModel } from "./model/PersonModel";
import { PersonView } from "./view/PersonView";
import { StopRequest } from "./model/StopRequest";

export class ElevatorController {
  private ELEVATOR_SHAFT_WIDTH: number = 100;

  private elevatorCageView: ElevatorCageView;
  private elevatorShaftView: ElevatorShaftView;
  private elevatorModel: ElevatorModel;
  private direction: ElevatorDirection = ElevatorDirection.UP;
  private stopRequests: StopRequest[] = [];

  constructor(private house: HouseView) {
    this.elevatorModel = new ElevatorModel(
      config.elevatorMaxCapacity,
      config.elevatorSpeed,
      config.elevatorDelayTime,
    );
    this.elevatorShaftView = new ElevatorShaftView(
      this.ELEVATOR_SHAFT_WIDTH,
      this.house.height,
    );
    this.elevatorCageView = new ElevatorCageView(
      this.elevatorModel,
      this.ELEVATOR_SHAFT_WIDTH,
      this.house.floorHeightValue,
    );
    this.elevatorCageView.position.y =
      this.house.buildingHeightValue - this.house.floorHeightValue;

    this.house.attachElevator(this.elevatorShaftView, this.elevatorCageView);
    this.moveElevatorToNextFloor();
    eventBus.on(HouseEvents.LOAD_PASSENGERS, this.onLoadPassengers.bind(this));
    eventBus.on(
      HouseEvents.UNLOAD_PASSENGERS,
      this.onUnloadPassengers.bind(this),
    );
    eventBus.on(
      HouseEvents.PERSON_REACHED_ELEVATOR,
      this.onPersonReachedElevator.bind(this),
    );
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
    const y =
      this.house.buildingHeightValue -
      floor * this.house.floorHeightValue -
      this.elevatorCageView.height;
    new TWEEN.Tween(this.elevatorCageView.position, true)
      .to({ y }, config.elevatorSpeed * 1000)
      .onComplete(async () => {
        this.elevatorModel.currentFloor = floor;
        if (this.shouldStopAtFloor(floor, this.direction)) {
          eventBus.emit(
            HouseEvents.ELEVATOR_ARRIVED,
            floor,
            this.direction,
            this.elevatorModel.passengers,
          );
          await new Promise((resolve) =>
            setTimeout(resolve, config.elevatorDelayTime),
          );
        }

        this.moveElevatorToNextFloor();
      })
      .start();
  }

  private onLoadPassengers(passengers: PersonModel[]) {
    if (passengers.length === 0) return;
    this.elevatorModel.passengers.push(...passengers);
    this.elevatorCageView.addPassenger(
      ...passengers.map((p) => new PersonView(p)),
    );
    this.stopRequests = this.stopRequests.filter(
      (r) => !passengers.some((p) => p.id === r.passengerId),
    );
  }

  private onUnloadPassengers(
    passengers: PersonModel[],
    floor: number,
    direction: ElevatorDirection,
  ) {
    const idsToRemove = new Set(passengers.map((p) => p.id));
    this.elevatorModel.passengers = this.elevatorModel.passengers.filter(
      (p) => !idsToRemove.has(p.id),
    );

    const viewsToRemove = this.elevatorCageView.children.filter(
      (c) =>
        c instanceof PersonView && passengers.some((p) => p.id === c.person.id),
    );
    viewsToRemove.forEach((v) =>
      this.elevatorCageView.removePassenger(v as PersonView),
    );
    eventBus.emit(
      HouseEvents.PASSENGER_UNLOADED,
      floor,
      direction,
      this.elevatorModel.passengers,
    );
  }

  private onPersonReachedElevator(request: StopRequest) {
    this.stopRequests.push(request);
  }

  private shouldStopAtFloor(floor: number, direction: ElevatorDirection) {
    return (
      this.stopRequests.some(
        (r) =>
          r.floor === floor &&
          (r.direction === direction ||
            floor === 0 ||
            floor === config.floors - 1),
      ) ||
      this.elevatorModel.passengers.some((p) => p.destinationFloor === floor)
    );
  }
}
