import * as Const from '../const.js';
export class Storage {
    constructor(registry) {
        this.registry = registry;
    }

    saveAll() {
        this.clear();
        const coins = this.registry.get('coins') ?? Const.defaultCoins;
        const playerLevel = this.registry.get('playerLevel') ?? Const.defaultPlayerLevel;
        const xp = this.registry.get('xp') ?? Const.defaultXp;
        const health = this.registry.get('health') ?? Const.defaultHealth;
        const maxLevel = this.registry.get('maxLevel') ??  Const.defaultMaxLevel;
        localStorage.setItem('coins', coins);
        localStorage.setItem('playerLevel', playerLevel);
        localStorage.setItem('xp', xp);
        localStorage.setItem('health', health);
        localStorage.setItem('maxLevel', maxLevel);
        
        for (let i = 1; i <= maxLevel; i++) {
            if (!this.registry.has(`layout-${i}`)) return;
            const layout = this.registry.get(`layout-${i}`);
            localStorage.setItem(`layout-${i}`, JSON.stringify(layout));
        }
    }

    save(key, value) {
        this.registry.set(key, value);
        localStorage.setItem(key, value);
    }
    
    load() {
        const coins = localStorage.getItem('coins') ?? Const.defaultCoins;
        const playerLevel = localStorage.getItem('playerLevel') ?? Const.defaultPlayerLevel;
        const xp = localStorage.getItem('xp') ?? Const.defaultXp;
        const health = localStorage.getItem('health') ?? Const.defaultHealth;
        const maxLevel = localStorage.getItem('maxLevel') ??  Const.defaultMaxLevel;
        this.registry.set('coins', Number(coins));
        this.registry.set('playerLevel', Number(playerLevel));
        this.registry.set('xp', Number(xp));
        this.registry.set('health', Number(health));
        this.registry.set('maxLevel', Number(maxLevel));
        
        for (let i = 1; i <= maxLevel; i++) {
            if (!localStorage.getItem(`layout-${i}`)) return;
            const layout = localStorage.getItem(`layout-${i}`);
            this.registry.set(`layout-${i}`, JSON.parse(layout));
        }
    }

    exists() {
        return localStorage.length != 0;
    }

    clear() {
        localStorage.clear();
    }
}