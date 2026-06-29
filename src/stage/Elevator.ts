import { IPerson } from "./Person";
import { Container, Graphics } from "pixi.js";

export enum ElevatorStatus {
  MOVING = 'moving',
  STOPPED = 'stopped',
}

interface IElevator {
  maxCapacity: number;
  speed: number;
  dellayTime: number;
  currentFloor: number;
  destinationFloor: number;
  status: ElevatorStatus;
  passengers: IPerson[];
}

export class Elevator  implements IElevator{
  public currentFloor: number;
  public destinationFloor: number;
  public status: ElevatorStatus;
  public passengers: IPerson[];

  constructor(public maxCapacity: number, public speed: number, public dellayTime: number) {
    this.currentFloor = 1;
    this.destinationFloor = 1;
    this.status = ElevatorStatus.STOPPED;
    this.passengers = [];
  }
}

export class ElevatorShaftView extends Container {
  constructor(public shaftWidth: number, public shaftHeight: number) {
    super();
    this.initBackground();
  }

 private initBackground () {
    const background = new Graphics()
      .rect(0, 0, this.shaftWidth, this.shaftHeight)
      .fill({ color: 0x000000 });
    this.addChild(background);
  }
}

export class ElevatorCageView extends Container {
  constructor(public elevator: Elevator, public elevatorCageWidth: number, public elevatorCageHeight: number) {
    super();
    this.initBackground();
  }

 private initBackground () {
    const background = new Graphics()
      .rect(0, 0, this.elevatorCageWidth, this.elevatorCageHeight)
      .fill({ color: 0xFFFFFF });
    this.addChild(background);
  }
}