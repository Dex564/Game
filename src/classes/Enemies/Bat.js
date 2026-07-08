import { Enemy } from './Enemy.js';

export class Bat extends Enemy {
    constructor(scene, x, y) {
        super(scene, x, y, 'batEnemy');
        this.hp = 20;
        this.speed = 120;
        
        this.gettingDamaged = false;
    }

    update() {
        this.moveTowardsPlayer()
        this.updateAnims();
    }

    takeDamage(damage) {
        super.takeDamage(damage)
        if (!this.active) return;

        this.gettingDamaged = true;

        let player = this.scene.player;
        if (player && player.active) {
            const angle = Phaser.Math.Angle.Between(player.x, player.y, this.x, this.y);
            const knockbackSpeed = 350;
            this.scene.physics.velocityFromAngle(
                Phaser.Math.RadToDeg(angle),
                knockbackSpeed,
                this.body.velocity
            );
        }

        if (this.hp > 0) this.scene.time.delayedCall(100, () => this.gettingDamaged = false);
        
    }

    moveTowardsPlayer() {
        const player = this.scene.player;

        if (!player || !player.active) {
            this.setVelocity(0, 0);
            return;
        }

        const dx = Math.abs(this.x - this.scene.player.x);
        const dy = Math.abs(this.y - this.scene.player.y);

        if (dx < 300 && dy < 140) {
            if (!this.gettingDamaged) this.scene.physics.moveToObject(this, player, this.speed);            
        } else {
            if (!this.gettingDamaged) this.setVelocity(0, 0);
        }

        if (this.body.velocity.x > 0) {
            this.setFlipX(true);
        } else if (this.body.velocity.x < 0) {
            this.setFlipX(false);
        }
    }

    updateAnims() {
        if (!this.gettingDamaged) {
            if (!this.anims.isPlaying || this.anims.currentAnim?.key !== 'batIdle'){
                this.play('batIdle');
            }
        } else if (this.gettingDamaged){
            this.play('batDamaged');
        }
    }
}