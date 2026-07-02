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
            dash: 'q',
            attack: 'l'
        });
        this.spaceButton = this.scene.input.keyboard.addKey('space');
        this.shiftButton = this.scene.input.keyboard.addKey("SHIFT");

        // Лкм на атаку
        this.attackButtonPressed = false;
        this.scene.input.on('pointerdown', (pointer) => {
            if (pointer.leftButtonDown()) {
                this.attackButtonPressed = true;
                this.scene.time.delayedCall(Const.ATTACK_DURATION, () => this.attackButtonPressed = false)
            }
        });

        this.canDash = true;
        this.isDashing = false;
        this.isRunning = false;

        this.inAir = false;
        this.canControl = true;

        this.canJumpRight = true;
        this.canJumpLeft = true;

        this.isAttacking = false;

        this.createCamera();
        return this.player;
    }

    createCamera() {
        const camera = this.scene.cameras.add(0, 0, this.worldX, this.worldY, true);
        camera.startFollow(this.player, true, 0.1, 1);
        camera.setBounds(0, 0, this.worldX, this.worldY, true);
        let cameraZoom = 2;
        camera.setZoom(cameraZoom, cameraZoom);
    }

    updatePlayer() {
        // --- Управление ---
        if (!this.isDashing && this.canControl) {
            // Влево
            if (this.keys.left.isDown && !this.keys.right.isDown && this.canControl) {
                if (!this.player.body.blocked.down) {
                    this.player.setVelocityX(-500);
                } else {
                    this.player.setVelocityX(-400);
                }
                this.player.setFlipX(true);
            }
            // Вправо
            else if (this.keys.right.isDown && !this.keys.left.isDown && this.canControl) {
                if (!this.player.body.blocked.down) {
                    this.player.setVelocityX(500);
                } else {
                    this.player.setVelocityX(400);
                }
                this.player.setFlipX(false);
            }
            // Нет движения или управление заблокировано
            else {
                if (this.canControl) {
                    this.player.setVelocityX(0);
                }
            }

            // Прыжок с земли
            if ((this.keys.up.isDown || this.spaceButton.isDown) && this.player.body.blocked.down) {
                this.player.setVelocityY(-500);
            }

            // Состояние падения
            if (this.player.body.velocity.y != 0 && !this.player.body.blocked.down && !this.player.body.blocked.up) {
                this.inAir = true;
            } else {
                this.inAir = false;
            }

            // --- Взаимодействие со стеной ---
            if (!this.player.body.blocked.down && this.canControl) {
                const wantJump = this.keys.up.isDown || this.spaceButton.isDown;
                const touchingLeft = this.player.body.touching.left || this.player.body.blocked.left;
                const touchingRight = this.player.body.touching.right || this.player.body.blocked.right;
                
                // --- Отскок от стены ---
                if (wantJump) {
                    if (touchingLeft && this.canJumpRight) {
                        this.player.x += 6;                       
                        this.player.setVelocityX(300);
                        this.player.setVelocityY(-600);
                        this.player.setFlipX(false);
                        this.canControl = false;
                        this.canJumpRight = false;

                        this.scene.time.delayedCall(500, () => {
                            this.player.setVelocityX(0);
                            this.canControl = true;
                        });
                        this.scene.time.delayedCall(1180, () => this.canJumpRight = true);
                    }
                    
                    else if (touchingRight && this.canJumpLeft) {
                        this.player.x -= 6;
                        this.player.setVelocityX(-300);
                        this.player.setVelocityY(-600);
                        this.player.setFlipX(true);
                        this.canControl = false;
                        this.canJumpLeft = false;

                        this.scene.time.delayedCall(500, () => {
                            this.player.setVelocityX(0);
                            this.canControl = true;
                        });
                        this.scene.time.delayedCall(1180, () => this.canJumpLeft = true);
                    }
                }

                // --- Скольжение по стене ---
                const moveTowardsWall = (touchingLeft && this.keys.left.isDown) || (touchingRight && this.keys.right.isDown);
                if (moveTowardsWall && !wantJump) {
                    this.player.body.allowGravity = false;
                    this.player.setVelocityY(Const.WALL_SLIDE_SPEED);
                    // this.player.play('wallslide', true);
                } else {
                    this.player.body.allowGravity = true;
                }
            }

            if (this.player.body.blocked.down) {
                this.canWallJump = true;
                this.canJumpLeft = true;
                this.canJumpRight = true;
            }

            this.updateAnimation();
        }

        // --- Механика рывка (dash) ---
        if ((Phaser.Input.Keyboard.JustDown(this.keys.dash) || Phaser.Input.Keyboard.JustDown(this.shiftButton)) && this.canDash && !this.isDashing && !this.isAttacking) {
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

        // --- Атака ---
        if (!this.isDashing && !this.isAttacking && this.player.body.blocked.down) {
            if (Phaser.Input.Keyboard.JustDown(this.keys.attack) || this.attackButtonPressed) {
                this.isAttacking = true;
                this.canControl = false;
                this.canDash = false;
                this.player.body.y -= 10;
                this.player.setVelocityX(0);
                this.scene.time.delayedCall(Const.ATTACK_DURATION, () => {
                    this.isAttacking = false;
                    this.canControl = true;
                    this.canDash = true;
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

        if (this.isAttacking) {
            this.player.play('attack', true);
            return;
        }

        if (this.player.body.blocked.down) {
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
