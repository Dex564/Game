import { Scene } from 'phaser';
import {
    WIDTH,
    HEIGHT,
    hintStyle,
    TILE_SIZE_X,
    TILE_SIZE_Y,
    CHUNK_SIZE,
    CHUNKS_X,
    CHUNKS_Y,
    chestsAttempts,
    enemiesAttempts
} from '../const.js';
import { PlayerClass } from "../classes/PlayerClass.js";
import { getRandomInt, generateChunk } from "../utils.js";
import { Storage } from '../classes/Storage.js';
import { MazeGenerator } from '../classes/MazeGenerator.js';
import { Skeleton } from '../classes/Enemies/Skeleton.js';
import { Bat } from '../classes/Enemies/Bat.js';

export class CaveLevel extends Scene {
    constructor() {
        super('CaveLevel');
    }
    
    create() {
        this.storage = new Storage(this.registry);
        this.scene.launch('HUD', 'CaveLevel');
        this.add.image(0, 0, 'bgcave').setOrigin(0);
        // this.add.image(CHUNKS_X*TILE_SIZE_X*CHUNK_SIZE/2, 0, 'bgcave').setOrigin(0);
        
        this.playerHandler = new PlayerClass(this, CHUNKS_X*TILE_SIZE_X*CHUNK_SIZE, CHUNKS_Y*TILE_SIZE_Y*CHUNK_SIZE);
        this.player = this.playerHandler.createPlayer();
        this.physics.world.setBounds(0, 0, CHUNKS_X*TILE_SIZE_X*CHUNK_SIZE, CHUNKS_Y*TILE_SIZE_Y*CHUNK_SIZE);
        
        this.cameras.main.fadeIn(500, 0, 0, 0);

        this.entering = false;

        this.number = this.registry.get(`currentLevel`) ?? 1;

        const savedLevel = this.registry.get(`layout-${this.number}`);
        if (savedLevel) {
            this.entryY = savedLevel.entryY;
            this.leaveY = savedLevel.leaveY;
            this.layout = savedLevel.layout;
            this.chests = savedLevel.chests;
            this.enemies = savedLevel.enemies;
            const lastAction = this.registry.get(`lastAction`);
            if (lastAction == 'entry') {
                this.playerHandler.setPlayerPosition(CHUNKS_X*TILE_SIZE_X*CHUNK_SIZE-TILE_SIZE_X, TILE_SIZE_Y*CHUNK_SIZE*this.leaveY+(TILE_SIZE_Y*CHUNK_SIZE/2));
            } else {
                this.playerHandler.setPlayerPosition(TILE_SIZE_X, TILE_SIZE_Y*CHUNK_SIZE*this.entryY+(TILE_SIZE_Y*CHUNK_SIZE/2));
            }
            console.log(`Loaded room - layout-${this.number}:`, this.registry.get(`layout-${this.number}`));
        } else {
            this.entryY = this.registry.get(`layout-${this.number-1}`)?.leaveY ?? 0;
            this.leaveY = getRandomInt(0, CHUNKS_Y-1);
            const generator = new MazeGenerator(CHUNKS_X, CHUNKS_Y);
            generator.setEntryExit(this.entryY, this.leaveY);
            this.layout = generator.getMaze();

            this.chests = [];
            this.enemies = [];

            this.generateObjects();

            this.saveLevel();
            this.playerHandler.setPlayerPosition(TILE_SIZE_X, TILE_SIZE_Y*CHUNK_SIZE*this.entryY+(TILE_SIZE_Y*CHUNK_SIZE/2));
            console.log(`Generated room - layout-${this.number}:`, this.registry.get(`layout-${this.number}`));
        }
        this.drawRoom(this.layout);
        this.drawChests();
        this.spawnEnemies();
        this.processCollision();
        this.createEntryHitbox();
        this.createLeaveHitbox();

        this.input.keyboard.on('keydown', (key) => {
            if (key.code == 'Escape') {
                this.scene.launch('Pause', 'CaveLevel');
                this.scene.pause('CaveLevel');
            }
        });
    }

