import { Container, Graphics, Text } from "pixi.js";
import { PersonModel } from "../model/PersonModel";

export class PersonView extends Container {
  static readonly SIZE = 30;

  constructor(public person: PersonModel) {
    super();
    this.initBackground();
  }

  private initBackground() {
    const borderColor =
      this.person.souseceFloor > this.person.destinationFloor
        ? "53dda5"
        : "2b56cf";
    const background = new Graphics()
      .rect(0, 0, PersonView.SIZE, PersonView.SIZE)
      .stroke({ color: borderColor, width: 4 })
      .fill({ color: 0xffffff });
    this.addChild(background);

    const text = new Text((this.person.destinationFloor + 1).toString(), {
      fontSize: 14,
      fill: 0x000000,
      fontFamily: "Arial",
    });
    text.position.set(0, 0);
    this.addChild(text);
  }
}
