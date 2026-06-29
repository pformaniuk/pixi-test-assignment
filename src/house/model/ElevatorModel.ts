import { ElevatorStatus } from "./ElevatorStatus";
import { IElevatorModel } from "./IElevatorModel";
import { PersonModel } from "./PersonModel";

export class ElevatorModel implements IElevatorModel {
  public currentFloor: number;
  public destinationFloor: number;
  public status: ElevatorStatus;
  public passengers: PersonModel[];

  constructor(public maxCapacity: number, public speed: number, public dellayTime: number) {
    this.currentFloor = 1;
    this.destinationFloor = 1;
    this.status = ElevatorStatus.STOPPED;
    this.passengers = [];
  }
}
