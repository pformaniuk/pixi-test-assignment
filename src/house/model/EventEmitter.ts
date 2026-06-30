import { EventEmitter } from 'pixi.js';

export enum HouseEvents {
    ELEVATOR_ARRIVED = 'elevator:arrived',
    UNLOAD_PASSENGERS = 'unload:passengers',
    PASSENGER_UNLOADED = 'passenger:unloaded',
    LOAD_PASSENGERS = 'load:passengers',
}

export const eventBus = new EventEmitter();