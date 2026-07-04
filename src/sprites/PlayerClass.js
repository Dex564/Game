import * as Phaser from 'phaser';
import * as Const from '../const.js';

export class PlayerClass {
    constructor(scene, worldX = Const.WIDTH, worldY = Const.HEIGHT) {
        this.scene = scene;
        this.worldX = worldX;
        this.worldY = worldY;
        this.player = null;
        this.keys = {};
        
        // Состояния
        this.canDash = true;
        this.isDashing = false;

        this.attackButtonPressed = false;
        this.isAttacking = false;

        this.canControl = true;

        this.wallJumpRight = true;
        this.wallJumpLeft = true;

        this.isRunning = false;

        this.coyoteTimer = 0;
        this.coyoteDuration = Const.COYOTE_DURATION;
        this.lastTime = 0;
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
        this.jumpKey2 = this.keys.up; // дублируем для читаемости
        this.shiftKey = keyboard.addKey('SHIFT');
    }

   /* ----------------------------------------------------------------
       КАМЕРА
    ---------------------------------------------------------------- */
    createCamera() {
        const camera = this.scene.cameras.add(0, 0, Const.WIDTH, Const.HEIGHT, true);
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
        this.updateAnimation();
    }

    // --- СОСТОЯНИЕ ПАДЕНИЯ --- //
    updateFallState() {
        const onGround = this.player.body.onFloor();
        this.isFalling = !onGround && this.player.body.velocity.y > 0;
    }

    // --- ДВИЖЕНИЕ ВЛЕВО/ВПРАВО И ПРЫЖОК --- //
    handleMovement() {
        if (this.isDashing || !this.canControl) return;

        const left = this.keys.left.isDown;
        const right = this.keys.right.isDown;
        const jump = this.jumpKey1.isDown || this.jumpKey2.isDown;
        const onGround = this.player.body.onFloor();

        // Горизонтальное движение
        if (left && !right) {
            const speed = onGround ? 400 : 500;
            this.player.setVelocityX(-speed);
            this.player.setFlipX(true);
        } else if (right && !left) {
            const speed = onGround ? 400 : 500;
            this.player.setVelocityX(speed);
            this.player.setFlipX(false);
        } else {
            this.player.setVelocityX(0);
        }

        if (jump && (onGround || this.coyoteTimer > 0)) {
            this.player.setVelocityY(-500);
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

        // Отскок от стены
        if (wantJump) {
            if (touchingLeft && this.wallJumpRight) {
                this.performWallJump('right');
            } else if (touchingRight && this.wallJumpLeft) {
                this.performWallJump('left');
            }
        }

        // Скольжение по стене 
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

        this.player.x += isRight ? 6 : -6;
        this.player.setVelocityX(isRight ? 300 : -300);
        this.player.setVelocityY(-600);
        this.player.setFlipX(!isRight);

        this.canControl = false;
        if (isRight) this.wallJumpRight = false;
        else this.wallJumpLeft = false;

        this.scene.time.delayedCall(500, () => {
            this.player.setVelocityX(0);
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
                          !this.isAttacking && this.canControl;

        const dashKeyPressed = Phaser.Input.Keyboard.JustDown(this.keys.dash) ||
                               Phaser.Input.Keyboard.JustDown(this.shiftKey);

        if (!dashKeyPressed || !canDoDash) return;

        let dashDir = 0;
        if (this.keys.right.isDown && !this.keys.left.isDown) dashDir = 1;
        else if (this.keys.left.isDown && !this.keys.right.isDown) dashDir = -1;

        if (dashDir === 0) return;

        this.player.setVelocityX(dashDir * Const.DASH_SPEED);
        this.canDash = false;
        this.isDashing = true;

        this.scene.time.delayedCall(Const.DASH_DURATION, () => {
            this.isDashing = false;
            this.player.setVelocityX(0);
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
                this.player.play('spearAttack', true);
            }
            return;
        }

        const onGround = this.player.body.blocked.down || this.player.body.touching.down;

        if (onGround) {
            const standing = (!this.keys.left.isDown && !this.keys.right.isDown) ||
                             (this.keys.left.isDown && this.keys.right.isDown);
            if (standing) {
                this.isRunning = false;
                this.player.setSize(25, 62);
                this.player.play('idle', true);
            } else {
                // Начало бега или сам бег
                this.player.setSize(25, 62);
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
            // В воздухе
            this.isRunning = false;
            this.player.setSize(27, 62);
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