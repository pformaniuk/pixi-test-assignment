import { Elevator, ElevatorStatus } from "./Elevator";
import { Floor } from "./Floor";
import config from '../../public/assets/config.json';
import PIXI from 'pixi.js';

export class House {
  public floors: Floor[];
  public elevator: Elevator;
  constructor() {
    this.floors = Array.from({ length: config.floors }, (_, index) => new Floor(index + 1));
    this.elevator = new Elevator(config.elevatorMaxCapacity, config.elevatorSpeed, config.elevatorDelayTime, 1, 1, ElevatorStatus.STOPPED, []);
  }
}

export class HouseView extends PIXI.Container {}