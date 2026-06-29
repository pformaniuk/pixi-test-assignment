import { IFloorModel } from "./IFloorModel";
import { PersonStatus } from "./PersonStatus";
import { PersonModel } from "./PersonModel";

export class FloorModel implements IFloorModel {
  public people: PersonModel[] = [];
  constructor(public floorNumber: number) {}

  public getPassengers(): PersonModel[] {
    return this.people.filter(person => person.status === PersonStatus.WAITING);
  }

  public addPerson(person: PersonModel) {
    this.people.push(person);
  }

  public removePerson(person: PersonModel) {
    this.people = this.people.filter(p => p !== person);
  }
}
