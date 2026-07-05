import { Scene } from "phaser";
import { WIDTH, HEIGHT } from "../const";

export class Pause extends Scene {
    constructor() {
        super('Pause');
    }
    
    create() {
        const overlay = this.add.graphics();
        overlay.fillStyle(0x000000, 0.7);
        overlay.fillRect(0, 0, WIDTH, HEIGHT);
        this.add.text(WIDTH/2, HEIGHT/2 - 300, 'Пауза', { 
            fontFamily: 'Arial Black', 
            fontSize: 64, 
            color: '#ffffff', 
            stroke: '#000000', 
            strokeThickness: 8 
        }).setOrigin(0.5, 0);

        this.add.image(WIDTH/2, HEIGHT/2-150, 'continue_button').setInteractive({ useHandCursor: true }).once('pointerdown', () => {
            this.scene.resume('CaveLevel');
            this.scene.stop('Pause');
        }).setOrigin(0.5, 0);

        this.add.image(WIDTH/2, HEIGHT/2, 'lobby_button').setInteractive({ useHandCursor: true }).once('pointerdown', () => {
            this.registry.set(`lastAction`, 'leave');
            this.scene.stop('CaveLevel');
            this.scene.start('Lobby');
            this.scene.stop('Pause');
        }).setOrigin(0.5, 0);

        this.input.keyboard.on('keydown', (key) => {
            if (key.code == 'Escape') {
                this.scene.resume('CaveLevel');
                this.scene.stop('Pause');
            }
        });
    }
}