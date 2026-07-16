import { Enemy } from './Enemy.js';

export class Bat extends Enemy {
    constructor(scene, x, y) {
        super(scene, x, y, 'batEnemy');
        this.hp = 20;
        this.xp = 30;
        this.speed = 120;
        
        this.gettingDamaged = false;
        this.damage = 5;
        this.knockbackSpeed = 650;

        this.wanderDirection = Phaser.Math.Between(0, 1) ? 1 : -1;
        this.nextWanderChange = 0
    }

    update() {
        this.wander();
        this.updateAnims();
    }

    takeDamage(damage) {
        super.takeDamage(damage);
        if (!this.active) return;

        this.gettingDamaged = true;

        let player = this.scene.player;
        if (player && player.active) {
            const angle = Phaser.Math.Angle.Between(player.x, player.y, this.x, this.y);
            const knockbackSpeed = 650;
            this.scene.physics.velocityFromAngle(
                Phaser.Math.RadToDeg(angle),
                knockbackSpeed,
                this.body.velocity
            );
        }

        if (this.hp > 0) {
            this.scene.time.delayedCall(100, () => {
                this.gettingDamaged = false;
            });
        }
    }

    wander() {
        if (this.gettingDamaged) return;

        const player = this.scene.player;
        if (player && player.active) {
            const dist = Phaser.Math.Distance.Between(this.x, this.y, player.x, player.y);
            if (dist < 200) {
                if (dist < 30) {
                    this.setVelocity(0, 0);
                } else {
                    this.scene.physics.moveToObject(this, player, this.speed);
                }
                return;
            }
        }

        const now = this.scene.time.now;

        if (now >= this.nextWanderChange) {
            if (Phaser.Math.Between(0, 1)) {
                this.setVelocityX(0);
                this.nextWanderChange = now + Phaser.Math.Between(500, 2000);
            } else {
                this.wanderDirection = Phaser.Math.Between(0, 1) ? 1 : -1;
                this.setVelocityX(this.speed * this.wanderDirection);
                this.nextWanderChange = now + Phaser.Math.Between(1000, 3000);
            }
            return;
        }

        if (Math.abs(this.body.velocity.x) > 0 && this.isAtEdge()) {
            this.wanderDirection *= -1;
            this.setVelocityX(this.speed * this.wanderDirection);
            this.nextWanderChange = now + Phaser.Math.Between(1000, 2000);
        }
    }

    isAtEdge() {
        const layer = this.scene.layer;
        if (!layer) return false;

        const dir = this.wanderDirection;
        const checkX = this.x + (this.body.halfWidth + 10) * dir;
        const checkY = this.y + this.body.halfHeight + 5;

        const tile = layer.getTileAtWorldXY(checkX, checkY);
        return !tile;
    }

    updateAnims() {
        if (!this.gettingDamaged) {
            if (!this.anims.isPlaying || this.anims.currentAnim?.key !== 'batIdle'){
                this.play('batIdle');
            }
        } else if (this.gettingDamaged){
            this.play('batDamaged');
        }

        if (this.body.velocity.x > 0) {
            this.setFlipX(true);
        } else if (this.body.velocity.x < 0) {
            this.setFlipX(false);
        }
    }
}