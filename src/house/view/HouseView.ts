import { Container, Graphics } from "pixi.js";
import { ElevatorShaftView } from "./ElevatorShaftView";
import { ElevatorCageView } from "./ElevatorCageView";
import { FloorView } from "./FloorView";


export class HouseView extends Container {
    private bkg: Graphics | undefined;
    private floorsLayer: Container;
    private elevatorShaftLayer: Container;
    private elevatorCageLayer: Container;

    private totalFloors: number;
    private floorHeight: number;
    private buildingWidth: number;
    private buildingHeight: number;

    constructor(floorsCount: number, width: number = 800, height: number = 600) {
        super();

        this.totalFloors = floorsCount;
        this.buildingWidth = width;
        this.buildingHeight = height;

        this.floorHeight = height / floorsCount;
        this.floorsLayer = new Container();
        this.elevatorShaftLayer = new Container();
        this.elevatorCageLayer = new Container();

        this.initBackground();
        this.addChild(this.floorsLayer);
        this.addChild(this.elevatorShaftLayer);
        this.addChild(this.elevatorCageLayer);

        this.initFloors();
    }

    public attachElevator(elevatorShaft: ElevatorShaftView, elevatorCage: ElevatorCageView) {
        this.elevatorShaftLayer.addChild(elevatorShaft);
        this.elevatorCageLayer.addChild(elevatorCage);
    }

    private initBackground() {
        this.bkg = new Graphics()
            .rect(0, 0, this.buildingWidth, this.buildingHeight)
            .fill({ color: 0x000000 });
        this.addChild(this.bkg);
    }

    private initFloors() {
        for (let i = 0; i < this.totalFloors; i++) {
            const floorNumber = i + 1;

            const yPosition = this.buildingHeight - (floorNumber * this.floorHeight);

            const floorView = new FloorView(floorNumber, this.buildingWidth, this.floorHeight);
            floorView.y = yPosition;

            this.floorsLayer.addChild(floorView);
        }
    }

    get floorHeightValue(): number {
        return this.floorHeight;
    }
}
