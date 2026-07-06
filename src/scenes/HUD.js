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
        this.coinCounter = this.add.text(20, 20, `Монеты: ${coins}`, { 
            fontFamily: 'Arial Black', 
            fontSize: 38, 
            color: '#ffffff', 
            stroke: '#000000', 
            strokeThickness: 8 
        });
        this.registry.events.on('changedata-coins', (parent, value) => {
            this.coinCounter.setText(`Монеты: ${value}`);
        })
        if (parentScene == 'CaveLevel') {
            this.roomCounter = this.add.text(WIDTH-20, 20, `Комната: ${current}/${max}`, { 
                fontFamily: 'Arial Black', 
                fontSize: 38, 
                color: '#ffffff', 
                stroke: '#000000', 
                strokeThickness: 8 
            }).setOrigin(1, 0);
            this.registry.events.on('changedata-currentLevel', (parent, value) => {
                this.roomCounter.setText(`Комната: ${value}/${this.registry.get(`maxLevel`) ?? 1}`);
            })
        }
    }
}