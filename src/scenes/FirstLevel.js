import { Scene } from 'phaser';
import * as Phaser from 'phaser';
import { WIDTH, HEIGHT } from '../const';
import { getRandomInt, getRandomFloat } from '../utils';

export class FirstLevel extends Scene {
    constructor() {
        super('FirstLevel');
    }

    create() {
        this.add.image(WIDTH/2, HEIGHT/2, 'bg');

        this.physics.world.setBounds(0, 0, WIDTH, HEIGHT);
        this.player = this.physics.add.sprite(WIDTH/2, HEIGHT/2, 'person');

        // this.player.setBounce(0.2);
        this.player.setCollideWorldBounds(true);

        this.cursors = this.input.keyboard.createCursorKeys();
        this.platforms = this.physics.add.staticGroup();
        this.platforms.create(WIDTH/2, HEIGHT-50, 'ground').setScale(2).refreshBody();


        this.physics.add.collider(this.player, this.platforms);
        for (let i = 0; i < 5; i++) {
            this.platforms.create(getRandomInt(0, WIDTH), HEIGHT/5*i, 'ground');
        }
    }

    update() {
        if (this.cursors.left.isDown) {
            if (!this.player.body.touching.down) {
                this.player.setVelocityX(-500);
            }
            else this.player.setVelocityX(-400);

        }
        else if (this.cursors.right.isDown) {
            if (!this.player.body.touching.down) {
                this.player.setVelocityX(500);
            }
            else this.player.setVelocityX(400);
        }
        else {
            this.player.setVelocityX(0);
        }

        if (this.cursors.up.isDown && this.player.body.touching.down) {
            this.player.setVelocityY(-700);
        }

        if (this.cursors.down.isDown && !this.player.body.touching.down) {
            this.player.setVelocityY(2000);
        }
    }
}
