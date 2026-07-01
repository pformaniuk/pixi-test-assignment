import { IFloorModel } from "./IFloorModel";
import { PersonStatus } from "./PersonStatus";
import { PersonModel } from "./PersonModel";
import { ElevatorDirection } from "./ElevatorStatus";
import config from "../../config.json";

export class FloorModel implements IFloorModel {
  public people: PersonModel[] = [];

  constructor(public floorNumber: number) {}

  public getPassengers(): PersonModel[] {
    return this.people.filter(
      (person) => person.status === PersonStatus.WAITING,
    );
  }

  public grabEligiblePassengers(
    direction: ElevatorDirection,
    capacity: number,
  ): PersonModel[] {
    const withRightDirection = this.getPassengers().filter((person) => {
      return (
        (direction === ElevatorDirection.UP &&
          person.destinationFloor > this.floorNumber) ||
        (direction === ElevatorDirection.DOWN &&
          person.destinationFloor < this.floorNumber) ||
        this.floorNumber === 0 ||
        this.floorNumber === config.floors - 1
      );
    });

    const withRightCapacity = withRightDirection.slice(0, capacity);

    withRightCapacity.forEach((person) => {
      person.status = PersonStatus.IN_ELEVATOR;
      this.removePerson(person);
    });

    return withRightCapacity;
  }

  public addPerson(person: PersonModel) {
    this.people.push(person);
  }

  public removePerson(person: PersonModel) {
    this.people = this.people.filter((p) => p !== person);
  }
}