    saveLevel() {
        this.registry.set(`layout-${this.number}`, { 
            layout: this.layout,
            entryY: this.entryY,
            leaveY: this.leaveY,
            chests: this.chests,
            enemies: this.enemies.map(e => ({
                id: e.id,
                x: e.x,
                y: e.y,
                type: e.type,
                health: e.health,
            }))
        });
        this.storage.save();
    }
    
    update() {
        this.playerHandler.updatePlayer();
        const playerBounds = this.player.getBounds();
        this.chests.forEach((chest, index) => {
            if (!chest.hitbox || !chest.hint) return;
            const chestBounds = chest.hitbox.getBounds();
            const playerNearChest = Phaser.Geom.Intersects.RectangleToRectangle(
                playerBounds, chestBounds
            );
            if (!chest.looted) chest.hint.setVisible(playerNearChest);
            else chest.hint.setVisible(false);
            if (!chest.looted && playerNearChest && this.playerHandler.keys.e.isDown) {
                this.openChest(chest, index);
            }
        });
        this.enemies.forEach(e => e.hitbox.update());
    }
    
    generateObjects() {
        let pushed = [];
        for (let i = 0; i < chestsAttempts; i++) {
            const x = getRandomInt(0, CHUNKS_X-1);
            const y = getRandomInt(0, CHUNKS_Y-1);
            if (!this.layout[y][x][1]) {
                this.chests.push({id: pushed.length, x, y, looted: false, hitbox: null, hint: null});
                pushed.push(`${x}-${y}`);
            }
        }
        
        pushed = [];
        for (let i = 0; i < enemiesAttempts; i++) {
            const x = getRandomInt(0, CHUNKS_X-1);
            const y = getRandomInt(0, CHUNKS_Y-1);
            if (!this.layout[y][x][1]) {
                let type = 'bat';
                const level = this.number;
                if (level > 3) {
                    type = 'skeleton';
                }
                this.enemies.push({
                    id: pushed.length,
                    x, y,
                    type: type, 
                    hitbox: null
                });
                pushed.push(`${x}-${y}`);
            }
        }
    }
    
    drawRoom(layout) {
        this.map = this.make.tilemap({
            tileWidth: TILE_SIZE_X,
            tileHeight: TILE_SIZE_Y,
            width: CHUNKS_X * CHUNK_SIZE,
            height: CHUNKS_Y * CHUNK_SIZE
        });
        
        const tileset = this.map.addTilesetImage('wall', 'tile');
        this.layer = this.map.createBlankLayer('level', tileset);
        
        for (let chunkY = 0; chunkY < CHUNKS_Y; chunkY++) {
            for (let chunkX = 0; chunkX < CHUNKS_X; chunkX++) {
                const chunkData = layout[chunkY][chunkX];
                const chunk = generateChunk(chunkData);
                
                for (let y = 0; y < CHUNK_SIZE; y++) {
                    for (let x = 0; x < CHUNK_SIZE; x++) {
                        const tileX = chunkX * CHUNK_SIZE + x;
                        const tileY = chunkY * CHUNK_SIZE + y;
                        const value = chunk[y][x];
                        
                        if (value != -1) {
                            this.map.putTileAt(0, tileX, tileY, 'level');
                        }
                    }
                }
            }
        }
    }

    drawChests() {
        this.chests.forEach((chest, index) => {
            const posX = chest.x*TILE_SIZE_X*CHUNK_SIZE+(TILE_SIZE_X*2);
            const posY = chest.y*TILE_SIZE_Y*CHUNK_SIZE+(TILE_SIZE_Y*(CHUNK_SIZE-1));
            const hitbox = this.physics.add.staticSprite(posX, posY, chest.looted ? 'chest_opened' : 'chest')
                .setOrigin(0.5, 1)
                .refreshBody();
            const hint = this.spawnHint(posX, posY-TILE_SIZE_Y, '[E]');
            this.chests[index].hitbox = hitbox;
            this.chests[index].hint = hint;
        });
    }

