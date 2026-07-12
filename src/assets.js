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
            args: ['assets/Back_ocean.jpg']
        },
        bgcave: {
            key: 'bgcave',
            args: ['assets/bgcave.png']
        },
        bg_inside: {
            key: 'bg_inside',
            args: ['assets/bg_inside.png']
        },
        mud_ground: {
            key: 'mud_ground',
            args: ['assets/mud_ground.png']
        },
        stone_ground: {
            key: 'stone_ground',
            args: ['assets/stone_ground.png']
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
        entry_leave: {
            key: 'entry_leave',
            args: ['assets/entry_leave.png']
        },
        entry_cave: {
            key: 'entry_cave',
            args: ['assets/entry_cave.png']
        },
        chest: {
            key: 'chest',
            args: ['assets/Chest1.png']
        },
        chest_opened: {
            key: 'chest_opened',
            args: ['assets/Opend_chest1.png']
        },
        skeleton: {
            key: 'skeleton',
            args: ['assets/skeleton.png']
        },
        altar: {
            key: 'altar',
            args: ['assets/altar.png']
        },
        shop: {
            key: 'shop',
            args: ['assets/shop.png']
        }
    },
    'spritesheet': {
        player: {
            key: 'person',
            args: ['assets/sprites/Hero1.png', {
                frameWidth: 45,
                frameHeight: 64
            }]
        },
        heroSpearAttack: {
            key: 'spearAttack',
            args: ['assets/sprites/HeroSpearAttack.png', {
                frameWidth: 158,
                frameHeight: 64
            }]
        },
        batEnemy: {
            key: 'batEnemy',
            args: ['assets/sprites/Enemies/Bat.png', {
                frameWidth: 51,
                frameHeight: 45
            }]
        }
    }
};