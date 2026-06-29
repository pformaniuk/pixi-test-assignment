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
    }

    private onElevatorArrived(floor: number, direction: ElevatorDirection, passengers: PersonModel[], ) {
        // console.log('Elevator arrived at floor', floor);
        // console.log('Direction', direction);
        // console.log('Passengers', passengers);

        // 1. find all people on the floor
        // 2. move their models to the elevator
        // 3. remove them from the floor
        // 4. add them to the elevator view

        this.grabEligiblePassengers(floor, direction, config.elevatorMaxCapacity - passengers.length);
    }

    private initFloors() {
        for (let i = 1; i <= this.totalFloors; i++) {
            const floorNumber = i;
    
            const floorView = new FloorView(floorNumber, this.buildingWidth, this.floorHeight);
            floorView.y = this.buildingHeight - (floorNumber * this.floorHeight);;
            this.house.addFloor(floorView);
            this.floorsViews.push(floorView);


            // ODO Floor number is 1-indexed, but the model is 0-indexed
            const floorModel = new FloorModel(floorNumber - 1);
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
        let destinationFloor = Math.floor(Math.random() * totalFloors) + 1;
        while (destinationFloor === currentFloor) {
            destinationFloor = Math.floor(Math.random() * totalFloors) + 1;
        }

        console.log('Destination floor', destinationFloor);
        console.log('Current floor', currentFloor);
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

    private grabEligiblePassengers(floor: number, direction: ElevatorDirection, capacity: number) {
        const floorModel = this.floors.find(f => f.floorNumber === floor);
        const waitingPassengers = floorModel?.getPassengers();
        if (!waitingPassengers) return [];

        const withRighDirection = waitingPassengers.filter(person => {
            return (direction === ElevatorDirection.UP && person.destinationFloor > floor) ||
                   (direction === ElevatorDirection.DOWN && person.destinationFloor < floor) ||
                   floor === 1 ||
                   floor === this.totalFloors;
        });

        const withRightCapacity = withRighDirection.slice(0, capacity);

        withRightCapacity.forEach(person => {
            person.status = PersonStatus.IN_ELEVATOR;
            this.floors.find(f => f.floorNumber === person.destinationFloor)?.removePerson(person);
        });

        return withRightCapacity;
    }
}