import { Scene } from 'phaser';
import { WIDTH, HEIGHT, chunks, paths } from '../const';
import { PlayerClass } from "./PlayerClass";


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
}