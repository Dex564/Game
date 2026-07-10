import { PlayerClass } from "../classes/PlayerClass";
import { WIDTH, HEIGHT, hintStyle } from '../const';
import { Scene, Input, Geom } from "phaser";

export class Lobby extends Scene {
    constructor() {
        super('Lobby');
    }

    create() {
        const health = this.registry.get('health');
        if (health <= 0) {
            this.scene.stop('Lobby');
            this.scene.start('GameOver');
        }
        this.scene.launch('HUD', 'Lobby');
        this.add.image(0, 0, 'background').setOrigin(0);
        this.playerHandler = new PlayerClass(this);
        this.player = this.playerHandler.createPlayer();

        this.playerHandler.setPlayerPosition(WIDTH/2-300, HEIGHT - 100);

        // Границы мира
        this.physics.world.setBounds(0, 0, WIDTH, HEIGHT - 24);

        this.platforms = this.physics.add.staticGroup();
        this.physics.add.collider(this.player, this.platforms);
        this.platforms.create(WIDTH/2, HEIGHT - 25, 'ground').setScale(2, 1).refreshBody();

        this.spawnCaveEntry(WIDTH/2-500, HEIGHT-50);

        this.entering = false;

        this.input.keyboard.on('keydown', (key) => {
            if (key.code == 'Escape') {
                this.scene.launch('Pause', 'Lobby');
                this.scene.pause('Lobby');
            }
        });
    }

    update() {
        this.playerHandler.updatePlayer();

        const playerBounds = this.player.getBounds();
        const zoneBounds = this.doorZone.getBounds();
        const playerNearDoor = Phaser.Geom.Intersects.RectangleToRectangle(
            playerBounds, zoneBounds
        );

        this.doorHint.setVisible(playerNearDoor);
        if (playerNearDoor) {
            this.doorHint.setPosition(this.doorZone.x, this.doorZone.y - 79);
        }

        if (playerNearDoor && this.playerHandler.keys.e.isDown) {
            this.enterCave();
        }
    }

    spawnCaveEntry(x, y) {
        this.temple = this.add.image(x, y, 'mainTemple').setOrigin(1, 1);
        this.doorZone = this.add.zone(x-100, y-14, 36, 63).setOrigin(0.5, 0.5);
        this.doorHint = this.add.text(0, 0, '[E]', hintStyle).setOrigin(0.5).setVisible(false).setAlpha(0.7);
    }

    enterCave() {
        if (this.entering) return;
        this.entering = true;
        this.doorHint.setVisible(false);
        this.cameras.main.fadeOut(500, 0, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => {
            this.scene.stop('HUD');
            this.scene.stop('Lobby');
            this.scene.start('InsideTemple', 'fromLobby');
        });
    }
}