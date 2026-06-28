import { Scene } from 'phaser';
import * as Phaser from 'phaser';
import * as Const from '../const';
import { getRandomInt, getRandomFloat } from '../utils';
import { createPlayerAnimations } from '../animations.js';

export class FirstLevel extends Scene {
    constructor() {
        super('FirstLevel');
    }

    create() {
        this.add.image(Const.WIDTH/2, Const.HEIGHT/2, 'background');

        // --- Игрок ---
        this.player = this.physics.add.sprite(Const.WIDTH/2, Const.HEIGHT/2, 'person');
        this.player.setCollideWorldBounds(true);
        createPlayerAnimations(this.anims);
        this.player.play('idle');

        this.keys = this.input.keyboard.addKeys({
            up: 'w',
            down: 's',
            left: 'a',
            right: 'd',
            dash: 'q'
        });
        this.spaceButton = this.input.keyboard.addKey('space');

        this.canDash = true;
        this.isDashing = false;

        // --- Уровень ---
        this.platforms = this.physics.add.staticGroup();
        this.platforms.create(Const.WIDTH/2, Const.HEIGHT-50, 'ground').setScale(2).refreshBody();

        this.physics.world.setBounds(0, 0, Const.WIDTH, Const.HEIGHT);
        this.physics.add.collider(this.player, this.platforms);
        for (let i = 0; i < 5; i++) {
            this.platforms.create(getRandomInt(0, Const.WIDTH), Const.HEIGHT/5*i, 'ground');
        }
    }

    update() {

        // --- Управление ---
        if (!this.isDashing) {
            if (this.keys.left.isDown && !this.keys.right.isDown) {
                if (!this.player.body.touching.down) {
                    this.player.setVelocityX(-500);
                }
                else this.player.setVelocityX(-400);
                this.player.setFlipX(true);

            }
            else if (this.keys.right.isDown && !this.keys.left.isDown) {
                if (!this.player.body.touching.down) {
                    this.player.setVelocityX(500);
                }
                else this.player.setVelocityX(400);
                this.player.setFlipX(false);
            }
            else {
                this.player.setVelocityX(0);
            }

            if ((this.keys.up.isDown || this.spaceButton.isDown) && this.player.body.touching.down) {
                this.player.setVelocityY(-700);
            }

            this.updateAnimation();
        }
        

        // --- Механика рывка ---
        if (Phaser.Input.Keyboard.JustDown(this.keys.dash) && this.canDash && !this.isDashing) {
            let dashX = 0;
            if (this.keys.right.isDown && !this.keys.left.isDown) {
                dashX = Const.DASH_SPEED;
            } else if (this.keys.left.isDown && !this.keys.right.isDown) {
                dashX = -Const.DASH_SPEED;
            }

            if (dashX != 0) {
                this.player.setVelocityX(dashX);
                this.canDash = false;
                this.isDashing = true;

                this.time.delayedCall(Const.DASH_COOLDOWN, () => {
                    this.canDash = true;
                });

                this.time.delayedCall(Const.DASH_DURATION, () => {
                    this.isDashing = false;
                    this.player.setVelocityX(0);
                });
            }
            this.updateAnimation();
        }
    }

    updateAnimation() {
        if (this.isDashing) {
            this.player.play('dash', true);
            return;
        }

        if (this.player.body.touching.down) {
            // на земле
            if (this.keys.left.isDown && this.keys.right.isDown) {
                this.player.play('idle', true);
                return;
            } else if (this.keys.left.isDown || this.keys.right.isDown) {
                this.player.play('run', true);
            } else {
                this.player.play('idle', true);
            }
        } else {
            this.player.play('jump', true);
        }
    }
}