    spawnEnemies() {
        this.enemies.forEach((enemyData, index) => {
            const posX = enemyData.x * TILE_SIZE_X * CHUNK_SIZE + (TILE_SIZE_X * 2);
            const posY = enemyData.y * TILE_SIZE_Y * CHUNK_SIZE + (TILE_SIZE_Y * (CHUNK_SIZE - 1));
            
            let enemy;
            switch (enemyData.type) {
                case 'skeleton':
                    enemy = new Skeleton(this, posX, posY);
                    console.log('Enemy created:', enemy, enemy.x, enemy.y, enemy.visible, enemy.texture.key, enemy.width, enemy.height);
                    break;
                case 'bat':
                    enemy = new Bat(this, posX, posY);
                    console.log('Enemy created:', enemy, enemy.x, enemy.y, enemy.visible, enemy.texture.key, enemy.width, enemy.height);
                    break;
                default:
                    enemy = new Skeleton(this, posX, posY);
            }
            if (enemyData.health) {
                enemy.hp = enemyData.health;
            }
            this.enemies[index].hitbox = enemy;
        });
    }

    openChest(chest, index) {
        this.sound.play(`chest`);
        const coins = getRandomInt(10, 20+this.number);
        this.registry.inc('coins', coins);
        this.sound.play(`coins${getRandomInt(1, 6)}`);
        this.chests[index].looted = true;
        chest.hitbox.setTexture('chest_opened');
        this.saveLevel();
    }

    spawnHint(x, y, text) {
        return this.add.text(x, y, text, hintStyle).setOrigin(0.5).setVisible(false).setAlpha(0.7);
    }
    
    processCollision() {
        this.map.setCollision([0]);
        this.physics.add.collider(this.player, this.layer);
        this.enemies.forEach((enemy) => {
            this.physics.add.collider(enemy.hitbox, this.layer);
        });
    }

    createEntryHitbox() {
        this.entry = this.physics.add.staticGroup();
        this.entry.create(0, TILE_SIZE_Y*CHUNK_SIZE*this.entryY+TILE_SIZE_Y, 'entry_leave')
            .setOrigin(0)
            .refreshBody();
        this.physics.add.overlap(
            this.player,
            this.entry,
            () => {this.changeScene('entry')}
        );
    }

    createLeaveHitbox() {
        this.leave = this.physics.add.staticGroup();
        this.leave.create(TILE_SIZE_X*CHUNK_SIZE*CHUNKS_X-TILE_SIZE_Y, TILE_SIZE_Y*CHUNK_SIZE*this.leaveY+TILE_SIZE_Y, 'entry_leave')
            .setOrigin(0)
            .setFlipX(true)
            .refreshBody();
        this.physics.add.overlap(
            this.player,
            this.leave,
            () => {this.changeScene('leave')}
        );
    }

    changeScene(state) {
        if (this.entering) return;
        this.entering = true;
        this.cameras.main.fadeOut(500, 0, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => {
            if (state == 'entry') {
                if (this.number <= 1) {
                    this.registry.set(`lastAction`, 'leave');
                    this.registry.set(`currentLevel`, 1);
                    this.scene.stop('CaveLevel');
                    this.scene.start('InsideTemple', 'fromCave');
                } else {
                    this.registry.set(`lastAction`, 'entry');
                    this.registry.set(`currentLevel`, this.number-1);
                    this.scene.restart();
                }
            } else {
                this.registry.set(`lastAction`, 'leave');
                this.registry.set(`currentLevel`, this.number+1);
                this.registry.set(`maxLevel`, this.number+1);
                this.storage.save();
                this.scene.restart();
            }
        });
    }
}