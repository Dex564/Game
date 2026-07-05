export class Storage {
    constructor(registry) {
        this.registry = registry;
        this.defaultCoins = 0;
        this.defaultHealth = 100;
        this.defaultMaxLevel = 1;
    }

    save() {
        const coins = this.registry.get('coins') ?? this.defaultCoins;
        const health = this.registry.get('health') ?? this.defaultHealth;
        const maxLevel = this.registry.get('maxLevel') ?? this.defaultMaxLevel;
        localStorage.setItem('coins', coins);
        localStorage.setItem('health', health);
        localStorage.setItem('maxLevel', maxLevel);
        
        for (let i = 1; i <= maxLevel; i++) {
            if (!this.registry.has(`layout-${i}`)) return;
            const layout = this.registry.get(`layout-${i}`);
            localStorage.setItem(`layout-${i}`, JSON.stringify(layout));
        }
    }
    
    load() {
        const coins = localStorage.getItem('coins') ?? this.defaultCoins;
        const health = localStorage.getItem('health') ?? this.defaultHealth;
        const maxLevel = localStorage.getItem('maxLevel') ?? this.defaultMaxLevel;
        this.registry.set('coins', Number(coins));
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