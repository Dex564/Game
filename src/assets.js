export default {
    'image': {
        backgroundImage: {
            key: 'background',
            args: ['assets/background.png']
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
        }
    },
    'spritesheet': {
        player: {
            key: 'person',
            args: ['assets/Hero1.png', {
                frameWidth: 41,
                frameHeight: 64
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