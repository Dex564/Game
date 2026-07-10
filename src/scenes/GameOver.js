import { Scene } from "phaser";
import { WIDTH, HEIGHT } from '../const';

export class GameOver extends Scene {
    constructor() {
        super('GameOver');
    }
    create() {
        const overlay = this.add.graphics();
        overlay.fillStyle(0x000000);
        overlay.fillRect(0, 0, WIDTH, HEIGHT);
        this.add.text(WIDTH/2, HEIGHT/2 - 300, 'Вы проиграли', { 
            fontFamily: 'Arial Black', 
            fontSize: 64, 
            color: '#ffffff', 
            stroke: '#000000', 
            strokeThickness: 8 
        }).setOrigin(0.5, 0);
    }
}