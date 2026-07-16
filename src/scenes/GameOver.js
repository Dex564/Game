import { Scene } from "phaser";
import { WIDTH, HEIGHT, titleStyle } from '../const';
import { Storage } from '../classes/Storage';

export class GameOver extends Scene {
    constructor() {
        super('GameOver');
        this.storage = new Storage(this.registry);
    }
    create() {
        const overlay = this.add.graphics();
        overlay.fillStyle(0x000000);
        overlay.fillRect(0, 0, WIDTH, HEIGHT);
        this.add.text(WIDTH/2, HEIGHT/2 - 300, 'Вы проиграли', titleStyle).setOrigin(0.5, 0);
        this.resetButton = this.add.image(WIDTH/2, HEIGHT/2, 'reset_button').setInteractive({ useHandCursor: true }).once('pointerdown', () => {
            this.storage.clear();
            location.reload();
        });
    }
}