import { IPerson } from "./Person";
import PIXI from 'pixi.js';

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

export class ElevatorView extends PIXI.Container {}