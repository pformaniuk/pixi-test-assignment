import { ElevatorDirection, ElevatorStatus } from "./ElevatorStatus";
import { IElevatorModel } from "./IElevatorModel";
import { PersonModel } from "./PersonModel";
import { StopRequest } from "./StopRequest";

export class ElevatorModel implements IElevatorModel {
  public currentFloor: number;
  public destinationFloor: number;
  public status: ElevatorStatus;
  public direction: ElevatorDirection;
  public passengers: PersonModel[];
  public stopRequests: StopRequest[];

  constructor(
    public maxCapacity: number,
    public speed: number,
    public dellayTime: number,
    public totalFloors: number,
  ) {
    this.currentFloor = 1;
    this.destinationFloor = 1;
    this.status = ElevatorStatus.STOPPED;
    this.direction = ElevatorDirection.UP;
    this.passengers = [];
    this.stopRequests = [];
  }

  public unloadPassengers(passengers: PersonModel[]): void {
    const idsToRemove = new Set(passengers.map((p) => p.id));
    this.passengers = this.passengers.filter((p) => !idsToRemove.has(p.id));
  }

  public addStopRequest(request: StopRequest): void {
    this.stopRequests.push(request);
  }

  public fulfillStopRequestsForPassengers(passengers: PersonModel[]): void {
    const ids = new Set(passengers.map((p) => p.id));
    this.stopRequests = this.stopRequests.filter((r) => !ids.has(r.passengerId));
  }

  public getNextFloor(): number {
    if (this.currentFloor === this.totalFloors - 1) {
      this.direction = ElevatorDirection.DOWN;
    } else if (this.currentFloor === 0) {
      this.direction = ElevatorDirection.UP;
    }

    if (this.direction === ElevatorDirection.UP) {
      return this.currentFloor + 1;
    }

    return this.currentFloor - 1;
  }

  get shouldStopAtFloor(): boolean {
    return (
      this.stopRequests.some(
        (r) =>
          r.floor === this.currentFloor &&
          (r.direction === this.direction ||
            this.currentFloor === 0 ||
            this.currentFloor === this.totalFloors - 1),
      ) || this.passengers.some((p) => p.destinationFloor === this.currentFloor)
    );
  }
}
