import { IPersonModel } from "./IPersonModel";
import { PersonStatus } from "./PersonStatus";

export class PersonModel implements IPersonModel {
  public status: PersonStatus;
  public id: string;
  constructor(public souseceFloor: number, public destinationFloor: number) {
    this.id = Date.now().toString();
    this.status = PersonStatus.MOVING_TO_ELEVATOR;
  }
}
