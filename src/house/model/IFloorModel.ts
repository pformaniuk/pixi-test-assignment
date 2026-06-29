import { IPersonModel } from "./IPersonModel";

export interface IFloorModel {
  floorNumber: number;
  people: IPersonModel[];
  getPassengers(): IPersonModel[];
}
