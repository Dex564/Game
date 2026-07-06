import * as Phaser from 'phaser';
import * as Const from '../const.js';
import { getRandomInt } from '../utils.js';

export class PlayerClass {
    constructor(scene, worldX = Const.WIDTH, worldY = Const.HEIGHT) {
        this.scene = scene;
        this.worldX = worldX;
        this.worldY = worldY;
        this.player = null;
        this.keys = {};

        // Звуки
        this.walkSound = false;
        this.jumpSound = false;
        
        // Состояния
        this.canDash = true;
        this.isDashing = false;

        this.attackButtonPressed = false;
        this.isAttacking = false;

        this.canControl = true;
        this.canDash = true;

        this.wallJumpRight = true;
        this.wallJumpLeft = true;

        this.isRunning = false;

        this.coyoteTimer = 0;
        this.coyoteDuration = Const.COYOTE_DURATION;
        this._lastTime = 0;

        // Параметры плавного движения
        this.acceleration = 2500;
        this.drag = 2000;
        this.maxSpeedGround = Const.MOVE_SPEED_GROUND;
        this.maxSpeedAir = Const.MOVE_SPEED_AIR;
    }

    /* --------------------------------------------------------------
    СОЗДАНИЕ ИГРОКА
    ----------------------------------------------------------------*/
    createPlayer() {
        this.player = this.scene.physics.add.sprite(
            this.worldX / 2,
            this.worldY / 2,
            'person'
        );
        this.player.setCollideWorldBounds(true);
        this.player.play('idle');

        this.player.setDepth(10);

        this.player.setOrigin(0.5, 1);

        this.player.setSize(20, 60);
        this.player.setOffset(12, 2);

        this.initInput();
        this.createCamera();
        return this.player;
    }

    /* ----------------------------------------------------------------
       ВВОД С КЛАВИАТУРЫ И МЫШИ
    ---------------------------------------------------------------- */
    initInput() {
        const keyboard = this.scene.input.keyboard;

        this.keys = keyboard.addKeys({
            up: 'w',
            down: 's',
            left: 'a',
            right: 'd',
            dash: 'q',
            attack: 'l',
            e: 'e'
        });
        this.jumpKey1 = keyboard.addKey('space');
        this.jumpKey2 = this.keys.up;
        this.shiftKey = keyboard.addKey('SHIFT');
    }

   /* ----------------------------------------------------------------
       КАМЕРА
    ---------------------------------------------------------------- */
    createCamera() {
        const camera = this.scene.cameras.main;
        camera.startFollow(this.player, true, 0.1, 1);
        camera.setBounds(0, 0, this.worldX, this.worldY, true);
        camera.setRoundPixels(true);
        camera.setZoom(2);
    }

    /* ----------------------------------------------------------------
       ОСНОВНОЙ ЦИКЛ ОБНОВЛЕНИЯ
    ---------------------------------------------------------------- */
    updatePlayer() {
        this.updateFallState();
        this.updateCoyoteTimer();
        this.handleMovement();
        this.handleWallInteraction();
        this.handleDash();
        this.handleAttack();
        this.handleJumpRelease();
        this.updateAnimation();
    }

    // --- СОСТОЯНИЕ ПАДЕНИЯ --- //
    updateFallState() {
        const onGround = this.player.body.blocked.down;
        this.isFalling = !onGround && this.player.body.velocity.y > 0;
    }

