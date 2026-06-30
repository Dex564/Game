import { Scene } from 'phaser';
import { WIDTH, HEIGHT } from '../const';
import { PlayerClass } from "./PlayerClass";


export class CaveLevel extends Scene {
    constructor() {
        super('CaveLevel');
    }

    create() {
        this.add.image(0, 0, 'background').setOrigin(0);

        this.playerHandler = new PlayerClass(this);
        this.player = this.playerHandler.createPlayer();
        this.playerHandler.setPlayerPosition(WIDTH/2, HEIGHT/2 - 200);

        this.cameras.main.fadeIn(500, 0, 0, 0);
    }

    update() {
        this.playerHandler.updatePlayer();
    }
}