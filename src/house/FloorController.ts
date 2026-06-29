import { HouseView } from "./view/HouseView";
import { FloorView } from "./view/FloorView";
import config from '../config.json';
import { FloorModel } from "./model/FloorModel";
import { PersonModel } from "./model/PersonModel";
import { PersonView } from "./view/PersonView";
import * as TWEEN from "@tweenjs/tween.js";

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
    }

    private initFloors() {
        for (let i = 0; i < this.totalFloors; i++) {
            const floorNumber = i + 1;
    
            const floorView = new FloorView(floorNumber, this.buildingWidth, this.floorHeight);
            floorView.y = this.buildingHeight - (floorNumber * this.floorHeight);;
            this.house.addFloor(floorView);
            this.floorsViews.push(floorView);

            const floorModel = new FloorModel(floorNumber);
            this.floors.push(floorModel);
        }
    }

    private generatePerson() { 
        const interwal = Math.floor(Math.random() * (config.maxPersonGenerationInterval - config.minPersonGenerationInterval)) + config.minPersonGenerationInterval;
        const randomCurrentFloor = Math.floor(Math.random() * this.floors.length);
        const randomDestinationFloor = this.getRandomDestinationFloor(randomCurrentFloor, this.totalFloors);

        setTimeout(() => {
            const floor = this.floors[Math.floor(Math.random() * this.floors.length)];
            const personModel = new PersonModel(randomCurrentFloor, randomDestinationFloor);       
            const personView = this.addPersonToSpawnPoint(floor, personModel);
            this.movePersonToElevator(personView);
        }, interwal);
    }

    private getRandomDestinationFloor(currentFloor: number, totalFloors: number) {
        let destinationFloor = Math.floor(Math.random() * totalFloors) + 1;
        while (destinationFloor === currentFloor) {
            destinationFloor = Math.floor(Math.random() * totalFloors) + 1;
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

    private movePersonToElevator(personView: PersonView) {
        new TWEEN.Tween(personView.position, true).to({ x: 135 }, 10000)
        .onComplete(() => {
            this.generatePerson();
        })
        .start();
    }
}