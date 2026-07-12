import Phaser from 'phaser';
import { CARDS } from './CardsConst.js';

export class LevelUpScene extends Phaser.Scene {
    constructor() {
        super('LevelUp');
    }

    init(data) {
        this.player = data.player;
        this.parentSceneKey = data.parentScene;
    }

    create() {
        const { width, height } = this.cameras.main;
        this.overlay = this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.6)
            .setScrollFactor(0)
            .setDepth(0);

        const card1 = this.weightedRandom(CARDS);
        const remaining = CARDS.filter(c => c.id !== card1.id);
        const card2 = remaining.length > 0 ? this.weightedRandom(remaining) : card1;
        this.chosenCards = [card1, card2];

        const cardWidth = 64;
        const cardHeight = 128;
        const gap = 40;
        const totalWidth = cardWidth * 2 + gap;
        const startX = (width - totalWidth) / 2 + cardWidth / 2;
        const cardY = height / 2;

        this.cardSprites = [];
        this.chosenCards.forEach((cardDef, index) => {
            const x = startX + index * (cardWidth + gap);
            const sprite = this.add.image(x, cardY, cardDef.imageKey)
                    .setScrollFactor(0)
                    .setDepth(1)
                    .setInteractive({ useHandCursor: true })
                    .setDisplaySize(cardWidth, cardHeight);
                sprite.on('pointerover', () => sprite.setTint(0xcccccc));
                sprite.on('pointerout', () => sprite.clearTint());
                sprite.on('pointerdown', () => {
                cardDef.apply(this.player);
                this.cleanUp();
                this.resumeGame();
            });

            this.cardSprites.push(sprite);
        });
    }

    weightedRandom(items) {
        const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
        let random = Math.random() * totalWeight;
        for (const item of items) {
            random -= item.weight;
            if (random <= 0) return item;
        }
        return items[items.length - 1];
    }

    cleanUp() {
        if (this.overlay) this.overlay.destroy();
        this.cardSprites.forEach(sprite => sprite.destroy());
    }

    resumeGame() {
        const mainScene = this.scene.get(this.parentSceneKey);
        if (mainScene) {
            mainScene.scene.resume();
            this.player.canControl = true;
            this.player.canDash = true;
            this.player.invincible = false;
        }
        this.scene.stop('LevelUp');
    }
}