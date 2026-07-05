import { Scene } from "phaser";
import { WIDTH } from '../const';

export class HUD extends Scene {
    constructor() {
        super('HUD');
    }

    create(parentScene) {
        const coins = this.registry.get(`coins`) ?? 0;
        const current = this.registry.get(`currentLevel`) ?? 1;
        const max = this.registry.get(`maxLevel`) ?? 1;
        this.coinCounter = this.add.text(20, 20, `Coins: ${coins}`, { 
            fontFamily: 'Arial Black', 
            fontSize: 38, 
            color: '#ffffff', 
            stroke: '#000000', 
            strokeThickness: 8 
        });
        this.registry.events.on('changedata-coins', (parent, value) => {
            this.coinCounter.setText(`Coins: ${value}`);
        })
        if (parentScene == 'cave') {
            this.roomCounter = this.add.text(WIDTH-20, 20, `Room: ${current}/${max}`, { 
                fontFamily: 'Arial Black', 
                fontSize: 38, 
                color: '#ffffff', 
                stroke: '#000000', 
                strokeThickness: 8 
            }).setOrigin(1, 0);
            this.registry.events.on('changedata-currentLevel', (parent, value) => {
                this.roomCounter.setText(`Room: ${value}/${this.registry.get(`maxLevel`) ?? 1}`);
            })
        }
    }
}