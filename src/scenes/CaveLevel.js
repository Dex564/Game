import { Scene } from 'phaser';
import { WIDTH, HEIGHT, chunks, paths } from '../const';
import { PlayerClass } from "./PlayerClass";
import { getRandomInt } from "../utils.js"

const TILE_SIZE_X = 128;
const TILE_SIZE_Y = 64;
const CHUNK_SIZE = 4;
const CHUNKS_X = 10;
const CHUNKS_Y = 5;

export class CaveLevel extends Scene {
    constructor() {
        super('CaveLevel');
    }
    
    create() {
        this.add.image(0, 0, 'bgcave').setOrigin(0);
        this.add.image(CHUNKS_X*TILE_SIZE_X*CHUNK_SIZE/2, 0, 'bgcave').setOrigin(0);
        
        this.playerHandler = new PlayerClass(this, CHUNKS_X*TILE_SIZE_X*CHUNK_SIZE, CHUNKS_Y*TILE_SIZE_Y*CHUNK_SIZE);
        this.player = this.playerHandler.createPlayer();
        this.physics.world.setBounds(0, 0, CHUNKS_X*TILE_SIZE_X*CHUNK_SIZE, CHUNKS_Y*TILE_SIZE_Y*CHUNK_SIZE);
        
        this.cameras.main.fadeIn(500, 0, 0, 0);

        this.entering = false;

        this.number = this.registry.get(`currentLevel`) ?? 0;

        const savedLevel = this.registry.get(`layout-${this.number}`);
        if (savedLevel) {
            this.entryY = savedLevel.entryY;
            this.leaveY = savedLevel.leaveY;
            this.layout = savedLevel.layout;
            const lastAction = this.registry.get(`lastAction`);
            if (lastAction == 'entry') {
                console.log('going back');
                this.playerHandler.setPlayerPosition(CHUNKS_X*TILE_SIZE_X*CHUNK_SIZE-(TILE_SIZE_X*CHUNK_SIZE/2), TILE_SIZE_Y*CHUNK_SIZE*this.leaveY+(TILE_SIZE_Y*CHUNK_SIZE/2));
            } else {
                console.log('going forward');
                this.playerHandler.setPlayerPosition(TILE_SIZE_X*CHUNK_SIZE/2, TILE_SIZE_Y*CHUNK_SIZE*this.entryY+(TILE_SIZE_Y*CHUNK_SIZE/2));
            }
        } else {
            this.entryY = this.registry.get(`layout-${this.number-1}`)?.entryY ?? 0;
            this.leaveY = getRandomInt(1, CHUNKS_Y-2);
            this.layout = this.generateLayout();

            this.registry.set(`layout-${this.number}`, { layout: this.layout, entryY: this.entryY, leaveY: this.leaveY });
            this.playerHandler.setPlayerPosition(TILE_SIZE_X*CHUNK_SIZE/2, TILE_SIZE_Y*CHUNK_SIZE*this.entryY+(TILE_SIZE_Y*CHUNK_SIZE/2));
        }
        console.log(`layout-${this.number}:`, this.registry.get(`layout-${this.number}`));
        this.drawRoom(this.layout);
        this.processCollision();
        this.createEntryHitbox();
        this.createLeaveHitbox();
    }
    
    update() {
        this.playerHandler.updatePlayer();
    }
    
    generateLayout() {
        console.log(this.entryY, this.leaveY);
        const layout = [];
        for (let y = 0; y < CHUNKS_Y; y++) {
            const layer = [];
            for (let x = 0; x < CHUNKS_X; x++) {

                if (this.entryY === y && x === 0) {
                    layer.push(5);
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
    
    processCollision() {
        this.map.setCollision([0]);
        this.physics.add.collider(this.player, this.layer);
    }

    createEntryHitbox() {
        this.entry = this.physics.add.staticGroup();
        this.entry.create(0, TILE_SIZE_Y*CHUNK_SIZE*this.entryY+TILE_SIZE_Y, 'entry_leave')
            .setVisible(true)
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
            .setVisible(true)
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
                if (this.number < 1) {
                    this.registry.set(`lastAction`, 'leave');
                    this.registry.set(`currentLevel`, 0);
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
                this.scene.restart();
            }
        });
    }
}