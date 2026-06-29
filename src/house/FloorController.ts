import { HouseView } from "./view/HouseView";
import { FloorView } from "./view/FloorView";
import config from '../config.json';
import { FloorModel } from "./model/FloorModel";

export class FloorController {
    totalFloors: number;
    floorHeight: number;
    buildingWidth: number;
    buildingHeight: number;
    floors: FloorModel[] = [];

    constructor(private house: HouseView) {
        this.totalFloors = config.floors;
        this.floorHeight = this.house.floorHeightValue;
        this.buildingWidth = this.house.buildingWidthValue;
        this.buildingHeight = this.house.buildingHeightValue;
        
        this.initFloors();
    }

    private initFloors() {
        for (let i = 0; i < this.totalFloors; i++) {
            const floorNumber = i + 1;
    
            const floorView = new FloorView(floorNumber, this.buildingWidth, this.floorHeight);
            floorView.y = this.buildingHeight - (floorNumber * this.floorHeight);;
            this.house.addFloor(floorView);

            const floorModel = new FloorModel(i);
            this.floors.push(floorModel);
        }
    }
}