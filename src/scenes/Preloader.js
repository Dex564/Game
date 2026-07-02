import { Scene } from 'phaser';
import { WIDTH, HEIGHT } from '../const';
import assets from '../assets.js';
import { createPlayerAnimations } from '../animations.js';

export class Preloader extends Scene {
    constructor() {
        super('Preloader');
    }

    init() {
        // --- Прогрес бар ---
        this.add.rectangle(WIDTH/2, HEIGHT/2, 468, 32).setStrokeStyle(1, 0xffffff);
        const bar = this.add.rectangle(WIDTH/2-230, HEIGHT/2, 4, 28, 0xffffff);
        this.load.on('progress', (progress) => {
            bar.width = 4 + (460 * progress);

        });
    }

    preload() {
        // --- изображения ---
        for (const key in assets.image) {
            const item = assets.image[key];
            this.load.image(item.key, item.args[0]);
        }

        // --- спрайт листы --- 
        for (const key in assets.spritesheet) {
            const item = assets.spritesheet[key];
            this.load.spritesheet(item.key, item.args[0], item.args[1]);
        }

        this.load.on('complete', () => {
            createPlayerAnimations(this.anims);
        });
    }

    create() {
        this.scene.start('MainMenu');
    }
}