export default {
    'image': {
        backgroundImage: {
            key: 'background',
            args: ['assets/bg.png']
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
        }
    },
    'spritesheet': {
        player: {
            key: 'person',
            args: ['assets/player.png', {
                frameWidth: 24,
                frameHeight: 34
            }]
        },
        dashing: {
            key: 'dash',
            args: ['assets/dashing.png', {
                frameWidth: 32,
                frameHeight: 34
            }]
        }
    }
};