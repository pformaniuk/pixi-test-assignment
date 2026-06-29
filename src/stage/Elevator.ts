import { IPerson } from "./Person";
import * as PIXI from 'pixi.js';

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
  constructor(public maxCapacity: number, 
    public speed: number, 
    public dellayTime: number, 
    public currentFloor: number, 
    public destinationFloor: number, 
    public status: ElevatorStatus, 
    public passengers: IPerson[]) {
  }
}

export class ElevatorView extends PIXI.Container {
  constructor(public elevator: Elevator) {
    super();
    this.initBackground();
  }

 private initBackground () {
    const background = new PIXI.Graphics()
      .rect(0, 0, 100, 100)
      .fill({ color: 0xFF0000 });
    this.addChild(background);
  }
}