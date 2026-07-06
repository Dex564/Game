export const WIDTH = 1920;
export const HEIGHT = 1080;

export const ATTACK_DURATION = 200; 
export const COYOTE_DURATION = 200;

export const JUMP_SPEED = -500;
export const MOVE_SPEED_GROUND = 400;
export const MOVE_SPEED_AIR = 500;
export const DASH_SPEED = 1200;
export const DASH_COOLDOWN = 350;
export const DASH_DURATION = 1;
export const WALL_SLIDE_SPEED = 50; 
export const GRAVITY = 1800;

export const hintStyle = {
    fontSize: '20px',
    fontFamily: 'Arial',
    color: '#ffffff',
    backgroundColor: '#000000',
    padding: { left: 8, right: 8, top: 4, bottom: 4 }
};

export const chunks = [
    [
        [0, 0, 0, 0],
        [0, -1, -1, -1],
        [0, -1, -1, -1],
        [0, -1, -1, 0],
    ],
    [
        [0, 0, 0, 0],
        [-1, -1, -1, 0],
        [-1, -1, -1, 0],
        [0, -1, -1, 0],
    ],
    [
        [0, -1, -1, 0],
        [0, -1, -1, -1],
        [0, -1, -1, -1],
        [0, 0, 0, 0],
    ],
    [
        [0, -1, -1, 0],
        [-1, -1, -1, 0],
        [-1, -1, -1, 0],
        [0, 0, 0, 0],
    ],
    [
        [0, -1, -1, 0],
        [0, -1, -1, 0],
        [0, -1, -1, 0],
        [0, -1, -1, 0],
    ],
    [
        [0, 0, 0, 0],
        [-1, -1, -1, -1],
        [-1, -1, -1, -1],
        [0, 0, 0, 0],
    ],
    [
        [0, -1, -1, 0],
        [-1, -1, -1, 0],
        [-1, -1, -1, 0],
        [0, -1, -1, 0],
    ],
    [
        [0, -1, -1, 0],
        [0, -1, -1, -1],
        [0, -1, -1, -1],
        [0, -1, -1, 0],
    ],
    [
        [0, -1, -1, 0],
        [-1, -1, -1, -1],
        [-1, -1, -1, -1],
        [0, 0, 0, 0],
    ],
    [
        [0, 0, 0, 0],
        [-1, -1, -1, -1],
        [-1, -1, -1, -1],
        [0, -1, -1, 0],
    ],
    [
        [0, -1, -1, 0],
        [-1, -1, -1, -1],
        [-1, -1, -1, -1],
        [0, -1, -1, 0],
    ],
    [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
    ],
    [
        [-1, -1, -1, -1],
        [-1, -1, -1, -1],
        [-1, -1, -1, -1],
        [-1, -1, -1, -1],
    ],
];

export const paths = [
    // left
    new Set([1, 3, 5, 6, 8, 9, 10]),
    // right
    new Set([0, 2, 5, 7, 8, 9, 10]),
    // up
    new Set([2, 3, 4, 6, 7, 8, 10]),
    // down
    new Set([0, 1, 4, 6, 7, 9, 10])
]