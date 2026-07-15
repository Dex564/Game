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
        this.add.image(WIDTH/2, HEIGHT/2-300, 'logo');
        
        const textStyle = { fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff', stroke: '#000000', strokeThickness: 8 };
        let height = 0;
        this.add.text(WIDTH/2, HEIGHT/2-100, 'Добро пожаловать в игру', textStyle).setAlign('center').setOrigin(0.5);
        if (this.storage.exists()) {
            this.add.image(WIDTH/2, HEIGHT/2+height, 'continue_button').setInteractive({ useHandCursor: true }).once('pointerdown', () => {
                this.startGame();
            });
        } else {
            this.registry.set('firstGame', true);
            this.add.image(WIDTH/2, HEIGHT/2+height, 'start_button').setInteractive({ useHandCursor: true }).once('pointerdown', () => {
                this.startGame();
            });
        }
        height+=130;
        this.add.image(WIDTH/2, HEIGHT/2+height, 'info_button').setInteractive({ useHandCursor: true }).on('pointerdown', () => {
            this.scene.launch('Guide', 'MainMenu');
            this.scene.pause('MainMenu');
        });
        height+=130;

        if (this.storage.exists()) {
            let resetHeight = height;
            this.resetButton = this.add.image(WIDTH/2, HEIGHT/2+resetHeight, 'reset_button').setInteractive({ useHandCursor: true }).once('pointerdown', () => {
                this.confirm(resetHeight);
            });
            height+=130;
        }

        this.add.image(WIDTH/2, HEIGHT/2+height, 'leave_button').setInteractive({ useHandCursor: true }).once('pointerdown', () => {
            let win = window.open(location.href, '_self');
            win.close();
        });
    }

    confirm(height) {
        this.resetButton.destroy();
        this.add.image(WIDTH/2, HEIGHT/2+height, 'confirm_button').setInteractive({ useHandCursor: true }).once('pointerdown', () => {
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