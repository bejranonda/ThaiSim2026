import { parties, phases } from './src/js/data.js';

const counts = {};
Object.keys(parties).forEach(k => counts[k] = 0);

phases.forEach(phase => {
    phase.options.forEach(opt => {
        opt.party.forEach(p => {
            if (counts[p] !== undefined) {
                counts[p]++;
            }
        });
    });
});

console.log("Party Frequencies:");
const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
sorted.forEach(([k, v]) => {
    console.log(`${parties[k].name} (${k}): ${v} options`);
});
