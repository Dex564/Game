export const CARDS = [
    {
        id: 'maxTenHp',
        imageKey: 'CardTenMaxHp',
        weight: 15,
        apply(player) {
            player.maxHp += 10;
            player.storage.save('maxHp', player.maxHp);
        }
    },
    {
        id: 'coinForChestTen',
        imageKey: 'CardTenMoney',
        weight: 15,
        apply(player) {
            // player.baseCoinsIncrease += 10;
            player.storage.save('coins', player.storage.get('coins')+=10);
        }
    },
    {
        id: 'damageFive',
        imageKey: 'CardFiveDamage',
        weight: 15,
        apply(player) {
            player.baseDamageIncrease += 5;
            player.storage.save('baseDamageIncrease', player.baseDamageIncrease);
        }
    },
    {
        id: 'maxFifteenHp',
        imageKey: 'CardFifteenMaxHp',
        weight: 8,
        apply(player) {
            player.maxHp += 15;
            player.storage.save('maxHp', player.maxHp);
        }
    },
    {
        id: 'coinForChestFifteen',
        imageKey: 'CardFifteenMoney',
        weight: 8,
        apply(player) {
            // player.baseCoinsIncrease += 15;
            player.storage.save('coins', player.storage.get('coins')+15);
        }
    },
    {
        id: 'damageTen',
        imageKey: 'CardTenDamage',
        weight: 8,
        apply(player) {
            player.baseDamageIncrease += 10;
            player.storage.save('baseDamageIncrease', player.baseDamageIncrease);
        }
    },
    {
        id: 'maxFiftyHp',
        imageKey: 'CardFiftyMaxHp',
        weight: 7,
        apply(player) {
            player.maxHp += 50;
            player.storage.save('maxHp', player.maxHp);
        }
    },
    {
        id: 'coinForChestFifty',
        imageKey: 'CardFiftyMoney',
        weight: 7,
        apply(player) {
            // player.baseCoinsIncrease += 50;
           player.storage.save('coins', player.storage.get('coins')+50);
        }
    },
    {
        id: 'damageFifteen',
        imageKey: 'CardFifteenDamage',
        weight: 7,
        apply(player) {
            player.baseDamageIncrease += 15;
            player.storage.save('baseDamageIncrease', player.baseDamageIncrease);
        }
    },
    {
        id: 'maxHpMultiplier',
        imageKey: 'HPMultiplierCard',
        weight: 4,
        apply(player) {
            player.maxHp *= 2;
            player.storage.save('maxHp', player.maxHp);
        }
    },
    {
        id: 'coinMultiplier',
        imageKey: 'CardDoubleCoins',
        weight: 3,
        apply(player) {
            // player.coinMultiplier *= 2;
            player.storage.save('coins', player.storage.get('coins')*2);
        }
    },
    {
        id: 'damageMultiplier',
        imageKey: 'CardDoubleDamage',
        weight: 3,
        apply(player) {
            player.damageMultiplier *= 2;
            player.storage.save('damageMultiplier', player.damageMultiplier);
        }
    }
];