    // --- ДВИЖЕНИЕ ВЛЕВО/ВПРАВО И ПРЫЖОК (с ускорением) --- //
    handleMovement() {
        if (this.isDashing || !this.canControl) return;

        const left = this.keys.left.isDown;
        const right = this.keys.right.isDown;
        const jump = this.jumpKey1.isDown || this.jumpKey2.isDown;
        const onGround = this.player.body.onFloor();

        // --- ГОРИЗОНТАЛЬНОЕ ДВИЖЕНИЕ --- //
        let targetSpeed = 0;
        const maxSpeed = onGround ? this.maxSpeedGround : this.maxSpeedAir;

        if (left && !right) {
            targetSpeed = -maxSpeed;
            this.player.setFlipX(true);
        } else if (right && !left) {
            targetSpeed = maxSpeed;
            this.player.setFlipX(false);
        }

        // Плавное ускорение/торможение
        const accel = this.acceleration * 0.016;
        const drag = this.drag * 0.032;

        if (targetSpeed !== 0) {
            const diff = targetSpeed - this.player.body.velocity.x;
            if (Math.abs(diff) < accel) {
                this.player.setVelocityX(targetSpeed);
            } else {
                this.player.setVelocityX(this.player.body.velocity.x + Math.sign(diff) * accel);
            }
            if (onGround && !this.walkSound) {
                this.walkSound = true;
                this.scene.sound.play(`step${getRandomInt(1, 5)}`);
                this.scene.time.delayedCall(500, () => {
                    this.walkSound = false;
                });
            }
        } else {
            if (Math.abs(this.player.body.velocity.x) < drag) {
                this.player.setVelocityX(0);
            } else {
                const newVx = this.player.body.velocity.x - Math.sign(this.player.body.velocity.x) * drag;
                this.player.setVelocityX(newVx);
            }
        }

        // --- ПРЫЖОК --- //
        if (jump && (onGround || this.coyoteTimer > 0)) {
            if (!this.jumpSound) {
                this.jumpSound = true;
                this.scene.sound.play(`jump${getRandomInt(1, 2)}`);
                this.scene.time.delayedCall(500, () => {
                    this.jumpSound = false;
                });
            }
            this.player.setVelocityY(Const.JUMP_SPEED);
            this.coyoteTimer = 0;
        }

        if (onGround) {
            this.wallJumpRight = true;
            this.wallJumpLeft = true;
        }
    }

    // --- ВЗАИМОДЕЙСТВИЕ СО СТЕНАМИ --- //
    handleWallInteraction() {
        if (this.player.body.blocked.down || this.isDashing || !this.canControl) return;

        const touchingLeft = this.player.body.touching.left || this.player.body.blocked.left;
        const touchingRight = this.player.body.touching.right || this.player.body.blocked.right;
        const wantJump = this.jumpKey1.isDown || this.jumpKey2.isDown;

        if (wantJump) {
            if (touchingLeft && this.wallJumpRight) {
                this.performWallJump('right');
            } else if (touchingRight && this.wallJumpLeft) {
                this.performWallJump('left');
            }
        }

        const moveIntoWall = (touchingLeft && this.keys.left.isDown) ||
                             (touchingRight && this.keys.right.isDown);
        if (moveIntoWall && !wantJump) {
            this.player.body.allowGravity = false;
            this.player.setVelocityY(Const.WALL_SLIDE_SPEED);
            // анимация wallslide на будущее
        } else {
            this.player.body.allowGravity = true;
        }
    }

    // --- ОТСКОК ОТ СТЕНЫ --- //
    performWallJump(side) {
        const isRight = side === 'right';
        let speed = Const.MOVE_SPEED_AIR - 100
        const wallJumpSpeed = isRight ? speed : -speed;

        this.player.x += isRight ? 6 : -6;
        this.player.setVelocityX(wallJumpSpeed);
        this.player.setVelocityY(Const.JUMP_SPEED - 200);
        this.player.setFlipX(!isRight);

        this.canControl = false;
        if (isRight) this.wallJumpRight = false;
        else this.wallJumpLeft = false;

        this.scene.time.delayedCall(200, () => {
            // this.player.setVelocityX(0);
            this.canControl = true;
        });
        this.scene.time.delayedCall(1180, () => {
            if (isRight) this.wallJumpRight = true;
            else this.wallJumpLeft = true;
        });
    }

