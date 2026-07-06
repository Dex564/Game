export default {
    'audio': {
        step: {
            files: ['step1', 'step2', 'step3', 'step4', 'step5'],
            path: 'assets/sounds/',
            format: 'ogg'
        },
        jump: {
            files: ['jump1', 'jump2'],
            path: 'assets/sounds/',
            format: 'ogg'
        },
        wallslide: {
            files: ['wallslide'],
            path: 'assets/sounds/',
            format: 'ogg'
        },
        hit: {
            files: ['hit1', 'hit2'],
            path: 'assets/sounds/',
            format: 'ogg'
        },
        chest: {
            files: ['chest'],
            path: 'assets/sounds/',
            format: 'ogg'
        },
        coin: {
            files: ['coins1', 'coins2', 'coins3', 'coins4', 'coins5', 'coins6'],
            path: 'assets/sounds/',
            format: 'ogg'
        },
        altar: {
            files: ['altar'],
            path: 'assets/sounds/',
            format: 'ogg'
        },
        hit: {
            files: ['hit1', 'hit2'],
            path: 'assets/sounds/',
            format: 'ogg'
        },
        land: {
            files: ['land'],
            path: 'assets/sounds/',
            format: 'ogg'
        },
        dash: {
            files: ['dash1', 'dash2'],
            path: 'assets/sounds/',
            format: 'ogg'
        }
    },
    'image': {
        background: {
            key: 'background',
            args: ['assets/bg.png']
        },
        start_button: {
            key: 'start_button',
            args: ['assets/start_button.png']
        },
        lobby_button: {
            key: 'lobby_button',
            args: ['assets/lobby_button.png']
        },
        continue_button: {
            key: 'continue_button',
            args: ['assets/continue_button.png']
        },
        reset_button: {
            key: 'reset_button',
            args: ['assets/reset_button.png']
        },
        confirm_button: {
            key: 'confirm_button',
            args: ['assets/confirm_button.png']
        },
        menu_button: {
            key: 'menu_button',
            args: ['assets/menu_button.png']
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