import { Scene } from "phaser";
import { Storage } from '../classes/Storage.js';
import { WIDTH, HEIGHT, hintStyle } from "../const";

export class ShopMenu extends Scene {
    constructor() {
        super('ShopMenu');
    }
    create(parentLevel) {
        this.storage = new Storage(this.registry);
        const overlay = this.add.graphics();
        overlay.fillStyle(0x000000, 0.7);
        overlay.fillRect(0, 0, WIDTH, HEIGHT);
        this.add.text(WIDTH/2, 100, 'Магазин восстановления', { 
            fontFamily: 'Arial Black', 
            fontSize: 64, 
            color: '#ffffff', 
            stroke: '#000000', 
            strokeThickness: 8 
        }).setOrigin(0.5, 0);
        this.input.keyboard.on('keydown', (key) => {
            if (key.code == 'Escape') {
                this.scene.resume(parentLevel);
                this.scene.stop('ShopMenu');
            }
        });

        this.add.image(WIDTH/2-300, HEIGHT/2, 'cardHeal10')
            .setInteractive({ useHandCursor: true })
            .setScale(2)
            .on('pointerdown', () => {
                this.processBuy(10);
                this.scene.resume(parentLevel);
                this.scene.pause(parentLevel);
            });
        this.add.image(WIDTH/2-100, HEIGHT/2, 'cardHeal25')
            .setInteractive({ useHandCursor: true })
            .setScale(2)
            .on('pointerdown', () => {
                this.processBuy(25);
                this.scene.resume(parentLevel);
                this.scene.pause(parentLevel);
            });
        this.add.image(WIDTH/2+100, HEIGHT/2, 'cardHeal50')
            .setInteractive({ useHandCursor: true })
            .setScale(2)
            .on('pointerdown', () => {
                this.processBuy(50);
                this.scene.resume(parentLevel);
                this.scene.pause(parentLevel);
            });
        this.add.image(WIDTH/2+300, HEIGHT/2, 'cardHeal100')
            .setInteractive({ useHandCursor: true })
            .setScale(2)
            .on('pointerdown', () => {
                this.processBuy(100);
                this.scene.resume(parentLevel);
                this.scene.pause(parentLevel);
            });

        this.add.text(WIDTH/2-300, HEIGHT/2-200, '10 монет', hintStyle).setOrigin(0.5, 0).setScale(1.5);
        this.add.text(WIDTH/2-100, HEIGHT/2-200, '25 монет', hintStyle).setOrigin(0.5, 0).setScale(1.5);
        this.add.text(WIDTH/2+100, HEIGHT/2-200, '50 монет', hintStyle).setOrigin(0.5, 0).setScale(1.5);
        this.add.text(WIDTH/2+300, HEIGHT/2-200, '100 монет', hintStyle).setOrigin(0.5, 0).setScale(1.5);

        this.add.image(WIDTH/2, HEIGHT-300, 'back_button').setInteractive({ useHandCursor: true }).once('pointerdown', () => {
            this.scene.resume(parentLevel);
            this.scene.stop('ShopMenu');
        }).setOrigin(0.5, 0);
    }

    processBuy(requireCoins) {
        const coins = this.registry.get('coins') ?? 0;
        const maxHp = this.registry.get('maxHp') ?? 0;
        const health = this.registry.get('health') ?? 0;
        if (coins < requireCoins || maxHp == health) {
            return;
        }
        this.storage.save('coins', coins-requireCoins);
        this.storage.save('health', Math.min(health+requireCoins, maxHp));
    }
}