import { HouseView } from "./view/HouseView";
import { FloorView } from "./view/FloorView";
import config from '../config.json';
import { FloorModel } from "./model/FloorModel";
import { PersonModel } from "./model/PersonModel";
import { PersonView } from "./view/PersonView";
import * as TWEEN from "@tweenjs/tween.js";
import { eventBus, HouseEvents } from "./model/EventEmitter";
import { PersonStatus } from "./model/PersonStatus";
import { ElevatorDirection } from "./model/ElevatorStatus";

export class FloorController {
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
        eventBus.on(HouseEvents.ELEVATOR_ARRIVED, this.onElevatorArrived.bind(this));
        eventBus.on(HouseEvents.PASSENGER_UNLOADED, this.onPassengerUnloaded.bind(this));
    }

    private onElevatorArrived(floor: number, direction: ElevatorDirection, passengersOfeElevator: PersonModel[]) {
        console.log(passengersOfeElevator.map(p => p.destinationFloor + 1));
        const unloadedPassengers = this.unloadPassengers(floor, passengersOfeElevator);
        eventBus.emit(HouseEvents.UNLOAD_PASSENGERS, unloadedPassengers, floor, direction);
    }

    private onPassengerUnloaded(floor: number, direction: ElevatorDirection, passengers: PersonModel[]) {
        const eligiblePassengers = this.grabEligiblePassengers(
            floor,
            direction,
            config.elevatorMaxCapacity - passengers.length
        );
        eventBus.emit(HouseEvents.LOAD_PASSENGERS, eligiblePassengers);
    }

    private initFloors() {
        for (let i = 0; i < this.totalFloors; i++) {
            const floorView = new FloorView(i, this.buildingWidth, this.floorHeight);
            floorView.y = this.buildingHeight - ((i + 1) * this.floorHeight);;
            this.house.addFloor(floorView);
            this.floorsViews.push(floorView);
            
            const floorModel = new FloorModel(i);
            this.floors.push(floorModel);
        }
    }

    private generatePerson() { 
        const randomCurrentFloor = Math.floor(Math.random() * this.floors.length);
        const randomDestinationFloor = this.getRandomDestinationFloor(randomCurrentFloor, this.totalFloors);
        const floor = this.floors[randomCurrentFloor];
        const personModel = new PersonModel(randomCurrentFloor, randomDestinationFloor);   
        const personView = this.addPersonToSpawnPoint(floor, personModel);
        this.movePersonToElevator(personView, personModel);
        setTimeout(() => {
            this.generatePerson();
        }, Math.floor(Math.random() * (config.maxPersonGenerationInterval - config.minPersonGenerationInterval)) + config.minPersonGenerationInterval);
    }

    private getRandomDestinationFloor(currentFloor: number, totalFloors: number) {
        let destinationFloor = Math.floor(Math.random() * totalFloors);
        while (destinationFloor === currentFloor) {
            destinationFloor = Math.floor(Math.random() * totalFloors);
        }

        return destinationFloor;
    }
    
    private addPersonToSpawnPoint(floor: FloorModel, person: PersonModel) {
        floor.addPerson(person);
        const floorView = this.floorsViews.find(f => f.floorNumber === floor.floorNumber);
        const personView = new PersonView(person);
        personView.x = floorView?.width ?? 0;
        floorView?.addChild(personView);

        return personView;
    }

    private movePersonToElevator(personView: PersonView, personModel: PersonModel) {
        new TWEEN.Tween(personView.position, true).to({ x: 135 }, 10000)
        .onComplete(() => {
            personModel.status = PersonStatus.WAITING;
        })
        .start();
    }

    private unloadPassengers(floor: number, passengers: PersonModel[]): PersonModel[] {
        const toUnload = passengers.filter(person => person.destinationFloor === floor);
        const floorModel = this.floors.find(f => f.floorNumber === floor);

        toUnload.forEach(person => {
            person.status = PersonStatus.MOVING_AWAY_FROM_ELEVATOR;;
            floorModel?.addPerson(person);
        });

        return toUnload;
    }

    private grabEligiblePassengers(floor: number, direction: ElevatorDirection, capacity: number) {
        const floorModel = this.floors.find(f => f.floorNumber === floor);
        const waitingPassengers = floorModel?.getPassengers();
        if (!waitingPassengers) return [];

        const withRighDirection = waitingPassengers.filter(person => {
            return (direction === ElevatorDirection.UP && person.destinationFloor > floor) ||
                   (direction === ElevatorDirection.DOWN && person.destinationFloor < floor) ||
                   floor === 0 ||
                   floor === this.totalFloors - 1;
        });

        const withRightCapacity = withRighDirection.slice(0, capacity);

        withRightCapacity.forEach(person => {
            person.status = PersonStatus.IN_ELEVATOR;
            floorModel?.removePerson(person);
        });

        this.removePassengersFromFloorView(floor, withRightCapacity);

        return withRightCapacity;
    }

    removePassengersFromFloorView(floor: number, passengers: PersonModel[]) { 
        const floorView = this.floorsViews.find(f => f.floorNumber === floor);
        passengers.forEach(person => {
            const personView = floorView?.children.find(p => p instanceof PersonView && p.person.id === person.id);
            console.log(personView);
            if (personView) {
                floorView?.removeChild(personView);
            }
        });
    }
}