import { Enemy } from './Enemy.js';

export class Skeleton extends Enemy {
    constructor(scene, x, y) {
        super(scene, x, y, 'skeleton');
        this.hp = 30;
        // this.speed = 50;
        // this.play('skeletonIdle');
    }

    update() {
        // логика движения
    }
}