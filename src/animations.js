export function createPlayerAnimations(anims) {
    anims.create({
        key: 'idle',
        frames: anims.generateFrameNumbers('person', { start: 0, end: 0 }),
        frameRate: 11,
        repeat: -1
    });

    anims.create({
        key: 'startrun',
        texture: 'person',
        frames: anims.generateFrameNumbers('person', {start: 1, end: 2}),
        frameRate: 2,
        duration: 1000
    });

    anims.create({
        key: 'run',
        texture: 'person',
        frames: anims.generateFrameNumbers('person', { frames: [2, 3, 4, 5] }),
        frameRate: 3,
        repeat: -1
    });

    anims.create({
        key: 'jump',
        texture: 'person',
        frames: anims.generateFrameNumbers('person', {start: 6, end: 6}),
        frameRate: 1,
        repeat: -1
    });

    anims.create({
        key: 'fall',
        texture: 'person',
        frames: anims.generateFrameNumbers('person', {start: 7, end: 7}),
        frameRate: 1,
        repeat: -1
    });

    anims.create({
        key: 'dash',
        frames: anims.generateFrameNumbers('person', [6]), // [1, 0, 2] - порядок анимации
        frameRate: 24,
        repeat: -1
    });

    anims.create({
        key: 'spearAttack',
        frames: anims.generateFrameNumbers('spearAttack', {start: 0, end: 2}),
        frameRate: 15,
        // duration: 200,
        repeat: -1
    });
}

export function createBatAnimations(anims) {
    anims.create({
        key: 'batIdle',
        frames: anims.generateFrameNumbers('batEnemy', {start: 0, end: 12}),
        frameRate: 6,
        repeat: -1
    });

    anims.create({
        key: 'batDamaged',
        frames: anims.generateFrameNumbers('batEnemy', {start: 13, end: 15}),
        frameRate: 6,
        repeat: -1
    })
}