    // --- РЫВОК --- //
    handleDash() {
        const canDoDash = this.canDash && !this.isDashing &&
                          !this.isAttacking && (this.canControl || this.canDash);

        const dashKeyPressed = Phaser.Input.Keyboard.JustDown(this.keys.dash) ||
                               Phaser.Input.Keyboard.JustDown(this.shiftKey);

        if (!dashKeyPressed || !canDoDash) return;

        let dashDir = 0;
        if (this.keys.right.isDown && !this.keys.left.isDown) dashDir = 1;
        else if (this.keys.left.isDown && !this.keys.right.isDown) dashDir = -1;

        if (dashDir === 0){
            return;    
        } else if (dashDir == 1) {
            this.player.setFlipX(false);
        } else {
            this.player.setFlipX(true);
        }
        this.player.setVelocityX(dashDir * Const.DASH_SPEED);
        this.canDash = false;
        this.isDashing = true;

        this.scene.time.delayedCall(Const.DASH_DURATION, () => {
            this.isDashing = false;
        });
        this.scene.time.delayedCall(Const.DASH_COOLDOWN, () => {
            this.canDash = true;
        });
    }

    // --- ВРЕМЯ КОЙОТА (ПОБЛАЖКА ДЛЯ ПРЫЖКА) --- //
    updateCoyoteTimer() {
        const onGround = this.player.body.onFloor();

        if (onGround) {
            this.coyoteTimer = this.coyoteDuration;
            this._lastTime = this.scene.time.now;
        } else {
            const elapsed = this.scene.time.now - this._lastTime;
            this.coyoteTimer = Math.max(0, this.coyoteDuration - elapsed);
        }
    }

    // --- ПЕРЕМЕННАЯ ВЫСОТА ПРЫЖКА --- //
    handleJumpRelease() {
        if ((this.jumpKey1.justUp || this.jumpKey2.justUp) && this.player.body.velocity.y < 0) {
            this.player.setVelocityY(this.player.body.velocity.y * 0.25);
        }
    }

    // --- АТАКА --- //
    handleAttack() {
        if (this.isDashing || this.isAttacking || !this.player.body.blocked.down) return;

        const attackKeyDown = this.keys.attack.isDown;
        const LMBDown = this.scene.input.activePointer.leftButtonDown();

        if (attackKeyDown || LMBDown) {
            this.isAttacking = true;
            this.canControl = false;
            this.canDash = false;
            this.player.setVelocityX(0);

            this.scene.time.delayedCall(Const.ATTACK_DURATION, () => {
                this.isAttacking = false;
                this.canControl = true;
                this.canDash = true;
            });
        }
    }

    // --- АНИМАЦИИ --- //
    updateAnimation() {
        // Приоритет: рывок > атака > земные/воздушные
        if (this.isDashing) {
            this.player.play('dash', true);
            return;
        }

        if (this.isAttacking) {
            if (this.player.anims.currentAnim?.key !== 'spearAttack') {
                this.player.setOffset(70, 2);
                this.player.play('spearAttack', true);
            } 
            return;
        } else this.player.setOffset(12, 2);

        const onGround = this.player.body.blocked.down || this.player.body.touching.down;

        if (onGround) {
            const standing = (!this.keys.left.isDown && !this.keys.right.isDown) ||
                             (this.keys.left.isDown && this.keys.right.isDown);
            if (standing) {
                this.isRunning = false;
                this.player.play('idle', true);
            } else {
                if (!this.isRunning) {
                    this.player.play('startrun', true);
                    this.scene.time.delayedCall(100, () => {
                        this.isRunning = true;
                    });
                } else {
                    this.player.play('run', true);
                }
            }
        } else {
            this.isRunning = false;
            if (this.player.body.velocity.y > 0) {
                this.player.play('fall', true);
            } else {
                this.player.play('jump', true);
            }
        }
    }

    // --- ВНЕШНИЕ МЕТОДЫ ДЛЯ СЦЕН --- //
    getPlayer() {
        return this.player;
    }

    setPlayerPosition(x, y) {
        if (this.player) {
            this.player.setPosition(x, y);
        }
    }
}