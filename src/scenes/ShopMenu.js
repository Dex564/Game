import { Scene } from "phaser";
import { Storage } from '../classes/Storage.js';
import { WIDTH, HEIGHT, titleStyle } from "../const";

export class ShopMenu extends Scene {
    constructor() {
        super('ShopMenu');
    }
    create(parentLevel) {
        this.storage = new Storage(this.registry);
        const overlay = this.add.graphics();
        overlay.fillStyle(0x000000, 0.7);
        overlay.fillRect(0, 0, WIDTH, HEIGHT);
        this.add.text(WIDTH/2, 100, 'Магазин восстановления', titleStyle).setOrigin(0.5, 0);

        const values = [10, 25, 50, 100];
        for (const index in values) {
            const value = values[index];
            const offsetX = index*200;
            this.add.image(WIDTH/2-300+offsetX, HEIGHT/2, `cardHeal${value}`)
                .setInteractive({ useHandCursor: true })
                .setScale(2.5)
                .on('pointerdown', () => {
                    this.processBuy(value);
                    this.scene.resume(parentLevel);
                    this.scene.pause(parentLevel);
                });
            this.add.text(WIDTH/2-300+offsetX, HEIGHT/2-250, `${value} монет`, 'hintStyle').setOrigin(0.5, 0).setScale(1.5);
        }

        this.add.image(WIDTH/2, HEIGHT-300, 'back_button').setInteractive({ useHandCursor: true }).once('pointerdown', () => {
            this.scene.resume(parentLevel);
            this.scene.stop('ShopMenu');
        }).setOrigin(0.5, 0);

        this.input.keyboard.on('keydown', (key) => {
            if (key.code == 'Escape') {
                this.scene.resume(parentLevel);
                this.scene.stop('ShopMenu');
            }
        });
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