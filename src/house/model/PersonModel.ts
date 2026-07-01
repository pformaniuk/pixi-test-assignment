import { IPersonModel } from "./IPersonModel";
import { PersonStatus } from "./PersonStatus";
import generatePersonData from "../utils/getRandomFloor";
import config from "../../config.json";
import { ElevatorDirection } from "./ElevatorStatus";
import { StopRequest } from "./StopRequest";

export class PersonModel implements IPersonModel {
  public status: PersonStatus;
  public id: string;
  public souseceFloor: number;
  public destinationFloor: number;
  constructor() {
    this.id = Date.now().toString();
    const { currentFloor, destinationFloor } = generatePersonData(config.floors);
    this.status = PersonStatus.MOVING_TO_ELEVATOR;
    this.souseceFloor = currentFloor;
    this.destinationFloor = destinationFloor;
  }

  get direction(): ElevatorDirection {
    return this.destinationFloor > this.souseceFloor ? ElevatorDirection.UP : ElevatorDirection.DOWN;
  }

  public reachElevator(): StopRequest {
    this.status = PersonStatus.WAITING;
    return new StopRequest(this);
  }
}
