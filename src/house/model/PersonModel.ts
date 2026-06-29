import { IPersonModel } from "./IPersonModel";
import { PersonStatus } from "./PersonStatus";

export class PersonModel implements IPersonModel {
  public status: PersonStatus;
  constructor(public souseceFloor: number, public destinationFloor: number) {
    this.status = PersonStatus.MOVING_TO_ELEVATOR;
  }
}
