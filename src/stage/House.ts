import { Elevator, ElevatorCageView, ElevatorStatus, ElevatorShaftView } from "./Elevator";
import { Floor, FloorView } from "./Floor";
import config from '../config.json';
import { Container, Graphics } from 'pixi.js';

export class House {
  public floors: Floor[];
  public elevator: Elevator;
  constructor() {
    this.floors = Array.from({ length: config.floors }, (_, index) => new Floor(index + 1));
    this.elevator = new Elevator(config.elevatorMaxCapacity, config.elevatorSpeed, config.elevatorDelayTime, 1, 1, ElevatorStatus.STOPPED, []);
  }
}

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