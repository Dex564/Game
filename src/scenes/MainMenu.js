import { Scene } from 'phaser';
import { WIDTH, HEIGHT } from '../const';
import { Storage } from '../classes/Storage';

export class MainMenu extends Scene {
    constructor() {
        super('MainMenu');
    }
    
    create() {
        this.storage = new Storage(this.registry);
        this.add.image(WIDTH/2, HEIGHT/2, 'menubg');
        this.add.image(WIDTH/2, HEIGHT/2-200, 'logo');
        
        const textStyle = { fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff', stroke: '#000000', strokeThickness: 8 };
        this.add.text(WIDTH/2, HEIGHT/2, 'Добро пожаловать в игру', textStyle).setAlign('center').setOrigin(0.5);
        if (this.storage.exists()) {
            this.add.image(WIDTH/2, HEIGHT/2+100, 'continue_button').setInteractive({ useHandCursor: true }).once('pointerdown', () => {
                this.startGame();
            });
            this.resetButton = this.add.image(WIDTH/2, HEIGHT/2+230, 'reset_button').setInteractive({ useHandCursor: true }).once('pointerdown', () => {
                this.confirm();
            });
        } else {
            this.add.image(WIDTH/2, HEIGHT/2+100, 'start_button').setInteractive({ useHandCursor: true }).once('pointerdown', () => {
                this.startGame();
            });
        }
    }

    confirm() {
        this.resetButton.destroy();
        this.add.image(WIDTH/2, HEIGHT/2+230, 'confirm_button').setInteractive({ useHandCursor: true }).once('pointerdown', () => {
            this.storage.clear();
            location.reload();
        });
    }
    
    startGame() {
        this.scene.transition({
            target: 'Lobby',
            duration: 1000,
            moveBelow: true,
            onUpdate: (progress) => {
                this.cameras.main.setAlpha(1 - progress);
            }
        });
    }
}