export const CARDS = [
    {
        id: 'maxHp',
        imageKey: 'CardTenMaxHp',
        weight: 100,
        apply(player) {
            player.maxHp += 10;
            player.storage.save('maxHp', player.maxHp);
        }
    },
    {
        id: 'coinMultiplier',
        imageKey: 'CardDoubleCoins',
        weight: 100,
        apply(player) {
            player.coinMultiplier *= 2;
            player.storage.save('coinMultiplier', player.coinMultiplier);
        }
    },
    {
        id: 'damageMultiplier',
        imageKey: 'CardDoubleDamage',
        weight: 100,
        apply(player) {
            player.damageMultiplier *= 2;
            player.storage.save('damageMultiplier', player.damageMultiplier);
        }
    }
];