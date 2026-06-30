import { Container, Graphics } from "pixi.js";
import { ElevatorModel } from "../model/ElevatorModel";
import { PersonView } from "./PersonView";

export class ElevatorCageView extends Container {
  constructor(
    public elevator: ElevatorModel,
    public elevatorCageWidth: number,
    public elevatorCageHeight: number,
  ) {
    super();
    this.initBackground();
  }

  private initBackground() {
    const background = new Graphics()
      .rect(0, 0, this.elevatorCageWidth, this.elevatorCageHeight)
      .fill({ color: 0xffffff });
    this.addChild(background);
  }

  public addPassenger(...passengers: PersonView[]) {
    this.addChild(...passengers);
    this.layoutPassengers();
  }

  public removePassenger(passenger: PersonView) {
    this.removeChild(passenger);
    this.layoutPassengers();
  }

  layoutPassengers() {
    const passengerViews = this.children.filter(
      (child): child is PersonView => child instanceof PersonView,
    );
    const count = passengerViews.length;
    if (count === 0) return;

    const padding = 4;
    const personSize = PersonView.SIZE;
    const availableWidth = this.elevatorCageWidth - padding * 2;
    const scale = Math.min(1, availableWidth / (count * personSize));
    const scaledSize = personSize * scale;
    const gap =
      count > 1
        ? Math.max(2, (availableWidth - count * scaledSize) / (count - 1))
        : 0;
    const totalWidth = count * scaledSize + (count - 1) * gap;

    let x = (this.elevatorCageWidth - totalWidth) / 2;
    const y = (this.elevatorCageHeight - scaledSize) / 2;

    passengerViews.forEach((view) => {
      view.scale.set(scale);
      view.position.set(x, y);
      x += scaledSize + gap;
    });
  }
}
