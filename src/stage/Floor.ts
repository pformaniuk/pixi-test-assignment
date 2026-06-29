import { IPerson, PersonStatus } from "./Person";
import PIXI from 'pixi.js';

interface IFloor {
  floorNumber: number;
  getPassengers(): IPerson[];
}
export class Floor implements IFloor {
  public people: IPerson[] = [];
  constructor(public floorNumber: number) {}

  public getPassengers(): IPerson[] {
    return this.people.filter(person => person.status === PersonStatus.WAITING);
  }
}

export class FloorView extends PIXI.Container {}