import { parties } from './data.js';
import { db, appId, collection, getDocs } from './config.js';
import '../css/styles.css';

async function initResults() {
    const container = document.getElementById('results-container');
    if (!container) return;

    try {
        if (!db) throw new Error("Database connection not available");

        // Fetch Poll Votes
        const snapshot = await getDocs(collection(db, 'artifacts', appId, 'public', 'data', 'poll_votes_v7'));
        
        const counts = {};
        let total = 0;

        snapshot.forEach(doc => {
            const v = doc.data().vote;
            counts[v] = (counts[v] || 0) + 1;
            total++;
        });

        if (total === 0) {
            container.innerHTML = `
                <div class="text-center py-10">
                    <i class="fa-solid fa-box-open text-4xl text-slate-700 mb-4"></i>
                    <p class="text-slate-500">ยังไม่มีข้อมูลโหวตในระบบ</p>
                </div>
            `;
            return;
        }

        const sorted = Object.entries(counts).sort((a,b) => b[1] - a[1]);

        let html = `
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                <div>
                    <h3 class="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <i class="fa-solid fa-chart-simple text-blue-500"></i> อันดับคะแนนรวม
                    </h3>
                    <div class="space-y-4">
        `;

        sorted.forEach(([key, count], index) => {
            const p = parties[key] || {name: key === 'OTHER' ? 'พรรคอื่นๆ' : 'ไม่ประสงค์ลงคะแนน', color: 'text-slate-400', icon: 'fa-circle-question'};
            const pct = ((count / total) * 100).toFixed(1);
            
            // Highlight top 3
            const rankStyle = index < 3 ? 'font-bold text-white' : 'text-slate-400';
            const barColor = index === 0 ? 'bg-gradient-to-r from-yellow-500 to-amber-500' : 
                             index === 1 ? 'bg-gradient-to-r from-slate-300 to-slate-400' : 
                             index === 2 ? 'bg-gradient-to-r from-orange-400 to-orange-500' : 'bg-slate-700';

            html += `
                <div class="relative group">
                    <div class="flex justify-between items-end mb-1">
                        <div class="flex items-center gap-3">
                            <span class="text-xs font-mono text-slate-500 w-4">${index + 1}</span>
                            <div class="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 text-xs">
                                <i class="fa-solid ${p.icon}"></i>
                            </div>
                            <span class="text-sm ${rankStyle}">${p.name}</span>
                        </div>
                        <span class="text-xs text-slate-400 font-mono">${count.toLocaleString()} (${pct}%)</span>
                    </div>
                    <div class="h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div class="h-full ${barColor} rounded-full" style="width: ${pct}%"></div>
                    </div>
                </div>
            `;
        });

        html += `
                    </div>
                </div>

                <div class="bg-slate-900/50 p-6 rounded-xl border border-slate-800 flex flex-col items-center justify-center text-center h-full min-h-[250px]">
                    <div class="mb-4 relative">
                        <i class="fa-solid fa-users-viewfinder text-6xl text-slate-700"></i>
                        <div class="absolute -top-2 -right-2 w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
                    </div>
                    <h3 class="text-4xl font-extrabold text-white mb-1">${total.toLocaleString()}</h3>
                    <p class="text-sm text-slate-400 uppercase tracking-widest">Total Votes</p>

                    <div class="mt-8 w-full">
                         <p class="text-xs text-slate-500 mb-2 text-left">Top Party Lead:</p>
                         <div class="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                            <div class="h-full bg-blue-500 animate-pulse" style="width: ${((sorted[0][1]/total)*100)}%"></div>
                         </div>
                    </div>
                </div>
            </div>
        `;

        // Fetch Sim Results for policy statistics
        try {
            const simSnapshot = await getDocs(collection(db, 'artifacts', appId, 'public', 'data', 'sim_results_v7'));
            const policyCounts = {};
            let totalSims = 0;

            simSnapshot.forEach(doc => {
                const data = doc.data();
                if (data.policyChoices && Array.isArray(data.policyChoices)) {
                    data.policyChoices.forEach(policy => {
                        const label = policy.label || policy;
                        policyCounts[label] = (policyCounts[label] || 0) + 1;
                    });
                    totalSims++;
                }
            });

            if (totalSims > 0) {
                const sortedPolicies = Object.entries(policyCounts)
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 10); // Top 10 policies

                html += `
                    <div class="mt-10 w-full">
                        <h3 class="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <i class="fa-solid fa-list-check text-blue-500"></i> นโยบายที่นักเล่นเลือกมากที่สุด
                        </h3>
                        <div class="space-y-3">
                `;

                sortedPolicies.forEach(([label, count], index) => {
                    const pct = ((count / totalSims) * 100).toFixed(1);
                    const barColor = index === 0 ? 'bg-gradient-to-r from-yellow-500 to-amber-500' :
                                   index === 1 ? 'bg-gradient-to-r from-slate-300 to-slate-400' :
                                   index === 2 ? 'bg-gradient-to-r from-orange-400 to-orange-500' : 'bg-blue-600';

                    html += `
                        <div class="relative">
                            <div class="flex justify-between items-end mb-1">
                                <div class="flex items-center gap-3">
                                    <span class="text-xs font-mono text-slate-500 w-5 text-right">#${index + 1}</span>
                                    <span class="text-sm text-slate-300">${label}</span>
                                </div>
                                <span class="text-xs text-slate-400 font-mono">${count.toLocaleString()} (${pct}%)</span>
                            </div>
                            <div class="h-2 bg-slate-800 rounded-full overflow-hidden">
                                <div class="h-full ${barColor}" style="width: ${pct}%"></div>
                            </div>
                        </div>
                    `;
                });

                html += `
                        </div>
                    </div>
                `;
            }
        } catch (e) {
            console.error("Policy stats fetch error:", e);
        }

        container.innerHTML = html;

    } catch (e) {
        console.error("Fetch Error:", e);
        container.innerHTML = `
            <div class="text-center py-10">
                <i class="fa-solid fa-triangle-exclamation text-4xl text-red-500 mb-4"></i>
                <p class="text-red-400">เกิดข้อผิดพลาดในการโหลดข้อมูล</p>
                <p class="text-xs text-slate-600 mt-2">${e.message}</p>
            </div>
        `;
    }
}

document.addEventListener('DOMContentLoaded', initResults);
