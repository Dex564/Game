import { Scene } from 'phaser';
import { WIDTH, HEIGHT } from '../const';

export class Preloader extends Scene {
    constructor() {
        super('Preloader');
    }

    init() {

        this.add.rectangle(WIDTH/2, HEIGHT/2, 468, 32).setStrokeStyle(1, 0xffffff);
        const bar = this.add.rectangle(WIDTH/2-230, HEIGHT/2, 4, 28, 0xffffff);
        this.load.on('progress', (progress) => {
            bar.width = 4 + (460 * progress);

        });
    }

    preload() {
        this.load.setPath('assets');

        this.load.image('person', 'person.png');
        this.load.image('logo', 'logo.png');
        this.load.image('button', 'button.png');
        this.load.image('menubg', 'menu.png');
        this.load.image('bg', 'bg.png');
        this.load.image('ground', 'ground.png');
    }

    create() {
        this.scene.start('MainMenu');
    }
}
