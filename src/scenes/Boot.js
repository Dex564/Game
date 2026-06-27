import { Scene } from 'phaser';

export class Boot extends Scene {
    constructor() {
        super('Boot');
    }

    preload() {
        // nothing
    }

    create() {
        this.scene.start('Preloader');
    }
}
