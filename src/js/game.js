import { parties, phases } from './data.js';
import { auth, db, appId, signInAnonymously, collection, addDoc, getDocs } from './config.js';
import html2canvas from 'html2canvas';

export class Game {
    constructor() {
        this.phase = 0;
        this.scores = {};
        this.maxScores = {};
        this.stats = { eco: 30, soc: 30, lib: 30 };
        this.history = [];
        this.choices = [];
        this.currentSelection = new Set();
        this.manualVote = null;

        Object.keys(parties).forEach(k => {
            this.scores[k] = 0;
            this.maxScores[k] = 0;
        });

        // Calculate Max Scores
        phases.forEach(p => {
            p.options.forEach(opt => {
                opt.party.forEach(partyKey => {
                    if (this.maxScores[partyKey] !== undefined) {
                        this.maxScores[partyKey] += 5;
                    }
                });
            });
        });
    }

    async init() {
        console.log("Initializing Game...");
        
        // Render immediately
        if (document.getElementById('city-container')) {
            this.renderCityGrid();
            this.loadPhase();
        }

        try {
            if (auth) {
                // Non-blocking auth check
                signInAnonymously(auth).then(userCred => {
                    console.log("Firebase Auth Success:", userCred.user.uid);
                    // Test Firestore connection in background
                    if(db) {
                         getDocs(collection(db, 'test_connection')).then(() => {
                            console.log("Firestore Connection Success");
                         }).catch(dbErr => {
                            console.warn("Firestore Check Failed:", dbErr);
                         });
                    }
                }).catch(e => {
                     console.error("Auth failed:", e);
                     // Only alert if critical, or maybe just log it since we want the game to be playable offline
                     console.warn("Running in Offline Mode (Auth failed)");
                });
            } else {
                console.warn("Auth not initialized (Offline Mode)");
            }
        } catch (e) {
            console.error("Init Error:", e);
        }
    }

    start() {
        const intro = document.getElementById('screen-intro');
        const hud = document.getElementById('hud');
        const gameScreen = document.getElementById('screen-game');

        if (intro) intro.classList.add('hidden');
        if (hud) hud.classList.remove('hidden');
        if (gameScreen) {
            gameScreen.classList.remove('hidden');
            document.documentElement.scrollTop = 0;
        }
    }

    renderCityGrid() {
        const container = document.getElementById('city-container');
        if (!container) return;

        container.innerHTML = '';
        phases.forEach((p, i) => {
            const slot = document.createElement('div');
            slot.id = `slot-${i}`;
            slot.className = 'city-slot relative';
            slot.innerHTML = `
                <div class="slot-content absolute inset-0 flex flex-col items-center justify-center pointer-events-none transition-opacity duration-500 p-1">
                    <i class="fa-solid ${p.icon} text-slate-500 opacity-20 text-2xl mb-1"></i>
                    <span class="text-[10px] text-slate-500 text-center leading-tight opacity-50 font-medium">${p.title}</span>
                </div>
                <div class="slot-fill absolute inset-0 flex flex-wrap content-center justify-center gap-1 p-1 z-10"></div>
            `;
            container.appendChild(slot);
        });
    }

