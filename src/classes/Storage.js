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
        const maxHp = this.registry.get('maxHp') ?? Const.defaultHealth;
        const coinMultiplier = this.registry.get('coinMultiplier') ?? 1;
        const damageMultiplier = this.registry.get('damageMultiplier') ?? 1;
        const baseDamageIncrease = this.registry.get('baseDamageIncrease') ?? 0;
        const baseCoinsIncrease = this.registry.get('baseCoinsIncrease') ?? 0;
        
        localStorage.setItem('coins', coins);
        localStorage.setItem('playerLevel', playerLevel);
        localStorage.setItem('xp', xp);
        localStorage.setItem('health', health);
        localStorage.setItem('maxLevel', maxLevel);
        localStorage.setItem('maxHp', maxHp);
        localStorage.setItem('coinMultiplier', coinMultiplier);
        localStorage.setItem('damageMultiplier', damageMultiplier);
        localStorage.setItem('baseDamageIncrease', baseDamageIncrease);
        localStorage.setItem('baseCoinsIncrease', baseCoinsIncrease);
        
        for (let i = 1; i <= maxLevel; i++) {
            if (!this.registry.has(`layout-${i}`)) return;
            const layout = this.registry.get(`layout-${i}`);
            localStorage.setItem(`layout-${i}`, JSON.stringify(layout));
        }
    }

    save(key, value) {
        this.registry.set(key, value);
        localStorage.setItem(key, JSON.stringify(value));
    }
    
    load() {
        const coins = localStorage.getItem('coins') ?? Const.defaultCoins;
        const playerLevel = localStorage.getItem('playerLevel') ?? Const.defaultPlayerLevel;
        const xp = localStorage.getItem('xp') ?? Const.defaultXp;
        const health = localStorage.getItem('health') ?? Const.defaultHealth;
        const maxLevel = localStorage.getItem('maxLevel') ??  Const.defaultMaxLevel;
        const maxHp = localStorage.getItem('maxHp') ?? Const.defaultHealth;
        const coinMultiplier = localStorage.getItem('coinMultiplier') ?? 1;
        const damageMultiplier = localStorage.getItem('damageMultiplier') ?? 1;
        const baseDamageIncrease = localStorage.getItem('baseDamageIncrease') ?? 0;
        const baseCoinsIncrease = localStorage.getItem('baseCoinsIncrease') ?? 0;

        this.registry.set('coins', Number(coins));
        this.registry.set('playerLevel', Number(playerLevel));
        this.registry.set('xp', Number(xp));
        this.registry.set('health', Number(health));
        this.registry.set('maxLevel', Number(maxLevel));
        this.registry.set('maxHp', Number(maxHp));
        this.registry.set('coinMultiplier', Number(coinMultiplier));
        this.registry.set('damageMultiplier', Number(damageMultiplier));
        this.registry.set('baseDamageIncrease', Number(baseDamageIncrease));
        this.registry.set('baseCoinsIncrease', Number(baseCoinsIncrease));
        
        for (let i = 1; i <= maxLevel; i++) {
            const layout = localStorage.getItem(`layout-${i}`);
            if (layout) {
                this.registry.set(`layout-${i}`, JSON.parse(layout));
            }
        }
    }

    inc(key, amount) {
        const current = this.registry.get(key) ?? 0;
        const newValue = current + amount;
        this.save(key, newValue);
    }

    exists() {
        return localStorage.length != 0;
    }

    clear() {
        localStorage.clear();
    }
}