import { Container, Graphics, Text } from 'pixi.js';
import { PersonModel } from '../model/PersonModel';


export class PersonView extends Container { 
    constructor(public person: PersonModel) {
        super();
        this.initBackground();
    }

    private initBackground() {
        const borderColor = this.person.souseceFloor > this.person.destinationFloor ? '53dda5' : '2b56cf';
        const background = new Graphics()
            .rect(0, 0, 30, 30)
            .stroke({ color: borderColor, width: 4 })
            .fill({ color: 0xFFFFFF });
        this.addChild(background);

        const text = new Text((this.person.destinationFloor + 1).toString(), {
            fontSize: 14,
            fill: 0x000000,
            fontFamily: 'Arial'
        });
        text.position.set(0, 0);
        this.addChild(text);
    }
}
