// База
export const WIDTH = 1920;
export const HEIGHT = 1080;
export const GRAVITY = 1800;

// ИГРОК 
export const COYOTE_DURATION = 200;
export const JUMP_SPEED = -500;
export const MOVE_SPEED_GROUND = 400;
export const MOVE_SPEED_AIR = 500;
export const DASH_SPEED = 1200;
export const DASH_COOLDOWN = 350;
export const DASH_DURATION = 1;
export const WALL_SLIDE_SPEED = 50; 

export const ATTACK_DURATION = 200;
export const ATTACK_WIDTH = 90;
export const ATTACK_HEIGHT = 40;
export const ATTACK_OFFSET_X = 0;
export const ATTACK_OFFSET_Y = -30;

export const COMBAT_TIME = 2500;

export const defaultCoins = 0;
export const defaultPlayerLevel = 0;
export const defaultXp = 0;
export const defaultHealth = 100;
export const defaultMaxLevel = 1;

// ========== Оружие и зона атаки ==========
export const WEAPONS = {
    sword: {
        width: 35,
        height: 25,
        offsetX: 0,
        offsetY: -40,
        damage: 10 
    },
    spear: {
        width: 90,
        height: 18,
        offsetX: -10,
        offsetY: -30,
        damage: 12
    },
};
export const DEFAULT_WEAPON = 'spear';   // стартовое оружие

// Генерация
export const TILE_SIZE_X = 128;
export const TILE_SIZE_Y = 64;
export const CHUNK_SIZE = 4;
export const CHUNKS_X = 10;
export const CHUNKS_Y = 5;
export const chestsAttempts = 5;
export const enemiesAttempts = 15;

export const hintStyle = {
    fontSize: '20px',
    fontFamily: 'Arial',
    color: '#ffffff',
    backgroundColor: '#000000',
    padding: { left: 8, right: 8, top: 4, bottom: 4 }
};