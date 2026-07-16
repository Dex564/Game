import * as Phaser from 'phaser';
import * as Const from '../const.js';
import { getRandomInt } from '../utils.js';
import { Storage } from '../classes/Storage.js';
import { EventManager } from './EventManager.js';
import { LevelUpScene } from '../scenes/upgrades/LevelUp.js';

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
        this.isSliding = false;

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

        this.storage = new Storage(this.scene.registry);
        this.eventManager = EventManager.getInstance();

        // Параметры плавного движения
        this.acceleration = 2500;
        this.drag = 2000;
        this.maxSpeedGround = Const.MOVE_SPEED_GROUND;
        this.maxSpeedAir = Const.MOVE_SPEED_AIR;

        // Комбат
        this.maxHp = this.scene.registry.get('maxHp') ?? Const.defaultHealth;
        this.storage.save('maxHp', this.maxHp);
        this.hp = this.scene.registry.get('health') ?? this.maxHp;

        this.invincible = false;
        this.invincibleDuration = 450;
        this.invincibleTimer = 0;

        this.xp = this.scene.registry.get('xp') ?? Const.defaultXp;
        this.level = this.scene.registry.get('playerLevel') ?? Const.defaultPlayerLevel;

        this.coins = this.scene.registry.get('coins') ?? Const.defaultCoins;

        // Текущее оружие и его параметры
        this.currentWeapon = null;
        this.playerDamage = 0;
        this.attackWidth = 0;
        this.attackHeight = 0;
        this.attackOffsetX = 0;
        this.attackOffsetY = 0;

        // Пассивки
        this.xpModifier = 1;
        this.coinMultiplier = this.scene.registry.get('coinMultiplier') ?? 1;
        this.damageMultiplier = this.scene.registry.get('damageMultiplier') ?? 1;
        this.baseDamageIncrease = this.scene.registry.get('baseDamageIncrease') ?? 1;
        this.baseCoinsIncrease = this.scene.registry.get('baseCoinsIncrease') ?? 0;

        // Графика для отладки зоны атаки
        this.attackZoneGraphic = null;
        this.attackDebug = false;
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

        // Графика для визуализации зоны атаки
        this.attackZoneGraphic = this.scene.add.graphics();
        this.attackZoneGraphic.setDepth(200);
        this.attackDebug = this.scene.physics.config.debug;

        this.setWeapon(Const.DEFAULT_WEAPON);

        return this.player;
    }

    /* ----------------------------------------------------------------
       СМЕНА ОРУЖИЯ
    ---------------------------------------------------------------- */
    setWeapon(weaponName) {
        const cfg = Const.WEAPONS[weaponName];
        if (!cfg) {
            console.log(`Оружие "${weaponName}" не найдено в Const.WEAPONS`);
            return;
        }
        this.currentWeapon = weaponName;
        this.attackWidth = cfg.width;
        this.attackHeight = cfg.height;
        this.attackOffsetX = cfg.offsetX;
        this.attackOffsetY = cfg.offsetY;
        this.playerDamage = cfg.damage;
        // смена спрайта оружия, звуков и т.д.
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
        this.drawAttackZone();
    }

    // --- СОСТОЯНИЕ ПАДЕНИЯ --- //
    updateFallState() {
        const onGround = this.player.body.blocked.down;
        this.isFalling = !onGround && this.player.body.velocity.y > 0;
    }

    // --- ДВИЖЕНИЕ ВЛЕВО/ВПРАВО И ПРЫЖОК --- //
    handleMovement() {
        if (this.isDashing || !this.canControl) return;

        const left = this.keys.left.isDown;
        const right = this.keys.right.isDown;
        const jump = this.jumpKey1.isDown || this.jumpKey2.isDown;
        const onGround = this.player.body.onFloor();

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
                this.scene.time.delayedCall(500, () => { this.walkSound = false; });
            }
        } else {
            if (Math.abs(this.player.body.velocity.x) < drag) {
                this.player.setVelocityX(0);
            } else {
                const newVx = this.player.body.velocity.x - Math.sign(this.player.body.velocity.x) * drag;
                this.player.setVelocityX(newVx);
            }
        }

        if (jump && (onGround || this.coyoteTimer > 0)) {
            if (!this.jumpSound) {
                this.jumpSound = true;
                this.scene.sound.play(`jump${getRandomInt(1, 2)}`, { volume: 0.8 });
                this.scene.time.delayedCall(500, () => { this.jumpSound = false; });
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
                this.scene.sound.play(`jump${getRandomInt(1, 2)}`, { volume: 0.8 });
                this.performWallJump('right');
            } else if (touchingRight && this.wallJumpLeft) {
                this.scene.sound.play(`jump${getRandomInt(1, 2)}`, { volume: 0.8 });
                this.performWallJump('left');
            }
        }

        const moveIntoWall = (touchingLeft && this.keys.left.isDown) ||
                             (touchingRight && this.keys.right.isDown);
        if (moveIntoWall && !wantJump) {
            this.player.body.allowGravity = false;
            this.player.setVelocityY(Const.WALL_SLIDE_SPEED);
            this.isSliding = true;
            // анимация wallslide на будущее
        } else {
            this.player.body.allowGravity = true;
            this.isSliding = false;
        }
    }

    // --- ОТСКОК ОТ СТЕНЫ --- //
    performWallJump(side) {
        const isRight = side === 'right';
        let speed = Const.MOVE_SPEED_AIR - 100;
        const wallJumpSpeed = isRight ? speed : -speed;

        this.player.x += isRight ? 6 : -6;
        this.player.setVelocityX(wallJumpSpeed);
        this.player.setVelocityY(Const.JUMP_SPEED - 200);
        this.player.setFlipX(!isRight);

        this.canControl = false;
        if (isRight) this.wallJumpRight = false;
        else this.wallJumpLeft = false;

        this.scene.time.delayedCall(300, () => { this.canControl = true; });
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
        if (dashDir === 0) return;

        this.player.setFlipX(dashDir === -1);
        this.invincible = true;
        this.player.setVelocityX(dashDir * Const.DASH_SPEED);
        this.canDash = false;
        this.isDashing = true;

        this.scene.sound.play(`dash${getRandomInt(1, 2)}`, { volume: 0.3 });

        this.scene.time.delayedCall(Const.DASH_DURATION, () => { this.isDashing = false; });
        this.scene.time.delayedCall(Const.DASH_COOLDOWN, () => { this.canDash = true; });
        this.scene.time.delayedCall(Const.DASH_COOLDOWN, () => { this.invincible = false; });
    }

    // --- ВРЕМЯ КОЙОТА --- //
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
            this.scene.sound.play(`swing`, { volume: 0.5 });
            this.performAttack();

            this.scene.time.delayedCall(Const.ATTACK_DURATION, () => {
                this.isAttacking = false;
                this.canControl = true;
                this.canDash = true;
            });
        }
    }

    performAttack() {
        if (!this.scene.enemies || !Array.isArray(this.scene.enemies)) return;

        const effectiveDamage = (this.playerDamage + this.baseDamageIncrease) * this.damageMultiplier;
        const dir = this.player.flipX ? -1 : 1;
        let zoneLeft, zoneRight;
        if (dir === 1) {
            zoneLeft = this.player.x + this.attackOffsetX;
            zoneRight = zoneLeft + this.attackWidth;
        } else {
            zoneRight = this.player.x - this.attackOffsetX;
            zoneLeft = zoneRight - this.attackWidth;
        }
        const zoneCenterY = this.player.y + this.attackOffsetY;
        const zoneTop = zoneCenterY - this.attackHeight;
        const zoneBottom = zoneCenterY + this.attackHeight;

        for (let enemyData of this.scene.enemies) {
            const enemy = enemyData.hitbox;
            if (!enemy || !enemy.active) continue;

            const bounds = enemy.getBounds();
            const enemyLeft = bounds.x;
            const enemyRight = bounds.x + bounds.width;
            const enemyTop = bounds.y;
            const enemyBottom = bounds.y + bounds.height;

            if (zoneLeft < enemyRight && zoneRight > enemyLeft &&
                zoneTop < enemyBottom && zoneBottom > enemyTop) {
                this.scene.sound.play(`hit${getRandomInt(1, 2)}`, { volume: 0.5 });
                enemy.takeDamage(effectiveDamage);
                if (enemy.justDied) {
                    this.xp += enemy.xp * this.xpModifier;
                    this.storage.save('xp', this.xp)
                    this.calculatePlayerLevel();
                }
            }
        }
    }

    // --- УРОВЕНЬ ИГРОКА --- //
    calculatePlayerLevel() {
        const xpNeeded = this.level * 10 + 100;
        if (this.xp >= xpNeeded) {
            this.level += 1;
            this.xp -= xpNeeded;
            this.levelUp();
        }
    }

    levelUp() {
        console.log(`Level up! Level: ${this.level}, XP: ${this.xp}`);
        this.storage.save('xp', this.xp);
        this.storage.save('playerLevel', this.level);

        const mainScene = this.scene;
        mainScene.scene.pause();
        this.canControl = false;
        this.canDash = false;
        this.invincible = true;

        mainScene.scene.launch('LevelUp', { player: this, parentScene: this.scene.sys.settings.key });
    }
    
    // --- ПОЛУЧЕНИЕ УРОНА --- //
    takeDamage(damage, source) {
        if (this.invincible || !this.player.active) return;

        this.hp -= damage;
        this.invincible = true;

        this.eventManager.emit('playerAttacked');
        this.scene.sound.play(`hit${getRandomInt(1, 2)}`, { volume: 0.5 });

        if (source) {
            const angle = Phaser.Math.Angle.Between(source.x, source.y, this.player.x, this.player.y);
            const knockbackSpeed = source.knockbackSpeed;
            this.player.setVelocity(
                Math.cos(angle) * knockbackSpeed,
                -200
            );
        }

        console.log(`Player HP: ${this.hp}`);
        this.storage.save('health', this.hp);

        this.scene.time.delayedCall(this.invincibleDuration, () => {
            this.invincible = false;
        });

        if (this.hp <= 0) {
            console.log('Player died');
            this.eventManager.emit('playerDead');
        }
    }

    // --- АНИМАЦИИ --- //
    updateAnimation() {
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
        } else {
            this.player.setOffset(12, 2);
        }

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
                    this.scene.time.delayedCall(100, () => { this.isRunning = true; });
                } else {
                    this.player.play('run', true);
                }
            }
        } else {
            this.isRunning = false;
            if (this.player.body.velocity.y > 0) {
                if (!this.isSliding) {
                    this.player.play('fall', true);
                } else {
                    this.player.play('run', true);
                }
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

    // --- ДЕБАГ МЕТОДЫ --- //

    // --- ОТРИСОВКА ЗОНЫ АТАКИ  --- //
    drawAttackZone() {
        if (!this.attackZoneGraphic || !this.attackDebug) {
            if (this.attackZoneGraphic) this.attackZoneGraphic.clear();
            return;
        }

        const dir = this.player.flipX ? -1 : 1;
        const w = this.attackWidth;
        const fullH = this.attackHeight * 2;
        const zoneCenterY = this.player.y + this.attackOffsetY;

        let rectX;
        if (dir === 1) {
            rectX = this.player.x + this.attackOffsetX;
        } else {
            rectX = this.player.x - this.attackOffsetX - w;
        }
        const rectY = zoneCenterY - fullH / 2;

        this.attackZoneGraphic.clear();
        this.attackZoneGraphic.fillStyle(0xff0000, 0.2);
        this.attackZoneGraphic.fillRect(rectX, rectY, w, fullH);
        this.attackZoneGraphic.lineStyle(2, 0xff0000, 0.8);
        this.attackZoneGraphic.strokeRect(rectX, rectY, w, fullH);
    }
}