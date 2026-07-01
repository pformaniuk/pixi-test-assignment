import { Container, Graphics, Text } from "pixi.js";
import * as TWEEN from "@tweenjs/tween.js";
import { PersonView } from "./PersonView";

export class FloorView extends Container {
  static readonly ELEVATOR_X = 135;

  constructor(
    public floorNumber: number,
    public floorWidth: number,
    public floourHeight: number,
  ) {
    super();
    this.drawFloor();
  }

  private drawFloor() {
    const floor = new Graphics()
      .rect(0, 0, this.floorWidth, this.floourHeight)
      .fill({ color: 0xffffff })
      .stroke({ color: 0x000000, width: 1 });
    this.addChild(floor);

    const text = new Text(`Floor ${this.floorNumber + 1}`, {
      fontSize: 14,
      fill: 0x888888,
      fontFamily: "Arial",
    });
    text.position.set(this.floorWidth - 120, this.floourHeight - 25);
    this.addChild(text);
  }

  public addPassenger(passenger: Container) {
    this.addChild(passenger);
    passenger.position.set(FloorView.ELEVATOR_X, 0);
  }

  public movePassengerToElevator(
    passenger: PersonView,
    duration: number,
    onComplete?: () => void,
  ) {
    new TWEEN.Tween(passenger.position, true)
      .to({ x: FloorView.ELEVATOR_X }, duration)
      .onComplete(() => {
        this.regroupPassengers();
        onComplete?.();
      })
      .start();
  }

  public unloadPassenger(passenger: PersonView, duration: number) {
    this.addPassenger(passenger);

    new TWEEN.Tween(passenger.position, true)
      .to({ x: this.floorWidth - PersonView.SIZE }, duration)
      .onComplete(() => passenger.destroy())
      .start();
  }

  public regroupPassengers() {
    const passengers = this.children.filter((c) => c instanceof PersonView);
    const offset = PersonView.SIZE + 10;
    passengers.forEach((p, index) => {
      p.position.set(FloorView.ELEVATOR_X + offset * index, 0);
    });
  }
}
