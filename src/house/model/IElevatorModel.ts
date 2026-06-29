import { ElevatorStatus } from "./ElevatorStatus";
import { IPersonModel } from "./IPersonModel";

export interface IElevatorModel {
  maxCapacity: number;
  speed: number;
  dellayTime: number;
  currentFloor: number;
  destinationFloor: number;
  status: ElevatorStatus;
  passengers: IPersonModel[];
}
