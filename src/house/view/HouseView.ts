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
  }

  public attachElevator(
    elevatorShaft: ElevatorShaftView,
    elevatorCage: ElevatorCageView,
  ) {
    this.elevatorShaftLayer.addChild(elevatorShaft);
    this.elevatorCageLayer.addChild(elevatorCage);
  }

  public addFloor(floor: FloorView) {
    this.floorsLayer.addChild(floor);
  }

  private initBackground() {
    this.bkg = new Graphics()
      .rect(0, 0, this.buildingWidth, this.buildingHeight)
      .fill({ color: 0x000000 });
    this.addChild(this.bkg);
  }

  get floorHeightValue(): number {
    return this.floorHeight;
  }

  get buildingWidthValue(): number {
    return this.buildingWidth;
  }

  get buildingHeightValue(): number {
    return this.buildingHeight;
  }
}
