import { IPerson, PersonStatus } from "./Person";
import * as PIXI from 'pixi.js';

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

export class FloorView extends PIXI.Container {
  constructor(public floorNumber: number, public floorWidth: number, public floourHeight: number) {
    super();
    this.drawFloor();
  }

  private drawFloor() {
    const floor = new PIXI.Graphics()
      .rect(0, 0, this.floorWidth, this.floourHeight)
      .fill({ color: 0x004000 })
      .stroke({ color: 0x000000, width: 1 })
    this.addChild(floor);
  }
}