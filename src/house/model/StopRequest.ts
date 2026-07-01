import { ElevatorDirection } from "./ElevatorStatus";
import { PersonModel } from "./PersonModel";

export class StopRequest {
  public floor: number;
  public direction: ElevatorDirection;
  public passengerId: string;
  constructor(personModel: PersonModel) {
    this.floor = personModel.souseceFloor;
    this.direction = personModel.direction;
    this.passengerId = personModel.id;
  }
}
