import { IElevatorModel } from "./IElevatorModel";
import { IFloorModel } from "./IFloorModel";

export interface IHouseModel {
  floors: IFloorModel[];
  elevator: IElevatorModel;
}
