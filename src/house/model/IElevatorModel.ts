import { ElevatorDirection, ElevatorStatus } from "./ElevatorStatus";
import { IPersonModel } from "./IPersonModel";
import { StopRequest } from "./StopRequest";

export interface IElevatorModel {
  maxCapacity: number;
  speed: number;
  dellayTime: number;
  currentFloor: number;
  destinationFloor: number;
  status: ElevatorStatus;
  direction: ElevatorDirection;
  passengers: IPersonModel[];
  stopRequests: StopRequest[];
  unloadPassengers(passengers: IPersonModel[]): void;
  addStopRequest(request: StopRequest): void;
  fulfillStopRequestsForPassengers(passengers: IPersonModel[]): void;
  getNextFloor(): number;
  get shouldStopAtFloor(): boolean;
}
