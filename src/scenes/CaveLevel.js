import { Scene } from 'phaser';
import { WIDTH, HEIGHT, chunks, paths } from '../const';
import { PlayerClass } from "./PlayerClass";

const TILE_SIZE = 64;
const CHUNK_SIZE = 4;
const CHUNKS_X = 25;
const CHUNKS_Y = 14;

export class CaveLevel extends Scene {
    constructor() {
        super('CaveLevel');
    }
    
    create() {
        this.add.image(0, 0, 'background').setOrigin(0);
        
        this.playerHandler = new PlayerClass(this);
        this.player = this.playerHandler.createPlayer();
        this.playerHandler.setPlayerPosition(WIDTH/2, HEIGHT/2 - 200);
        
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
        const maxX = 30;
        const maxY = 16;
        for (let y = 0; y < maxY; y++) {
            const layer = [];
            for (let x = 0; x < maxX; x++) {
                // left, right, up, down
                const can = [1, 1, 1, 1];
                
                if (layer[x-1] && !paths[1].includes(layer[x-1])) {
                    can[0] = 0;
                }
                if (layout[y-1] && !paths[3].includes(layout[y-1][x])) {
                    can[2] = 0;
                }
                
                if (x == 0) can[0] = 0;
                if (x == maxX-1) can[1] = 0;
                if (y == 0) can[2] = 0;
                if (y == maxY-1) can[3] = 0;
                let possible = [];
                if (can[0]) paths[0].forEach((value) => possible.push(value));
                if (can[1]) paths[1].forEach((value) => possible.push(value));
                if (can[2]) paths[2].forEach((value) => possible.push(value));
                if (can[3]) paths[3].forEach((value) => possible.push(value));
                if (!can[0]) possible = possible.filter(item => !paths[0].includes(item));
                if (!can[1]) possible = possible.filter(item => !paths[1].includes(item));
                if (!can[2]) possible = possible.filter(item => !paths[2].includes(item));
                if (!can[3]) possible = possible.filter(item => !paths[3].includes(item));
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
            tileWidth: TILE_SIZE,
            tileHeight: TILE_SIZE,
            width: CHUNKS_X * CHUNK_SIZE,
            height: CHUNKS_Y * CHUNK_SIZE
        });
        
        const tileset = this.map.addTilesetImage('wall', 'tile', TILE_SIZE, TILE_SIZE);
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
            if (player.body.velocity.y == 0) {
                this.isOnGround = true;
            } else {
                this.isOnGround = false;
            }
        });
    }
}