export function createPlayerAnimations(anims) {
    anims.create({
        key: 'idle',
        frames: anims.generateFrameNumbers('person', { start: 0, end: 0 }),
        frameRate: 1,
        repeat: -1
    });

    anims.create({
        key: 'startrun',
        texture: 'person',
        frames: anims.generateFrameNumbers('person', {start: 1, end: 1}),
        frameRate: 12,
        duration: 1000
    });

    anims.create({
        key: 'run',
        texture: 'person',
        frames: anims.generateFrameNumbers('person', { frames: [ 2, 3, 2 ] }),
        frameRate: 12,
        repeat: -1
    });

    anims.create({
        key: 'jump',
        texture: 'person',
        frames: anims.generateFrameNumbers('person', {start: 4, end: 5}),
        frameRate: 1,
        repeat: -1
    });

    anims.create({
        key: 'dash',
        frames: anims.generateFrameNumbers('person', { frames: [ 2 ] }), // [1, 0, 2] - порядок анимации
        frameRate: 24,
        repeat: -1
    });

    // amims.create({
    //     key: 'attack',

    // })
}