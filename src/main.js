import { Boot } from './scenes/Boot';
import { Lobby } from './scenes/Lobby';
import { Game } from 'phaser';
import { MainMenu } from './scenes/MainMenu';
import { Preloader } from './scenes/Preloader';
import * as Phaser from 'phaser';
import { WIDTH, HEIGHT } from './const';

//  Find out more information about the Game Config at: https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
const config = {
    type: Phaser.AUTO,
    width: WIDTH,
    height: HEIGHT,
    parent: 'game-container',
    backgroundColor: '#6a7177',
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 980 }
        }
    },
    scene: [
        Boot,
        Preloader,
        MainMenu,
        Lobby
    ]
};

export default new Game(config);
