import { Scene } from "phaser";
import { WIDTH, HEIGHT } from '../const';

export class HUD extends Scene {
    constructor() {
        super('HUD');
    }

    create(parentScene) {
        this.barMaxWidth = 350;
        this.barX = 25;
        this.barY = HEIGHT - 20;
        this.barHeight = 22;
        this.border = 5;
        this.padding = 3;

        this.coinCounter = this.add.text(20, 20, `Монеты: ?`, {
            fontFamily: 'Arial Black',
            fontSize: 38,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 8
        });

        this.add.rectangle(
            this.barX,
            this.barY,
            this.barMaxWidth + 2 * (this.border + this.padding),
            this.barHeight + 2 * (this.border + this.padding),
            0x000000
        ).setOrigin(0, 1);

        this.bar = this.add.rectangle(
            this.barX + this.border + this.padding,
            this.barY - this.border - this.padding,
            this.barMaxWidth,
            this.barHeight,
            0x00ff00
        ).setOrigin(0, 1);

        this.healthText = this.add.text(
            this.barX,
            this.barY - this.barHeight - 10,
            `100/100`,
            {
                fontFamily: 'Arial Black',
                fontSize: 24,
                color: '#ffffff',
                stroke: '#000000',
                strokeThickness: 6
            }
        ).setOrigin(0, 1);

        const expBarWidth = 200;
        const expBarX = WIDTH - 25 - expBarWidth;
        const expBarY = HEIGHT - 20;

        this.expBarBg = this.add.rectangle(
            expBarX,
            expBarY,
            expBarWidth + 2 * (this.border + this.padding),
            this.barHeight + 2 * (this.border + this.padding),
            0x000000
        ).setOrigin(0, 1);

        this.expBar = this.add.rectangle(
            expBarX + this.border + this.padding,
            expBarY - this.border - this.padding,
            expBarWidth,
            this.barHeight,
            0x0088ff
        ).setOrigin(0, 1);

        this.expText = this.add.text(
            expBarX + expBarWidth / 2 + 8,
            expBarY - this.barHeight / 2 - 8,
            `0 / 100`,
            {
                fontFamily: 'Arial Black',
                fontSize: 18,
                color: '#ffffff',
                stroke: '#000000',
                strokeThickness: 4
            }
        ).setOrigin(0.5, 0.5);

        this.registry.events.on('changedata-coins', (parent, value) => {
            this.coinCounter.setText(`Монеты: ${value}`);
        });

        this.registry.events.on('changedata-health', (parent, value) => {
            this.currentHealth = value;
            this.updateHealthBar();
            this.updateHealthText();
        });

        this.registry.events.on('changedata-maxHp', (parent, value) => {
            this.maxHp = value;
            this.updateHealthBar();
            this.updateHealthText();
        });

        this.registry.events.on('changedata-xp', (parent, value) => {
            this.updateExpBar();
        });

        this.registry.events.on('changedata-playerLevel', (parent, value) => {
            this.updateExpBar();
        });

        if (parentScene === 'CaveLevel') {
            this.roomCounter = this.add.text(WIDTH - 20, 20, `Комната: ?/?`, {
                fontFamily: 'Arial Black',
                fontSize: 38,
                color: '#ffffff',
                stroke: '#000000',
                strokeThickness: 8
            }).setOrigin(1, 0);
            this.registry.events.on('changedata-currentLevel', (parent, value) => {
                this.setRooms(value);
            });
        }

        this.currentHealth = this.registry.get('health') ?? 1;
        this.maxHp = this.registry.get('maxHp') ?? 100;
        const coins = this.registry.get('coins') ?? 0;
        const current = this.registry.get('currentLevel') ?? 1;

        this.coinCounter.setText(`Монеты: ${coins}`);
        this.setRooms(current);
        this.updateHealthBar();
        this.updateHealthText();
        this.updateExpBar();
    }

    updateHealthBar() {
        const fraction = Math.min(this.currentHealth / this.maxHp, 1);
        this.bar.width = Math.max(fraction * this.barMaxWidth, 0);

        const percent = fraction * 100;
        if (percent > 75) {
            this.bar.fillColor = 0x00ff00;
        } else if (percent > 50) {
            this.bar.fillColor = 0xeeff00;
        } else if (percent > 25) {
            this.bar.fillColor = 0xfe9900;
        } else {
            this.bar.fillColor = 0xff0000;
        }
    }

    updateHealthText() {
        if (this.healthText) {
            this.healthText.setText(`${Math.round(this.currentHealth)}/${Math.round(this.maxHp)}`);
        }
    }

    updateExpBar() {
        const currentXp = this.registry.get('xp') ?? 0;
        const level = this.registry.get('playerLevel') ?? 1;
        const maxXp = level * 10 + 100;

        const fraction = Math.min(currentXp / maxXp, 1);
        const barWidth = 200;
        this.expBar.width = Math.max(fraction * barWidth, 0);

        if (this.expText) {
            this.expText.setText(`${Math.round(currentXp)} / ${Math.round(maxXp)}`);
        }
    }

    setRooms(value) {
        if (!this.roomCounter || !this.roomCounter.active) return;
        const max = this.registry.get('maxLevel') ?? 1;
        this.roomCounter.setText(`Комната: ${value}/${max}`);
    }
}