import { Container, Graphics } from "pixi.js";
import { ElevatorModel } from "../model/ElevatorModel";


export class ElevatorCageView extends Container {
  constructor(public elevator: ElevatorModel, public elevatorCageWidth: number, public elevatorCageHeight: number) {
    super();
    this.initBackground();
  }

  private initBackground() {
    const background = new Graphics()
      .rect(0, 0, this.elevatorCageWidth, this.elevatorCageHeight)
      .fill({ color: 0xFFFFFF });
    this.addChild(background);
  }
}
