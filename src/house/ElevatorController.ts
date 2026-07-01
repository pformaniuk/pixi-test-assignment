import config from "../config.json";
import { HouseView } from "./view/HouseView";
import { ElevatorModel } from "./model/ElevatorModel";
import { ElevatorShaftView } from "./view/ElevatorShaftView";
import { ElevatorCageView } from "./view/ElevatorCageView";
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

  constructor(private house: HouseView) {
    this.elevatorModel = new ElevatorModel(
      config.elevatorMaxCapacity,
      config.elevatorSpeed,
      config.elevatorDelayTime,
      config.floors,
    );
    this.elevatorShaftView = new ElevatorShaftView(
      this.ELEVATOR_SHAFT_WIDTH,
      this.house.height,
    );
    this.elevatorCageView = new ElevatorCageView(
      this.elevatorModel,
      this.ELEVATOR_SHAFT_WIDTH,
      this.house.floorHeightValue,
      this.house.height,
      this.house.floorHeightValue,
    );
  
    this.house.attachElevator(this.elevatorShaftView, this.elevatorCageView);
    this.moveElevatorToNextFloor();

    eventBus.on(HouseEvents.LOAD_PASSENGERS, this.onLoadPassengers.bind(this));
    eventBus.on(HouseEvents.UNLOAD_PASSENGERS,this.onUnloadPassengers.bind(this));
    eventBus.on(HouseEvents.PERSON_REACHED_ELEVATOR, this.onPersonReachedElevator.bind(this));
  }

  private moveElevatorToNextFloor() {
    const nextFloor = this.elevatorModel.getNextFloor();

    this.elevatorCageView.moveToFloor(
      nextFloor,
      this.onElevatorMovedToFloor.bind(this, nextFloor),
    );
  }

  private async onElevatorMovedToFloor(floor: number) {
      this.elevatorModel.currentFloor = floor;
      if (this.elevatorModel.shouldStopAtFloor) {
        eventBus.emit(
          HouseEvents.ELEVATOR_ARRIVED,
          floor,
          this.elevatorModel.direction,
          this.elevatorModel.passengers,
        );
        await new Promise((resolve) =>
          setTimeout(resolve, this.elevatorModel.dellayTime),
        );
      }

      this.moveElevatorToNextFloor();
  }

  private onLoadPassengers(passengers: PersonModel[]) {
    if (passengers.length === 0) return;
    this.elevatorModel.passengers.push(...passengers);
    this.elevatorCageView.addPassenger(
      ...passengers.map((p) => new PersonView(p)),
    );
    this.elevatorModel.fulfillStopRequestsForPassengers(passengers);
  }

  private onUnloadPassengers(passengers: PersonModel[], floor: number,direction: ElevatorDirection) {
    this.elevatorModel.unloadPassengers(passengers);
    this.elevatorCageView.unloadPassengers(passengers);

    eventBus.emit(HouseEvents.PASSENGER_UNLOADED, floor, direction, this.elevatorModel.passengers);
  }

  private onPersonReachedElevator(request: StopRequest) {
    this.elevatorModel.addStopRequest(request);
  }
}
