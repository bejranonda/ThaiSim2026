import { Game } from './game.js';
import { isBlackoutPeriod } from './config.js';
import './config.js';
import '../css/styles.css';

// Initialize game
const game = new Game();
window.game = game;

// Initialize on window load
window.addEventListener('DOMContentLoaded', () => {
    game.init();

    // Always show blackout notice (informational)
    const blackoutNotice = document.getElementById('blackout-notice');
    if (blackoutNotice) {
        blackoutNotice.classList.remove('hidden');
    }

    // Check Blackout Period - Disable game ONLY during actual blackout
    const startButton = document.querySelector('button[onclick="game.start()"]');

    if (isBlackoutPeriod()) {
        // Disable start button during blackout
        if (startButton) {
            startButton.disabled = true;
            startButton.classList.remove('bg-blue-600', 'hover:bg-blue-500', 'animate-[pulse_3s_ease-in-out_infinite]', 'animate-button-shine', 'shadow-blue-900/40');
            startButton.classList.add('bg-slate-700', 'cursor-not-allowed', 'opacity-50');
            startButton.innerHTML = `
                <span class="flex items-center justify-center gap-2">
                    <i class="fa-solid fa-scale-balanced"></i>
                    <span>ระงับการทำโพลชั่วคราว (ตาม มาตรา 72)</span>
                </span>
            `;
        }
    }

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
