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
        this.add.image(0, 0, 'background').setOrigin(0);

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
        this.shiftButton = this.input.keyboard.addKey("SHIFT")

        this.canDash = true;
        this.isDashing = false;
        this.isRunning = false;

        // --- Генерация уровня ---
        this.platforms = this.physics.add.staticGroup();
        this.generateLevel();
        this.physics.add.collider(this.player, this.platforms);
        
        const spawnX = 960 / 2;
        const spawnY = Const.HEIGHT * 2;
        this.player.setPosition(spawnX, spawnY - 100);

        // Границы мира
        this.physics.world.setBounds(0, 0, Const.WIDTH * 2, Const.HEIGHT * 2 - 24);

        // --- Камера ---
        var camera = this.cameras.add(
            0,
            0,
            Const.WIDTH,
            Const.HEIGHT,
            true,
            'FirstLevelCam'
        );
        
        camera.startFollow(this.player, false, 0.1, 1);
        camera.setBounds(0, 0, Const.WIDTH*2, Const.HEIGHT*2, true);
        camera.setZoom(1, 1);
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
        if ((Phaser.Input.Keyboard.JustDown(this.keys.dash) || Phaser.Input.Keyboard.JustDown(this.shiftButton)) && this.canDash && !this.isDashing) {
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
                if (!this.isRunning) {
                    this.player.play('startrun', true)
                    this.time.delayedCall(150, () => { // время, через которое начнётся бег // переход с начала бега в бег
                        this.isRunning = true;
                    });
                } else {
                    this.player.play('run', true);
                }
            } else {
                this.player.play('idle', true);
            }
        } else {
            this.player.play('jump', true);
        }
    }

    generateLevel() {
        this.platforms.create(Const.WIDTH, Const.HEIGHT*2 - 20, 'ground').setScale(15, 1).refreshBody();
        for (let i = 0; i < 15; i++) {
            this.platforms.create(getRandomInt(0, Const.WIDTH*2), Const.HEIGHT*2/5*i, 'ground');
        }
    }
}
