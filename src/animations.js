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
<<<<<<< Updated upstream
        frames: anims.generateFrameNumbers('person', {start: 1, end:3}),
        frameRate: 12,
=======
        frames: anims.generateFrameNumbers('person', {start: 1, end: 2}),
        frameRate: 2,
>>>>>>> Stashed changes
        duration: 1000
    });

    anims.create({
        key: 'run',
        texture: 'person',
<<<<<<< Updated upstream
        frames: anims.generateFrameNumbers('person', [1, 2, 3, 4]),
        frameRate: 12,
=======
        frames: anims.generateFrameNumbers('person', { frames: [1, 2, 3, 4, 5, 4, 3, 2, 1] }),
        frameRate: 3,
>>>>>>> Stashed changes
        repeat: -1
    });

    anims.create({
        key: 'jump',
        texture: 'person',
        frames: anims.generateFrameNumbers('person', {start: 6, end: 7}),
        frameRate: 0.6,
        repeat: -1
    });

    anims.create({
        key: 'dash',
        frames: anims.generateFrameNumbers('dash', [1, 0, 2]), // [1, 0, 2] - порядок анимации
        frameRate: 24,
        repeat: -1
    });

    anims.create({
        key: 'attack',
        frames: anims.generateFrameNumbers('person', { frames: [ 9, ] }),
        frameRate: 24,
        repeat: -1
    })
}