import Phaser from 'phaser';

export class Enemy extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture);
        scene.add.existing(this); // крайне важно
        this.scene = scene;
        this.setOrigin(0.5, 1);
        scene.physics.add.existing(this);
        this.setCollideWorldBounds(true);
        this.setBounce(0.1);
        this.setDepth(105);
        this.hp = 1;
        this.justDied = false;
        this.xp = 0;
        this.knockbackSpeed = 0;
    }

    // Общий метод получения урона – может быть переопределён в наследниках
    takeDamage(damage) {
        if (!this.active || !this.scene) return;
        this.hp -= damage;
        console.log(`${this.constructor.name} HP:`, this.hp);
        if (this.hp <= 0) {
            this.justDied = true;
            this.scene.time.delayedCall(100, () => this.justDied = false);
            this.destroy();
        }
    }

    // Метод для удаления врага из массива сцены
    destroy() {
        if (this.scene && this.scene.enemiesGroup) {
            this.scene.enemiesGroup.remove(this);
        }

        if (this.scene && this.scene.enemies) {
            const index = this.scene.enemies.findIndex(e => e.hitbox === this);
            if (index !== -1) {
                this.scene.enemies.splice(index, 1);
            }
        }
        this.active = false;
        super.destroy();
    }

    update() {
        // переопределяется в наследниках
    }
}