    loadPhase() {
        const p = phases[this.phase];
        if (!p) return;

        document.getElementById('phase-counter').innerText = `${this.phase + 1}/${phases.length}`;
        document.getElementById('q-title').innerText = p.title;
        document.getElementById('q-desc').innerText = p.desc;

        document.querySelectorAll('.city-slot').forEach(el => el.classList.remove('active'));
        const currentSlot = document.getElementById(`slot-${this.phase}`);
        if (currentSlot) currentSlot.classList.add('active');

        const btnBack = document.getElementById('btn-back');
        if (btnBack) {
            btnBack.disabled = (this.phase === 0);
            btnBack.style.opacity = (this.phase === 0) ? 0.3 : 1;
        }

        this.currentSelection.clear();
        this.updateConfirmButton();

        const grid = document.getElementById('choices-grid');
        if (grid) {
            grid.innerHTML = '';
            // Shuffle options for fairness
            const shuffledOptions = [...p.options].sort(() => Math.random() - 0.5);
            
            shuffledOptions.forEach(opt => {
                const card = document.createElement('div');
                card.id = `card-${opt.id}`;
                card.className = "choice-card bg-slate-800 border border-slate-700 p-5 rounded-xl flex items-start gap-4 hover:bg-slate-750 has-tooltip group";
                card.onclick = () => this.toggleOption(opt);
                card.innerHTML = `
                    <div class="mt-1 w-7 h-7 rounded-full border-2 border-slate-500 flex items-center justify-center flex-shrink-0 check-circle">
                        <i class="fa-solid fa-check text-sm text-white opacity-0 check-icon"></i>
                    </div>
                    <div>
                        <h3 class="text-base font-bold text-slate-200 mb-2 leading-tight">${opt.label}</h3>
                        <p class="text-sm text-slate-400 leading-relaxed">${opt.desc}</p>
                    </div>

                    <!-- Tooltip -->
                    <div class="tooltip-content w-56 pointer-events-none z-50">
                        <div class="font-bold text-blue-400 text-xs mb-2 border-b border-slate-600 pb-1">ข้อมูลเชิงลึก (Insight)</div>
                        <div class="space-y-1.5">
                             <div class="flex justify-between items-center text-xs text-slate-300">
                                <span class="flex items-center gap-2"><i class="fa-solid fa-chart-line text-emerald-400 w-4 text-center"></i> เศรษฐกิจ</span>
                                <span class="${opt.stats.eco >= 0 ? 'text-emerald-400' : 'text-red-400'} font-mono font-bold">${opt.stats.eco > 0 ? '+' : ''}${opt.stats.eco}</span>
                            </div>
                            <div class="flex justify-between items-center text-xs text-slate-300">
                                <span class="flex items-center gap-2"><i class="fa-solid fa-users text-blue-400 w-4 text-center"></i> สังคม</span>
                                <span class="${opt.stats.soc >= 0 ? 'text-blue-400' : 'text-red-400'} font-mono font-bold">${opt.stats.soc > 0 ? '+' : ''}${opt.stats.soc}</span>
                            </div>
                            <div class="flex justify-between items-center text-xs text-slate-300">
                                <span class="flex items-center gap-2"><i class="fa-solid fa-scale-balanced text-orange-400 w-4 text-center"></i> ปชต.</span>
                                <span class="${(opt.stats.lib || 0) >= 0 ? 'text-orange-400' : 'text-red-400'} font-mono font-bold">${(opt.stats.lib || 0) > 0 ? '+' : ''}${opt.stats.lib || 0}</span>
                            </div>
                            <div class="flex justify-between items-center text-xs text-slate-400 border-t border-slate-700 pt-1.5 mt-1.5">
                                <span class="flex items-center gap-2"><i class="fa-solid fa-hand-shake w-4 text-center"></i> พรรคที่หนุน</span>
                                <span class="text-white font-mono font-bold">${opt.party.length}</span>
                            </div>
                        </div>
                    </div>
                `;
                grid.appendChild(card);
            });
        }

        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    toggleOption(opt) {
        const card = document.getElementById(`card-${opt.id}`);
        
        // Add click pulse effect
        card.classList.add('click-pulse');
        setTimeout(() => card.classList.remove('click-pulse'), 300);

        if (this.currentSelection.has(opt)) {
            this.currentSelection.delete(opt);
            card.classList.remove('selected');
        } else {
            this.currentSelection.add(opt);
            card.classList.add('selected');
        }
        this.updateConfirmButton();
    }

    updateConfirmButton() {
        const btn = document.getElementById('btn-confirm');
        const count = document.getElementById('confirm-count');

        if (this.currentSelection.size > 0) {
            btn.disabled = false;
            btn.classList.remove('opacity-50', 'cursor-not-allowed', 'bg-slate-800', 'text-slate-600');
            btn.classList.add('bg-blue-600', 'text-white', 'hover:bg-blue-500', 'shadow-lg');
            count.innerText = this.currentSelection.size;
            count.classList.remove('hidden');
        } else {
            btn.disabled = true;
            btn.classList.add('opacity-50', 'cursor-not-allowed', 'bg-slate-800', 'text-slate-600');
            btn.classList.remove('bg-blue-600', 'text-white', 'hover:bg-blue-500', 'shadow-lg');
            count.classList.add('hidden');
        }
    }

    confirm() {
        if (this.currentSelection.size === 0) return;

        this.history.push({
            scores: {...this.scores},
            stats: {...this.stats},
            choices: [...this.choices],
            selection: new Set(this.currentSelection)
        });

        const selectedOpts = Array.from(this.currentSelection);

        const slot = document.getElementById(`slot-${this.phase}`);
        
        // Find the fill container
        const fillContainer = slot ? slot.querySelector('.slot-fill') : null;
        const contentContainer = slot ? slot.querySelector('.slot-content') : null;
        
        if (contentContainer) contentContainer.style.opacity = '0.1';

        selectedOpts.forEach(opt => {
            opt.party.forEach(p => {
                if (this.scores[p] !== undefined) this.scores[p] += 5;
            });

            this.stats.eco = Math.min(100, Math.max(0, this.stats.eco + (opt.stats.eco || 0)));
            this.stats.soc = Math.min(100, Math.max(0, this.stats.soc + (opt.stats.soc || 0)));
            this.stats.lib = Math.min(100, Math.max(0, this.stats.lib + (opt.stats.lib || 0)));
            this.choices.push(opt.label);

            const mini = document.createElement('div');
            mini.className = "w-6 h-6 bg-slate-900 rounded-full flex items-center justify-center border border-slate-600 pop-in m-[1px]";
            mini.innerHTML = `<i class="fa-solid fa-check text-[10px] text-blue-400"></i>`;
            if (fillContainer) fillContainer.appendChild(mini);
        });

        if (slot) {
            slot.classList.add('filled', 'pop-effect');
            setTimeout(() => slot.classList.remove('pop-effect'), 500);
        }
        this.updateMeters();

        this.phase++;
        if (this.phase < phases.length) {
            this.loadPhase();
        } else {
            this.finish();
        }
    }

    skip() {
        this.history.push({
            scores: {...this.scores},
            stats: {...this.stats},
            choices: [...this.choices],
            selection: "SKIP"
        });

        const slot = document.getElementById(`slot-${this.phase}`);
        const fillContainer = slot ? slot.querySelector('.slot-fill') : null;
        const contentContainer = slot ? slot.querySelector('.slot-content') : null;

        if (contentContainer) contentContainer.style.opacity = '0.1';
        if (fillContainer) fillContainer.innerHTML = `<span class="text-xs text-slate-500">ข้าม</span>`;

        this.phase++;
        if (this.phase < phases.length) {
            this.loadPhase();
        } else {
            this.finish();
        }
    }

    undo() {
        if (this.phase === 0 || this.history.length === 0) return;

        const prevState = this.history.pop();
        this.scores = prevState.scores;
        this.stats = prevState.stats;
        this.choices = prevState.choices;

        this.phase--;

        const slot = document.getElementById(`slot-${this.phase}`);
        if (slot) {
            const fillContainer = slot.querySelector('.slot-fill');
            const contentContainer = slot.querySelector('.slot-content');
            
            if (fillContainer) fillContainer.innerHTML = '';
            if (contentContainer) contentContainer.style.opacity = '1';
            
            slot.classList.remove('filled');
        }

        this.updateMeters();
        this.loadPhase();
    }

    updateMeters() {
        document.getElementById('val-eco').innerText = this.stats.eco;
        document.getElementById('bar-eco').style.width = `${this.stats.eco}%`;
        document.getElementById('val-soc').innerText = this.stats.soc;
        document.getElementById('bar-soc').style.width = `${this.stats.soc}%`;
        document.getElementById('val-lib').innerText = this.stats.lib;
        document.getElementById('bar-lib').style.width = `${this.stats.lib}%`;
    }

    finish() {
        document.getElementById('screen-game').classList.add('hidden');
        document.getElementById('hud').classList.add('hidden');
        document.getElementById('screen-result').classList.remove('hidden');
        window.scrollTo({ top: 0 });

        // Calculate weighted percentage
        const results = Object.entries(this.scores).map(([k, score]) => {
            const max = this.maxScores[k] || 1; // Avoid divide by zero
            // If a party has very few policies, we penalize slightly to avoid 1/1 = 100% winning against 8/10 = 80%
            // But strict fairness means we just use pure percentage. 
            // Let's use pure percentage but require a minimum presence? 
            // No, user asked for "fair to every party". Pure percentage is fairest for small parties.
            const pct = (score / max) * 100;
            return { key: k, score: score, pct: pct, max: max };
        });

        // Sort by Percentage, then by raw score as tie-breaker
        const sorted = results.sort((a, b) => {
            if (b.pct !== a.pct) return b.pct - a.pct;
            return b.score - a.score;
        });

        const top5 = sorted.slice(0, 5);
        let winner = parties[top5[0].key];
        let winPct = top5[0].pct;

        // Special case: If user skipped everything (score 0), show "No Match"
        if (top5[0].score === 0) {
            winner = {
                name: "ยังประเมินไม่ได้",
                desc: "คุณเลือก 'ข้าม' ทุกข้อ จึงไม่มีข้อมูลเพียงพอที่จะวิเคราะห์ว่านโยบายของคุณตรงกับพรรคใด ลองเริ่มใหม่อีกครั้งและเลือกนโยบายที่คุณชอบนะครับ",
                icon: "fa-circle-question",
                color: "text-slate-400"
            };
            winPct = 0;
        }

        // Winner Card Animation
        const winnerCard = document.querySelector('#screen-result > div > div:first-child');
        if (winnerCard) {
            winnerCard.classList.add('animate-victory', 'animate-shine');
        }

        // Fire Confetti
        if (typeof confetti === 'function') {
            const duration = 3000;
            const end = Date.now() + duration;

            (function frame() {
                confetti({
                    particleCount: 5,
                    angle: 60,
                    spread: 55,
                    origin: { x: 0 },
                    colors: ['#3b82f6', '#10b981', '#f59e0b']
                });
                confetti({
                    particleCount: 5,
                    angle: 120,
                    spread: 55,
                    origin: { x: 1 },
                    colors: ['#3b82f6', '#10b981', '#f59e0b']
                });

                if (Date.now() < end) {
                    requestAnimationFrame(frame);
                }
            }());
        }

        document.getElementById('res-party').innerText = winner.name;
        document.getElementById('res-party').className = `text-4xl md:text-6xl font-extrabold mb-5 drop-shadow-lg leading-tight ${winner.color}`;
        document.getElementById('res-desc').innerText = winner.desc;
        document.getElementById('res-icon').className = `fa-solid ${winner.icon} text-7xl text-white group-hover:scale-110 transition`;

        // Display Percentage
        document.getElementById('res-percent').innerText = `${Math.floor(winPct)}%`;

        // Update National Status Card
        const statusCard = document.getElementById('res-status');
        if (statusCard) {
            statusCard.classList.remove('hidden');
            
            document.getElementById('end-eco').innerText = `${this.stats.eco}/100`;
            document.getElementById('end-bar-eco').style.width = `${this.stats.eco}%`;
            
            document.getElementById('end-soc').innerText = `${this.stats.soc}/100`;
            document.getElementById('end-bar-soc').style.width = `${this.stats.soc}%`;
            
            document.getElementById('end-lib').innerText = `${this.stats.lib}/100`;
            document.getElementById('end-bar-lib').style.width = `${this.stats.lib}%`;
        }

        const runnerContainer = document.getElementById('res-runners');
        runnerContainer.innerHTML = '';
        for (let i=1; i<top5.length; i++) {
            const r = top5[i];
            const pKey = r.key;
            const p = parties[pKey];
            
            // Only show if they scored something
            if (r.score > 0) {
                runnerContainer.innerHTML += `
                    <div class="has-tooltip bg-slate-800 p-4 rounded-lg border border-slate-700 flex items-center justify-between group relative cursor-pointer hover:bg-slate-750 transition">
                        <div class="flex items-center gap-4">
                            <div class="w-9 h-9 rounded-full bg-slate-900 flex items-center justify-center text-slate-400 text-sm"><i class="fa-solid ${p.icon}"></i></div>
                            <span class="text-sm font-bold text-slate-300">${p.name}</span>
                        </div>
                        <span class="text-xs bg-slate-900 px-2.5 py-1 rounded text-slate-400 font-mono">${Math.floor(r.pct)}%</span>

                        <div class="tooltip-content">
                            <div class="font-bold text-blue-400 mb-1 border-b border-slate-600 pb-1">${p.name}</div>
                            <div class="text-slate-300 text-xs">${p.desc}</div>
                            <div class="text-xs text-slate-500 mt-1">Match: ${r.score}/${r.max} pts</div>
                        </div>
                    </div>
                `;
            }
        }

        this.renderPoll();
        this.saveSimResult(top5[0].key);
    }

    renderPoll() {
        const container = document.getElementById('poll-container');
        container.innerHTML = '';

        const opts = [
            ...Object.entries(parties).map(([k,v]) => ({id:k, ...v})),
            {id:'OTHER', name:'พรรคอื่นๆ', icon:'fa-question', color:'text-slate-400', desc:'พรรคอื่นๆ ที่ไม่ได้อยู่ในรายการ'},
            {id:'NOVOTE', name:'ไม่ประสงค์ลงคะแนน', icon:'fa-xmark', color:'text-slate-400', desc:'ยังไม่ตัดสินใจ หรือไม่ต้องการเลือกใคร'}
        ];

        opts.forEach(o => {
            container.innerHTML += `
                <label class="cursor-pointer bg-slate-800 border border-slate-700 rounded-lg p-4 flex items-center gap-3 hover:bg-slate-700 transition has-[:checked]:bg-blue-900/40 has-[:checked]:border-blue-500 relative has-tooltip group">
                    <input type="radio" name="poll" value="${o.id}" class="hidden" onchange="game.manualVote='${o.id}'">
                    <i class="fa-solid ${o.icon} ${o.color} text-base w-6 text-center"></i>
                    <span class="text-sm font-bold text-slate-200 truncate">${o.name}</span>

                    <div class="tooltip-content">
                        <div class="font-bold text-blue-400 mb-1 border-b border-slate-600 pb-1">${o.name}</div>
                        <div class="text-slate-300 text-xs">${o.desc}</div>
                    </div>
                </label>
            `;
        });
    }

    async saveSimResult(winner) {
        try {
            const user = auth && auth.currentUser;
            if(user && db) {
                await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'sim_results_v7'), {
                    winner: winner,
                    choices: this.choices,
                    stats: this.stats,
                    timestamp: new Date()
                });
            }
        } catch(e) { 
            console.error("saveSimResult failed. Path:", `artifacts/${appId}/public/data/sim_results_v7`);
            console.error(e); 
        }
    }

    async submitVote() {
        if (!this.manualVote) return alert("กรุณาเลือกพรรค");
        const btn = document.getElementById('btn-vote');
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-2"></i> กำลังบันทึก...';
        btn.disabled = true;

        try {
            let user = auth && auth.currentUser;
            if (!user && auth) {
                try { await signInAnonymously(auth); user = auth.currentUser; } catch(e){}
            }

            if(user && db) {
                await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'poll_votes_v7'), {
                    vote: this.manualVote,
                    timestamp: new Date()
                });

                await this.showLiveResults();

                btn.innerHTML = '<i class="fa-solid fa-check mr-2"></i> บันทึกเรียบร้อย';
                btn.className = "w-full bg-emerald-600 text-white font-bold py-5 rounded-xl transition text-base shadow-lg cursor-default flex items-center justify-center gap-2";
                document.getElementById('poll-container').classList.add('hidden');
            } else {
                btn.innerHTML = 'บันทึก (Offline Mode)';
                await this.showLiveResults();
            }
        } catch(e) {
            console.error("submitVote failed. Path:", `artifacts/${appId}/public/data/poll_votes_v7`);
            console.error(e);
            btn.innerHTML = "ลองใหม่";
            btn.disabled = false;
        }
    }

    async showLiveResults() {
        const resultsContainer = document.getElementById('poll-results');
        resultsContainer.classList.remove('hidden');
        resultsContainer.innerHTML = '<div class="text-center text-slate-500 text-sm"><i class="fa-solid fa-spinner fa-spin"></i> กำลังโหลดผลโหวต...</div>';

        try {
            if (!db) throw new Error("No DB");

            const snapshot = await getDocs(collection(db, 'artifacts', appId, 'public', 'data', 'poll_votes_v7'));

            const counts = {};
            let total = 0;

            snapshot.forEach(doc => {
                const v = doc.data().vote;
                counts[v] = (counts[v] || 0) + 1;
                total++;
            });

            resultsContainer.innerHTML = '';
            const sorted = Object.entries(counts).sort((a,b) => b[1] - a[1]).slice(0, 5);

            if (sorted.length === 0) {
                resultsContainer.innerHTML = '<div class="text-center text-slate-500 text-sm">ยังไม่มีข้อมูลโหวต</div>';
                return;
            }

            sorted.forEach(([key, count]) => {
                const pInfo = parties[key] || {name: key === 'OTHER' ? 'พรรคอื่นๆ' : 'ไม่ประสงค์ลงคะแนน', color: 'text-slate-400'};
                const pct = Math.round((count / total) * 100);

                resultsContainer.innerHTML += `
                    <div class="mb-3">
                        <div class="flex justify-between text-sm text-slate-300 mb-1.5">
                            <span>${pInfo.name}</span>
                            <span>${pct}%</span>
                        </div>
                        <div class="h-3 bg-slate-800 rounded-full overflow-hidden">
                            <div class="h-full bg-blue-500 poll-bar" style="width: 0%" data-width="${pct}%"></div>
                        </div>
                    </div>
                `;
            });

            setTimeout(() => {
                document.querySelectorAll('.poll-bar').forEach(bar => {
                    bar.style.width = bar.dataset.width;
                });
            }, 100);

        } catch (e) {
            console.error("Fetch results failed", e);
            resultsContainer.innerHTML = `<div class="text-center text-red-500 text-xs">โหลดผลโหวตล้มเหลว (Offline: ${e.message})</div>`;
        }
    }

    share() {
        const winnerName = document.getElementById('res-party').innerText;
        const shareUrl = "http://thalay.eu/poll2569";
        if (navigator.share) {
            navigator.share({ title: 'Sim-Thailand 2569', text: `ผลลัพธ์ประเทศในฝันของฉันคือ "${winnerName}"`, url: shareUrl });
        } else {
            alert(`คัดลอก: ผลลัพธ์ประเทศในฝันของฉันคือ "${winnerName}" \nลิงก์: ${shareUrl}`);
        }
    }

    async saveResultImage(btn) {
        const element = document.getElementById('result-card');
        if (!element) return;

        const originalText = btn ? btn.innerHTML : 'บันทึกรูป';
        if(btn) {
            btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> กำลังสร้าง...';
            btn.disabled = true;
        }

        try {
            const canvas = await html2canvas(element, {
                backgroundColor: '#0f172a', // slate-950
                scale: 2,
                logging: false,
                useCORS: true
            });

            const link = document.createElement('a');
            link.download = `sim-thailand-result-${Date.now()}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();

        } catch (e) {
            console.error("Screenshot failed:", e);
            alert("ขออภัย เกิดข้อผิดพลาดในการสร้างรูปภาพ");
        } finally {
            if(btn) {
                btn.innerHTML = originalText;
                btn.disabled = false;
            }
        }
    }
}
