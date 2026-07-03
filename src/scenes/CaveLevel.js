import { Scene } from 'phaser';
import { WIDTH, HEIGHT, chunks, paths } from '../const';
import { PlayerClass } from "../sprites/PlayerClass";

const TILE_SIZE = 64;
const CHUNK_SIZE = 4;
const CHUNKS_X = 25;
const CHUNKS_Y = 15;

export class CaveLevel extends Scene {
    constructor() {
        super('CaveLevel');
    }
    
    create() {
        this.add.image(0, 0, 'bgcave').setOrigin(0);
        
        this.playerHandler = new PlayerClass(this, CHUNKS_X*TILE_SIZE*CHUNK_SIZE, CHUNKS_Y*TILE_SIZE*CHUNK_SIZE);
        this.player = this.playerHandler.createPlayer();
        this.playerHandler.setPlayerPosition(200, 200);
        this.physics.world.setBounds(0, 0, CHUNKS_X*TILE_SIZE*CHUNK_SIZE, CHUNKS_Y*TILE_SIZE*CHUNK_SIZE);
        
        this.cameras.main.fadeIn(500, 0, 0, 0);
        const layout = this.generateLayout();
        console.log(layout);
        this.drawRoom(layout);
        this.processCollision();
    }
    
    update() {
        this.playerHandler.updatePlayer();
    }
    
    generateLayout() {
        const layout = [];
        for (let y = 0; y < CHUNKS_Y; y++) {
            const layer = [];
            for (let x = 0; x < CHUNKS_X; x++) {
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
            tileWidth: TILE_SIZE+TILE_SIZE,
            tileHeight: TILE_SIZE,
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
        this.physics.add.collider(this.player, this.layer, (player, layer) => {
            // if (player.body.velocity.y == 0) {
            //     this.player.inAir = true;
            // } else {
            //     this.player.inAir = false;
            // }
        });
    }
}