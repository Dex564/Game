import { Scene } from "phaser";
import { WIDTH, HEIGHT, titleStyle } from "../const";

export class AltarMenu extends Scene {
    constructor() {
        super('AltarMenu');
    }
    create(parentLevel) {
        const overlay = this.add.graphics();
        overlay.fillStyle(0x000000, 0.7);
        overlay.fillRect(0, 0, WIDTH, HEIGHT);
        this.add.text(WIDTH/2, HEIGHT/2 - 300, 'Выберите карточку', titleStyle).setOrigin(0.5, 0);
        this.input.keyboard.on('keydown', (key) => {
            if (key.code == 'Escape') {
                this.scene.resume(parentLevel);
                this.scene.stop('AltarMenu');
            }
        });
    }
}