import { Game } from './game.js';
import './config.js';
import '../css/styles.css';

// Initialize game
const game = new Game();
window.game = game;

// Initialize on window load
window.addEventListener('DOMContentLoaded', () => {
    game.init();
});
