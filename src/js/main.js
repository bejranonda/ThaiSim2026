import { Game } from './game.js';
import './config.js';
import '../css/styles.css';

// Initialize game
const game = new Game();
window.game = game;

// Initialize on window load
window.addEventListener('DOMContentLoaded', () => {
    game.init();

    // Check for Malicious Warning
    const warningModal = document.getElementById('warning-modal');
    const btnAck = document.getElementById('btn-ack-warning');
    const backdrop = document.getElementById('warning-backdrop');

    // Requirement: Show EVERY TIME (User Request)
    if (warningModal) {
        // Show modal with a slight delay for effect
        setTimeout(() => {
            warningModal.classList.remove('hidden');
        }, 1000);
    }

    if (btnAck && warningModal) {
        const closeModal = () => {
            warningModal.classList.add('opacity-0', 'pointer-events-none'); // Fade out
            setTimeout(() => {
                warningModal.classList.add('hidden');
            }, 500);

            // Just hide it immediately as well for responsiveness
            warningModal.classList.add('hidden');
        };

        btnAck.addEventListener('click', closeModal);
        if (backdrop) backdrop.addEventListener('click', closeModal);
    }
});
