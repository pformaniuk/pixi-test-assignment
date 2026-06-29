import { Container, Graphics } from "pixi.js";


export class ElevatorShaftView extends Container {
  constructor(public shaftWidth: number, public shaftHeight: number) {
    super();
    this.initBackground();
  }

  private initBackground() {
    const background = new Graphics()
      .rect(0, 0, this.shaftWidth, this.shaftHeight)
      .fill({ color: 0x000000 });
    this.addChild(background);
  }
}
