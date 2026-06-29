import { EventEmitter } from 'pixi.js';

export enum HouseEvents {
    ELEVATOR_ARRIVED = 'elevator:arrived',
}

export const eventBus = new EventEmitter();