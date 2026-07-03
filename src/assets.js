export default {
    'image': {
        backgroundImage: {
            key: 'background',
            args: ['assets/bg.png'] // args: ['assets/bg.png']
        },
        button: {
            key: 'button',
            args: ['assets/button.png']
        },
        platform: {
            key: 'ground',
            args: ['assets/ground.png']
        },
        logo: {
            key: 'logo',
            args: ['assets/logo.png']
        },
        menubg : {
            key: 'menubg',
            args: ['assets/menu.png']
        },
        platform_horisontal: {
            key: 'platform_horisontal',
            args: ['assets/platform_horisontal.png']
        },
        platform_vertical: {
            key: 'platform_vertical',
            args: ['assets/platform_vertical.png']
        },
        cave_entry: {
            key: 'cave_entry',
            args: ['assets/Temple1.png']
        },
        tile: {
            key: 'tile',
            args: ['assets/tile.png']
        },
        bgcave: {
            key: 'bgcave',
            args: ['assets/bgcave.png']
        }
    },
    'spritesheet': {
        player: {
            key: 'person',
            args: ['assets/Hero1.png', {
                frameWidth: 45,
                frameHeight: 64
            }]
        },
        playerDash: {
            key: 'dash',
            args: ['assets/dashing.png', {
                frameWidth: 32,
                frameHeight: 34
            }]
        },
        playerAttack: {
            key: 'attack',
            args: ['assets/Hero1Attack.png', {
                frameWidth: 50,
                frameHeight: 72
            }]
        }
    }
};