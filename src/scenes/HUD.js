import { Scene } from "phaser";
import { WIDTH, HEIGHT } from '../const';

export class HUD extends Scene {
    constructor() {
        super('HUD');
    }

    create(parentScene) {
        this.coinCounter = this.add.text(20, 20, `Монеты: ?`, { 
            fontFamily: 'Arial Black', 
            fontSize: 38, 
            color: '#ffffff', 
            stroke: '#000000', 
            strokeThickness: 8 
        });
        this.registry.events.on('changedata-coins', (parent, value) => {
            this.setCoins(value);
        })
        this.add.rectangle(20, HEIGHT-20, 500, 32).setStrokeStyle(5, 0x000000).setOrigin(0, 1);
        this.bar = this.add.rectangle(25, HEIGHT-25, 500-10, 32-10, 0x00ff00).setOrigin(0, 1);
        this.registry.events.on('changedata-health', (parent, value) => {
            this.setHealth(value);
        })
        if (parentScene == 'CaveLevel') {
            this.roomCounter = this.add.text(WIDTH-20, 20, `Комната: ?/?`, { 
                fontFamily: 'Arial Black', 
                fontSize: 38, 
                color: '#ffffff', 
                stroke: '#000000', 
                strokeThickness: 8 
            }).setOrigin(1, 0);
            this.registry.events.on('changedata-currentLevel', (parent, value) => {
                this.setRooms(value);
            })
        }

        const coins = this.registry.get(`coins`) ?? 0;
        const current = this.registry.get(`currentLevel`) ?? 1;
        const health = this.registry.get(`health`) ?? 1;
        this.setHealth(health);
        this.setRooms(current);
        this.setCoins(coins);
    }

    setHealth(value) {
        this.bar.width = Math.max(value*5, 10)-10;
        if (value > 75) {
            this.bar.fillColor = 0x00ff00;
        } else if (value > 50) {
            this.bar.fillColor = 0xeeff00;
        } else if (value > 25) {
            this.bar.fillColor = 0xfe9900;
        } else {
            this.bar.fillColor = 0xff0000;
        }
    }

    setCoins(value) {
        this.coinCounter.setText(`Монеты: ${value}`);
    }

    setRooms(value) {
        if (!this.roomCounter) return;
        this.roomCounter.setText(`Комната: ${value}/${this.registry.get(`maxLevel`) ?? 1}`);
    }
}