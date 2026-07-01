import { HouseView } from "./view/HouseView";
import { FloorView } from "./view/FloorView";
import config from "../config.json";
import { FloorModel } from "./model/FloorModel";
import { PersonModel } from "./model/PersonModel";
import { PersonView } from "./view/PersonView";
import { eventBus, HouseEvents } from "./model/EventEmitter";
import { PersonStatus } from "./model/PersonStatus";
import { ElevatorDirection } from "./model/ElevatorStatus";
import { StopRequest } from "./model/StopRequest";
import getRandomSpawnTime from "./utils/getRandomSpawnTime";

export class FloorController {
  PERSON_SPED: number = 10000;

  totalFloors: number;
  floorHeight: number;
  buildingWidth: number;
  buildingHeight: number;
  floors: FloorModel[] = [];
  floorsViews: FloorView[] = [];

  constructor(private house: HouseView) {
    this.totalFloors = config.floors;
    this.floorHeight = this.house.floorHeightValue;
    this.buildingWidth = this.house.buildingWidthValue;
    this.buildingHeight = this.house.buildingHeightValue;

    this.initFloors();
    this.generatePerson();
    eventBus.on(
      HouseEvents.ELEVATOR_ARRIVED,
      this.onElevatorArrived.bind(this),
    );
    eventBus.on(
      HouseEvents.PASSENGER_UNLOADED,
      this.onPassengerUnloaded.bind(this),
    );
  }

  private onElevatorArrived(
    floor: number,
    direction: ElevatorDirection,
    passengersOfeElevator: PersonModel[],
  ) {
    const unloadedPassengers = this.unloadPassengers(
      floor,
      passengersOfeElevator,
    );
    this.addPassengersToDestinationFloorView(floor, unloadedPassengers);
    eventBus.emit(
      HouseEvents.UNLOAD_PASSENGERS,
      unloadedPassengers,
      floor,
      direction,
    );
  }

  private onPassengerUnloaded(
    floor: number,
    direction: ElevatorDirection,
    passengers: PersonModel[],
  ) {
    const eligiblePassengers = this.grabEligiblePassengers(
      floor,
      direction,
      passengers
    );

    this.removePassengersFromFloorView(floor, eligiblePassengers);

    eventBus.emit(HouseEvents.LOAD_PASSENGERS, eligiblePassengers);
  }

  private initFloors() {
    for (let i = 0; i < this.totalFloors; i++) {
      const floorView = new FloorView(i, this.buildingWidth, this.floorHeight);
      
      floorView.y = this.buildingHeight - (i + 1) * this.floorHeight;
      this.house.addFloor(floorView);
      this.floorsViews.push(floorView);

      const floorModel = new FloorModel(i, this.totalFloors);
      this.floors.push(floorModel);
    }
  }

  private generatePerson() {
    const personModel = new PersonModel();
    const floor = this.floors[personModel.souseceFloor];
    const personView = this.addPersonToSpawnPoint(floor, personModel);
    this.floorsViews
      .find((f) => f.floorNumber === floor.floorNumber)
      ?.movePassengerToElevator(personView, () => {
        personModel.status = PersonStatus.WAITING;
        eventBus.emit(
          HouseEvents.PERSON_REACHED_ELEVATOR,
          new StopRequest(personModel),
        );
      });

    const spawnTime = getRandomSpawnTime(config.minPersonGenerationInterval, config.maxPersonGenerationInterval);
    setTimeout(() => this.generatePerson(), spawnTime);
  }

  private addPersonToSpawnPoint(floor: FloorModel, person: PersonModel) {
    floor.addPerson(person);
    const floorView = this.floorsViews.find((f) => f.floorNumber === floor.floorNumber);
    const personView = new PersonView(person);

    personView.x = floorView?.width ?? 0;
    floorView?.addChild(personView);

    return personView;
  }

  private unloadPassengers(
    floor: number,
    passengers: PersonModel[],
  ): PersonModel[] {
    const toUnload = passengers.filter(
      (person) => person.destinationFloor === floor,
    );
    const floorModel = this.floors.find((f) => f.floorNumber === floor);

    toUnload.forEach((person) => {
      person.status = PersonStatus.MOVING_AWAY_FROM_ELEVATOR;
      floorModel?.addPerson(person);
    });

    return toUnload;
  }

  private grabEligiblePassengers( floor: number, direction: ElevatorDirection, passengers: PersonModel[] ): PersonModel[] {
    const capacity = config.elevatorMaxCapacity - passengers.length;
    const floorModel = this.floors.find((f) => f.floorNumber === floor);
    const eligiblePassengers = floorModel?.grabEligiblePassengers(direction, capacity) ?? [];

    return eligiblePassengers;
  }

  private removePassengersFromFloorView(floor: number, passengers: PersonModel[]) {
    const floorView = this.floorsViews.find((f) => f.floorNumber === floor);
    passengers.forEach((person) => {
      const personView = floorView?.children.find(
        (p) => p instanceof PersonView && p.person.id === person.id,
      );
      if (personView) {
        floorView?.removeChild(personView);
      }
    });
  }

  private addPassengersToDestinationFloorView(
    floor: number,
    passengers: PersonModel[],
  ) {
    const floorView = this.floorsViews.find((f) => f.floorNumber === floor);
    passengers.forEach((person) => {
      floorView?.unloadPassenger(new PersonView(person));
    });
  }
}
