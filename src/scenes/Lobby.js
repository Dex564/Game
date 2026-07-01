import { PlayerClass } from "./PlayerClass";
import { WIDTH, HEIGHT } from '../const';
import { Scene } from "phaser";

export class Lobby extends Scene {
    constructor() {
        super('Lobby');
    }

    create() {
        this.add.image(0, 0, 'background').setOrigin(0);
        this.playerHandler = new PlayerClass(this);
        this.player = this.playerHandler.createPlayer();

        this.playerHandler.setPlayerPosition(WIDTH/2, HEIGHT/2 - 200);

        // Границы мира
        this.physics.world.setBounds(0, 0, WIDTH, HEIGHT - 24);

        this.platforms = this.physics.add.staticGroup();
        this.physics.add.collider(this.player, this.platforms);
        this.platforms.create(WIDTH/2, HEIGHT - 25, 'ground').setScale(2, 1).refreshBody();
        this.platforms.create(WIDTH/2 + 200, HEIGHT-400, 'platform_vertical').setScale(3, 10).refreshBody();

        this.spawnCaveEntry(WIDTH/2-500, HEIGHT-50);
    }

    update() {
        this.playerHandler.updatePlayer();
    }

    spawnCaveEntry(x, y) {
        this.cave = this.physics.add.staticGroup();
        this.cave.create(x, y, 'cave_entry').setOrigin(1).refreshBody();
        this.entering = false;
        this.physics.add.overlap(
            this.player,
            this.cave,
            () => {this.enterCave()}
        );
    }

    enterCave() {
        if (this.entering) return;
        this.entering = true;
        this.cameras.main.fadeOut(500, 0, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => {
            this.scene.stop('Lobby');
            this.scene.start('CaveLevel');
        });
    }
}