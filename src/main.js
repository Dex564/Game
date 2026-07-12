import { Lobby } from './scenes/Lobby';
import { Game } from 'phaser';
import { MainMenu } from './scenes/MainMenu';
import { CaveLevel } from './scenes/CaveLevel';
import { Preloader } from './scenes/Preloader';
import { HUD } from './scenes/HUD';
import { Pause } from './scenes/Pause';
import { InsideTemple } from './scenes/InsideTemple';
import { GameOver } from './scenes/GameOver';
import * as Phaser from 'phaser';
import * as Const from './const';
import { LevelUpScene } from './scenes/upgrades/LevelUp'

//  Find out more information about the Game Config at: https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
const config = {
    type: Phaser.AUTO,
    width: Const.WIDTH,
    height: Const.HEIGHT,
    parent: 'game-container',
    backgroundColor: '#181819',
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: Const.GRAVITY },
            debug: true,
            fps: 240    
        }
    },
    scene: [
        Preloader,
        MainMenu,
        Lobby,
        InsideTemple,
        CaveLevel,
        HUD,
        Pause,
        GameOver,
        LevelUpScene
    ]
};

export default new Game(config);