export const CARDS = [
    {
        id: 'maxTenHp',
        imageKey: 'CardTenMaxHp',
        weight: 15,
        apply(player) {
            player.maxHp += 10;
            player.storage.save('maxTenHp', player.maxHp);
        }
    },
    {
        id: 'coinForChestTen',
        imageKey: 'CardTenMoney',
        weight: 15,
        apply(player) {
            player.baseCoinsIncrease += 10;
            player.storage.save('coinForChestTen', player.baseCoinsIncrease);
        }
    },
    {
        id: 'damageFive',
        imageKey: 'CardFiveDamage',
        weight: 15,
        apply(player) {
            player.baseDamageIncrease += 5;
            player.storage.save('CardFiveDamage', player.baseDamageIncrease);
        }
    },
    {
        id: 'maxFifteenHp',
        imageKey: 'CardFifteenMaxHp',
        weight: 8,
        apply(player) {
            player.maxHp += 15;
            player.storage.save('maxFifteenHp', player.maxHp);
        }
    },
    {
        id: 'coinForChestFifteen',
        imageKey: 'CardFifteenMoney',
        weight: 8,
        apply(player) {
            player.baseCoinsIncrease += 15;
            player.storage.save('coinForChestFifteen', player.baseCoinsIncrease);
        }
    },
    {
        id: 'damageTen',
        imageKey: 'CardTenDamage',
        weight: 8,
        apply(player) {
            player.baseDamageIncrease += 10;
            player.storage.save('CardTenDamage', player.baseDamageIncrease);
        }
    },
    {
        id: 'maxFiftyHp',
        imageKey: 'CardFiftyMaxHp',
        weight: 7,
        apply(player) {
            player.maxHp += 50;
            player.storage.save('maxFiftyHp', player.maxHp);
        }
    },
    {
        id: 'coinForChestFifty',
        imageKey: 'CardFiftyMoney',
        weight: 7,
        apply(player) {
            player.baseCoinsIncrease += 50;
            player.storage.save('coinForChestFifty', player.baseCoinsIncrease);
        }
    },
    {
        id: 'damageFifteen',
        imageKey: 'CardFifteenDamage',
        weight: 7,
        apply(player) {
            player.baseDamageIncrease += 15;
            player.storage.save('CardFifteenDamage', player.baseDamageIncrease);
        }
    },
    {
        id: 'maxHpMultiplier',
        imageKey: 'HpMultiplierCard',
        weight: 4,
        apply(player) {
            player.maxHp *= 2;
            player.storage.save('maxHpMultiplier', player.maxHp);
        }
    },
    {
        id: 'coinMultiplier',
        imageKey: 'CardDoubleCoins',
        weight: 3,
        apply(player) {
            player.coinMultiplier *= 2;
            player.storage.save('coinMultiplier', player.coinMultiplier);
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