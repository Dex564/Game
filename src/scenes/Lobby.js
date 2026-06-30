import { PlayerClass } from "./PlayerClass";
import { WIDTH, HEIGHT } from '../const';

export class Lobby extends PlayerClass {
    constructor() {
        super('Lobby');
    }

    create() {
        this.add.image(0, 0, 'background').setOrigin(0);
        this.createPlayer(WIDTH/2, 300);
        this.platforms = this.physics.add.staticGroup();
        this.physics.add.collider(this.player, this.platforms);
        this.platforms.create(WIDTH, HEIGHT - 20, 'ground').setScale(15, 1).refreshBody();
    }

    update() {
        this.updatePlayer();
    }
}