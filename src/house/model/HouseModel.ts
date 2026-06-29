import config from '../../config.json';
import { ElevatorModel } from "./ElevatorModel";
import { FloorModel } from "./FloorModel";
import { IHouseModel } from "./IHouseModel";

export class HouseModel implements IHouseModel {
  public floors: FloorModel[];
  public elevator: ElevatorModel;
  constructor() {
    this.floors = Array.from({ length: config.floors }, (_, index) => new FloorModel(index + 1));
    this.elevator = new ElevatorModel(config.elevatorMaxCapacity, config.elevatorSpeed, config.elevatorDelayTime);
  }
}
