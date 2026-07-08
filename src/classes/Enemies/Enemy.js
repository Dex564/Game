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
    }

    // Общий метод получения урона – может быть переопределён в наследниках
    takeDamage(damage) {
        this.hp -= damage;
        console.log(`${this.constructor.name} HP:`, this.hp);
        if (this.hp <= 0) {
            this.destroy();
        }
    }

    // Метод для удаления врага из массива сцены
    destroy() {
        const index = this.scene.enemies.findIndex(e => e.hitbox === this);
        if (index !== -1) {
            this.scene.enemies.splice(index, 1);
        }
        super.destroy();
    }

    update() {
        // переопределяется в наследниках
    }
}