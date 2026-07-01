import { IPersonModel } from "./IPersonModel";
import { ElevatorDirection } from "./ElevatorStatus";

export interface IFloorModel {
  floorNumber: number;
  people: IPersonModel[];
  getPassengers(): IPersonModel[];
  grabEligiblePassengers(
    direction: ElevatorDirection,
    capacity: number,
  ): IPersonModel[];
}
