import Phaser from 'phaser';
import { CARDS } from './CardsConst.js';

export class LevelUpScene extends Phaser.Scene {
    constructor() {
        super('LevelUp');
    }

    init(data) {
        this.player = data.player;
        this.parentSceneKey = data.parentScene || 'CaveLevel';
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

        const cardWidth = 128;
        const cardHeight = 256;
        const gap = 140;
        const totalWidth = cardWidth * 2 + gap;
        const startX = (width - totalWidth) / 2 + cardWidth / 2;
        const targetY = height / 2;

        this.cardSprites = [];
        this.chosenCards.forEach((cardDef, index) => {
            const targetX = startX + index * (cardWidth + gap);
            const startY = -cardHeight;

            const sprite = this.add.image(targetX, startY, cardDef.imageKey)
                .setScrollFactor(0)
                .setDepth(1)
                .setInteractive({ useHandCursor: true })
                .setDisplaySize(cardWidth, cardHeight);

            sprite.on('pointerover', () => sprite.setTint(0xcccccc));
            sprite.on('pointerout', () => sprite.clearTint());
            sprite.on('pointerdown', () => {
                this.cardSprites.forEach(s => s.disableInteractive());
                this.tweens.add({
                    targets: sprite,
                    scaleX: 1.3,
                    scaleY: 1.3,
                    alpha: 0,
                    duration: 200,
                    ease: 'Power2',
                    onComplete: () => {
                        cardDef.apply(this.player);
                        this.cleanUp();
                        this.resumeGame();
                    }
                });
            });

            this.cardSprites.push(sprite);

            this.tweens.add({
                targets: sprite,
                y: targetY,
                duration: 600,
                ease: 'Back.easeOut',
                delay: index * 150
            });
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