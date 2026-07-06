import { Scene } from 'phaser';
import { WIDTH, HEIGHT, chunks, paths } from '../const';
import { PlayerClass } from "../classes/PlayerClass.js";
import { getRandomInt } from "../utils.js";
import { Storage } from '../classes/Storage.js';

const TILE_SIZE_X = 128;
const TILE_SIZE_Y = 64;
const CHUNK_SIZE = 4;
const CHUNKS_X = 10;
const CHUNKS_Y = 5;
const chestsAttempts = 5;

export class CaveLevel extends Scene {
    constructor() {
        super('CaveLevel');
    }
    
    create() {
        this.storage = new Storage(this.registry);
        this.scene.launch('HUD', 'CaveLevel');
        this.add.image(0, 0, 'bgcave').setOrigin(0);
        this.add.image(CHUNKS_X*TILE_SIZE_X*CHUNK_SIZE/2, 0, 'bgcave').setOrigin(0);
        
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
            const lastAction = this.registry.get(`lastAction`);
            if (lastAction == 'entry') {
                this.playerHandler.setPlayerPosition(CHUNKS_X*TILE_SIZE_X*CHUNK_SIZE-TILE_SIZE_X, TILE_SIZE_Y*CHUNK_SIZE*this.leaveY+(TILE_SIZE_Y*CHUNK_SIZE/2));
            } else {
                this.playerHandler.setPlayerPosition(TILE_SIZE_X, TILE_SIZE_Y*CHUNK_SIZE*this.entryY+(TILE_SIZE_Y*CHUNK_SIZE/2));
            }
            console.log(`Loaded room - layout-${this.number}:`, this.registry.get(`layout-${this.number}`));
        } else {
            this.entryY = this.registry.get(`layout-${this.number-1}`)?.leaveY ?? 0;
            this.leaveY = getRandomInt(1, CHUNKS_Y-2);
            this.layout = this.generateLayout();

            this.chests = [];
            let pushed = [];
            for (let i = 0; i < chestsAttempts; i++) {
                const x = getRandomInt(0, CHUNKS_X-1);
                const y = getRandomInt(0, CHUNKS_Y-1);
                if (!paths[3].has(this.layout[y][x]) && this.layout[y][x] != 11 && !pushed.includes(`${x}-${y}`)) {
                    this.chests.push({id: pushed.length, x, y, looted: false, hitbox: null, hint: null});
                    pushed.push(`${x}-${y}`);
                }
            }

            this.saveLevel();
            this.playerHandler.setPlayerPosition(TILE_SIZE_X, TILE_SIZE_Y*CHUNK_SIZE*this.entryY+(TILE_SIZE_Y*CHUNK_SIZE/2));
            console.log(`Generated room - layout-${this.number}:`, this.registry.get(`layout-${this.number}`));
        }
        this.drawRoom(this.layout);
        this.drawChests();
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
        this.registry.set(`layout-${this.number}`, { layout: this.layout, entryY: this.entryY, leaveY: this.leaveY, chests: this.chests });
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
    }
    
    generateLayout() {
        const layout = [];
        for (let y = 0; y < CHUNKS_Y; y++) {
            const layer = [];
            for (let x = 0; x < CHUNKS_X; x++) {

                if (this.entryY === y && x === 0) {
                    y === 0 ? layer.push(5) : layer.push(10);
                    continue;
                }
                else if (this.leaveY === y && x === CHUNKS_X-1) {
                    layer.push(10);
                    continue;
                }

                // left, right, up, down
                const can = [1, 1, 1, 1];
                
                if (layer[x-1] && !paths[1].has(layer[x-1])) {
                    can[0] = 0;
                }
                if (layout[y-1] && !paths[3].has(layout[y-1][x])) {
                    can[2] = 0;
                }
                
                if (x == 0) can[0] = 0;
                if (x == CHUNKS_X-1) can[1] = 0;
                if (y == 0) can[2] = 0;
                if (y == CHUNKS_Y-1) can[3] = 0;
                let possible = new Set();
                if (can[0] && can[2]) {
                    possible = paths[0].intersection(paths[2]);
                } else if (can[0] && !can[2]) {
                    possible = paths[0].difference(paths[2]);
                } else if (!can[0] && can[2]) {
                    possible = paths[2].difference(paths[0]);
                } else if (!can[0] && !can[2]) {
                    let leftup = paths[0].union(paths[2]);
                    let rightdown = paths[1].union(paths[3]);
                    possible = rightdown.difference(leftup);
                }
                if (!can[1]) {
                    possible = possible.difference(paths[1]);
                }
                if (!can[3]) {
                    possible = possible.difference(paths[3]);
                }
                possible = [...possible];
                if (possible.length) {
                    const randomIndex = Math.floor(Math.random() * possible.length);
                    const pick = possible[randomIndex];
                    if (pick != 0 && !pick) console.log(possible, can);
                    layer.push(pick);
                } else {
                    layer.push(11);
                }
            }
            layout.push(layer);
        }
        return layout;
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
                const chunkIndex = layout[chunkY][chunkX];
                const chunk = chunks[chunkIndex];
                // console.log(chunkX, chunkY, chunkIndex, chunk);
                // if (!chunk) continue;
                
                for (let y = 0; y < CHUNK_SIZE; y++) {
                    for (let x = 0; x < CHUNK_SIZE; x++) {
                        const tileX = chunkX * CHUNK_SIZE + x;
                        const tileY = chunkY * CHUNK_SIZE + y;
                        const value = chunk[y][x];
                        // console.log(tileX, tileY, value);
                        
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
        return this.add.text(x, y, text, {
            fontSize: '20px',
            fontFamily: 'Arial',
            color: '#ffffff',
            backgroundColor: '#000000',
            padding: { left: 8, right: 8, top: 4, bottom: 4 }
        }).setOrigin(0.5).setVisible(false).setAlpha(0.7);
    }
    
    processCollision() {
        this.map.setCollision([0]);
        this.physics.add.collider(this.player, this.layer);
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
                    this.scene.start('Lobby');
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