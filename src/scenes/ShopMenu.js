import { Scene } from "phaser";
import { WIDTH, HEIGHT } from "../const";

export class ShopMenu extends Scene {
    constructor() {
        super('ShopMenu');
    }
    create(parentLevel) {
        const overlay = this.add.graphics();
        overlay.fillStyle(0x000000, 0.7);
        overlay.fillRect(0, 0, WIDTH, HEIGHT);
        this.add.text(WIDTH/2, HEIGHT/2 - 300, 'Выберите действие', { 
            fontFamily: 'Arial Black', 
            fontSize: 64, 
            color: '#ffffff', 
            stroke: '#000000', 
            strokeThickness: 8 
        }).setOrigin(0.5, 0);
        this.input.keyboard.on('keydown', (key) => {
            if (key.code == 'Escape') {
                this.scene.resume(parentLevel);
                this.scene.stop('ShopMenu');
            }
        });
    }
}