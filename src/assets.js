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
        main_temple: {
            key: 'mainTemple',
            args: ['assets/Temple1.png']
        },
        tile: {
            key: 'tile',
            args: ['assets/tile.png']
        },
        bgcave: {
            key: 'bgcave',
            args: ['assets/bgcave.png']
        },
        entry_leave: {
            key: 'entry_leave',
            args: ['assets/entry_leave.png']
        },
        chest: {
            key: 'chest',
            args: ['assets/chest.png']
        },
        chest_opened: {
            key: 'chest_opened',
            args: ['assets/chest_opened.png']
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
        hero_spear_attack: {
            key: 'spearAttack',
            args: ['assets/HeroSpearAttack.png', {
                frameWidth: 158,
                frameHeight: 64
            }]
        }
    }
};