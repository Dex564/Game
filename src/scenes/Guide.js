import { Scene } from "phaser";
import { WIDTH, HEIGHT, titleStyle, textStyle, keyStyle } from "../const";

export class Guide extends Scene {
    constructor() {
        super('Guide');
    }
    
    create(parentLevel) {
        const overlay = this.add.graphics();
        overlay.fillStyle(0x000000);
        overlay.fillRect(0, 0, WIDTH, HEIGHT);
        this.add.text(WIDTH/2, 0, 'Информация', titleStyle).setOrigin(0.5, 0);

        this.add.text(WIDTH/2, 85, 'Вы находитесь в греческом мире, ваша цель иследовать подземные пещеры.', textStyle).setOrigin(0.5, 0);
        this.add.text(WIDTH/2, 85+42, 'Сражайтесь в врагами, чтобы получить опыт. За повышение уровня даются улучшения.', textStyle).setOrigin(0.5, 0);
        this.add.text(WIDTH/2, 85+42+42, 'За монеты с сундуков вы можете восстановить здоровье в магазине в лобби.', textStyle).setOrigin(0.5, 0);


        this.add.text(WIDTH/2, 240, 'Управление', titleStyle).setOrigin(0.5, 0);
        this.base = 360;
        this.spawnKeyLabel('Влево', ['A']);
        this.spawnKeyLabel('Вправо', ['D']);
        this.spawnKeyLabel('Прыжок', ['W', 'Space']);
        this.spawnKeyLabel('Рывок', ['Q', 'Shift']);
        this.spawnKeyLabel('Взаимодействие', ['E']);
        this.spawnKeyLabel('Пауза', ['ESC']);
        this.spawnKeyLabel('Удар', ['leftClick']);



        this.add.image(WIDTH/2, HEIGHT-270, 'continue_button').setInteractive({ useHandCursor: true }).once('pointerdown', () => {
            this.scene.resume(parentLevel);
            this.scene.stop('Guide');
        }).setOrigin(0.5, 0);
    }

    spawnKey(x, y, keyCode, type = 'default') {
        if (type == 'medium') {
            this.add.image(x, y, 'guideKeyMedium');
        } else if (type == 'long') {
            this.add.image(x, y, 'guideKeyLong');
        } else {
            this.add.image(x, y, 'guideKey');
        }
        this.add.text(x, y, keyCode, keyStyle).setOrigin(0.5);
    }

    spawnKeyLabel(text, keys) {
        let offset = WIDTH/2-200;
        for (const key of keys) {
            if (key == 'Space' || key == 'Shift') {
                offset+=40;
                this.spawnKey(offset, this.base, key, 'long');
                offset+=100;
            } else if (key == 'leftClick') {
                this.base += 20;
                this.add.image(offset, this.base, 'leftClick');
                offset+=60;
            } else if (key == 'ESC') {
                offset+=15;
                this.spawnKey(offset, this.base, key, 'medium');
                offset+=75;
            } else {
                this.spawnKey(offset, this.base, key);
                offset+=60; 
            }
        }
        this.add.text(offset-25, this.base, text, textStyle).setOrigin(0, 0.5);
        this.base += 60;
    }
}