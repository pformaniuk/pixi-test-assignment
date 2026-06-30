import { EventEmitter } from "pixi.js";

export enum HouseEvents {
  PERSON_REACHED_ELEVATOR = "passenger:reached_destination",
  ELEVATOR_ARRIVED = "elevator:arrived",
  UNLOAD_PASSENGERS = "unload:passengers",
  PASSENGER_UNLOADED = "passenger:unloaded",
  LOAD_PASSENGERS = "load:passengers",
}

export const eventBus = new EventEmitter();
