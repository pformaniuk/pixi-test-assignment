import PIXI from 'pixi.js';

export enum PersonStatus {
  MOVING_TO_ELEVATOR = 'moving_to_elevator',
  WAITING = 'waiting',
  IN_ELEVATOR = 'in_elevator',
  MOVING_AWAY_FROM_ELEVATOR = 'moving_away_from_elevator',
}

export interface IPerson {
  souseceFloor: number;
  destinationFloor: number;
  status: PersonStatus;
}

export class Person implements IPerson {
  public status: PersonStatus;
  constructor(public souseceFloor: number, public destinationFloor: number) {
    this.status = PersonStatus.MOVING_TO_ELEVATOR;
  }
}

export class PersonView extends PIXI.Container {}