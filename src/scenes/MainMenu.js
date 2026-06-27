import { Scene } from 'phaser';
import { WIDTH, HEIGHT } from '../const';

export class MainMenu extends Scene {
    constructor() {
        super('MainMenu');
    }
    
    create() {
        this.add.image(WIDTH/2, HEIGHT/2, 'menubg');
        this.add.image(WIDTH/2, HEIGHT/2-200, 'logo');
        
        const textStyle = { fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff', stroke: '#000000', strokeThickness: 8 };
        this.add.text(WIDTH/2, HEIGHT/2, 'Добро пожаловать в игру', textStyle).setAlign('center').setOrigin(0.5);
        
        this.add.image(WIDTH/2, HEIGHT/2+200, 'button').setInteractive().once('pointerdown', () => {
            this.startGame();
        });
    }
    
    startGame() {
        this.scene.transition({
            target: 'FirstLevel',
            duration: 1000,
            moveBelow: true,
            onUpdate: (progress) => {
                this.cameras.main.setAlpha(1 - progress);
            }
        });
    }
}
