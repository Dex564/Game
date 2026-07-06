import { Scene } from "phaser";
import { PlayerClass } from "../classes/PlayerClass.js";
import { WIDTH, HEIGHT, hintStyle } from "../const.js";
import { Storage } from '../classes/Storage.js';

export class InsideTemple extends Scene {
    constructor() {
        super('InsideTemple');
        this.worldX = WIDTH/2;
        this.worldY = HEIGHT/2;
    }
    
    create() {
        this.storage = new Storage(this.registry);
        this.scene.launch('HUD', 'InsideTemple');
        this.add.image(0, 0, 'bg_inside').setOrigin(0);
        this.playerHandler = new PlayerClass(this, this.worldX, this.worldY);
        this.player = this.playerHandler.createPlayer();
        this.physics.world.setBounds(0, 0, this.worldX, this.worldY);

        this.playerHandler.setPlayerPosition(this.worldX - 100, this.worldY - 65);

        this.drawGround();

        this.spawnNewLevel();
        if (this.registry.has('layout-1')) this.spawnLastLevel();
        this.spawnToLobby();

        this.cameras.main.fadeIn(500, 0, 0, 0);

        this.entering = false;

        this.input.keyboard.on('keydown', (key) => {
            if (key.code == 'Escape') {
                this.scene.launch('Pause', 'InsideTemple');
                this.scene.pause('InsideTemple');
            }
        });
    }

    update() {
        this.playerHandler.updatePlayer();

        const playerBounds = this.player.getBounds();
        const newLevelBounds = this.newLevel.getBounds();

        const nearNewLevel = Phaser.Geom.Intersects.RectangleToRectangle(
            playerBounds, newLevelBounds
        );

        this.newLevelHint.setVisible(nearNewLevel);
        
        if (nearNewLevel && this.playerHandler.keys.e.isDown) {
            this.enterNew();
        }

        if (this.registry.has('layout-1')) {
            const lastLevelBounds = this.lastLevel.getBounds();

            const nearlastLevel = Phaser.Geom.Intersects.RectangleToRectangle(
                playerBounds, lastLevelBounds
            );

            this.lastLevelHint1.setVisible(nearlastLevel);
            this.lastLevelHint2.setVisible(nearlastLevel);

            if (nearlastLevel && this.playerHandler.keys.e.isDown) {
                this.enterLast();
            }
        }
    }

    drawGround() {
        this.map = this.make.tilemap({
            tileWidth: 64,
            tileHeight: 64,
            width: this.worldX/64,
            height: Math.ceil(this.worldY/64)
        });

        const tileset = this.map.addTilesetImage('ground', 'stone_ground');
        this.layer = this.map.createBlankLayer('level', tileset);
        for (let i = 0; i < this.worldX/64; i++) {
            for (let j = 0; j < Math.ceil(this.worldY/64); j++) {
                if (i === 0 || j === 0 || i === this.worldX/64-1 || j === Math.ceil(this.worldY/64)-1) {
                    this.map.putTileAt(0, i, j, 'level');
                }
                if (i === this.worldX/64-1 && j == Math.ceil(this.worldY/64)-2 || i === this.worldX/64-1 && j == Math.ceil(this.worldY/64)-3) {
                    this.map.removeTileAt(i, j, 'level');
                }
            }
        }

        this.map.setCollision([0]);
        this.physics.add.collider(this.player, this.layer);
    }

    spawnNewLevel() {
        this.newLevel = this.add.image(192, this.worldY-32, 'entry_cave').setOrigin(0, 1);
        this.newLevelHint = this.add.text(192+64, this.worldY-150, 'Начать сначала', hintStyle).setOrigin(0.5).setVisible(false).setAlpha(0.7);
    }

    spawnLastLevel() {
        this.lastLevel = this.add.image(512, this.worldY-32, 'entry_cave').setOrigin(0, 1);
        this.lastLevelHint1 = this.add.text(512+64, this.worldY-150, 'Продолжить', hintStyle).setOrigin(0.5).setVisible(false).setAlpha(0.7);
        this.lastLevelHint2 = this.add.text(512+64, this.worldY-125, '(50 монет)', hintStyle).setOrigin(0.5).setVisible(false).setAlpha(0.7);
    }

    spawnToLobby() {
        this.toLobby = this.physics.add.staticGroup();
        this.toLobby.create(this.worldX, this.worldY-32, 'entry_leave')
            .setOrigin(1, 1)
            .setFlipX(true)
            .refreshBody();
        this.physics.add.overlap(
            this.player,
            this.toLobby,
            () => {
                if (this.entering) return;
                this.entering = true;
                this.changeScene('Lobby')
            }
        );
    }

    changeScene(scene) {
        this.cameras.main.fadeOut(500, 0, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => {
            this.scene.stop('InsideTemple');
            this.scene.start(scene);
        });
    }

    enterNew() {
        if (this.entering) return;
        this.entering = true;

        const maxLevel = this.registry.get('maxLevel');
        for (let i = 1; i <= maxLevel; i++) {
            this.registry.remove(`layout-${i}`);
        }
        this.registry.set('maxLevel', 1);
        this.registry.set('currentLevel', 1);
        this.storage.save();
        this.changeScene('CaveLevel');
    }

    enterLast() {
        if (this.entering) return;
        this.entering = true;

        const coins = this.registry.get('coins');
        if (coins < 50) {
            this.entering = false;
            return;
        }
        this.registry.inc('coins', -50);
        const maxLevel = this.registry.get('maxLevel');
        this.registry.set('currentLevel', maxLevel);
        this.storage.save();
        this.changeScene('CaveLevel');
    }
}