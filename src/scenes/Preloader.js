import { Scene } from 'phaser';
import { WIDTH, HEIGHT } from '../const';
import assets from '../assets.js';
import { createPlayerAnimations } from '../animations.js';
import { Storage } from '../classes/Storage.js';

export class Preloader extends Scene {
    constructor() {
        super('Preloader');
    }

    init() {
        // --- Прогресс бар ---
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

        for (const key in assets.audio) {
            const item = assets.audio[key];
            for (const variation of item.files) {
                this.load.audio(variation, `${item.path}/${variation}.${item.format}`);
            }
        }

        this.load.on('complete', () => {
            createPlayerAnimations(this.anims);
        });

        this.registry.set(`currentLevel`, 1);
        
        const storage = new Storage(this.registry);
        storage.load();

        this.game.sound.volume = 0.3;
    }

    create() {
        this.scene.start('MainMenu');
    }
}