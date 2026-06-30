import { Scene } from 'phaser';
import * as Phaser from 'phaser';
import * as Const from '../const.js';
import { getRandomInt, getRandomFloat } from '../utils.js';

export class PlayerClass {
    constructor(scene, worldX = Const.WIDTH, worldY = Const.HEIGHT) {
        this.player = null;
        this.scene = scene;
        this.worldX = worldX;
        this.worldY = worldY;
    }

    createPlayer() {
        this.player = this.scene.physics.add.sprite(this.worldX / 2, this.worldY / 2, 'person');
        this.player.setCollideWorldBounds(true);
        this.player.play('idle');

        this.keys = this.scene.input.keyboard.addKeys({
            up: 'w',
            down: 's',
            left: 'a',
            right: 'd',
            dash: 'q'
        });
        this.spaceButton = this.scene.input.keyboard.addKey('space');
        this.shiftButton = this.scene.input.keyboard.addKey("SHIFT")

        this.canDash = true;
        this.isDashing = false;
        this.isRunning = false;

        this.createCamera();
        return this.player;
    }

    createCamera() {
        // --- Камера ---
        const camera = this.scene.cameras.add(
            0,
            0,
            this.worldX,
            this.worldY,
            true
        );

        camera.startFollow(this.player, true, 0.1, 1);
        camera.setBounds(0, 0, this.worldX, this.worldY, true);
        camera.setZoom(2, 2);
    }

    updatePlayer() {

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

                this.scene.time.delayedCall(Const.DASH_COOLDOWN, () => {
                    this.canDash = true;
                });

                this.scene.time.delayedCall(Const.DASH_DURATION, () => {
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
                    this.scene.time.delayedCall(100, () => { // время, через которое начнётся бег // переход с начала бега в бег
                        this.isRunning = true;
                    });
                } else {
                    this.player.play('run', true);
                }
            } else {
                this.isRunning = false;
                this.player.play('idle', true);
            }
        } else {
            this.player.play('jump', true);
        }
    }

    getPlayer() {
        return this.player;
    }

    setPlayerPosition(x, y) {
        if (this.player) {
            this.player.setPosition(x, y);
        }
    }
}
