import { Enemy } from './Enemy.js';

export class Bat extends Enemy {
    constructor(scene, x, y) {
        super(scene, x, y, 'batEnemy');
        this.hp = 20;
        // this.speed = 50;
        
        this.gettingDamaged = false;
    }

    update() {
        this.updateAnims();
        // логика движения
    }

    takeDamage(damage) {
        super.takeDamage(damage)
        this.gettingDamaged = true;
        if (this.hp > 0) this.scene.time.delayedCall(100, () => this.gettingDamaged = false);
        
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