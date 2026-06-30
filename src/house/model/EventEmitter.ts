import { EventEmitter } from 'pixi.js';

export enum HouseEvents {
    ELEVATOR_ARRIVED = 'elevator:arrived',
    LOAD_PASSENGERS = 'load:passengers',
}

export const eventBus = new EventEmitter();