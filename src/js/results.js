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
            // Use party color for bar - use inline style with specific color for better compatibility
            const partyColorMap = {
                'text-orange-500': '#f97316',
                'text-red-500': '#ef4444',
                'text-blue-500': '#3b82f6',
                'text-blue-700': '#1d4ed8',
                'text-cyan-500': '#06b6d4',
                'text-blue-600': '#2563eb',
                'text-purple-600': '#9333ea',
                'text-orange-600': '#ea580c',
                'text-pink-500': '#ec4899',
                'text-purple-400': '#a855f7',
                'text-orange-400': '#fb923c',
                'text-yellow-500': '#eab308',
                'text-purple-300': '#d8b4fe',
                'text-indigo-500': '#6366f1',
                'text-cyan-400': '#22d3ee',
                'text-emerald-400': '#34d399',
                'text-green-500': '#22c55e',
                'text-slate-400': '#94a3b8'
            };
            const barColorStyle = partyColorMap[p.color] || '#94a3b8';

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
                        <div class="h-full rounded-full" style="width: ${pct}%; background-color: ${barColorStyle}"></div>
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
                    .slice(0, 20); // Top 20 policies

                html += `
                    <div class="mt-10 w-full">
                        <h3 class="text-xl font-bold text-white mb-2 flex items-center gap-2">
                            <i class="fa-solid fa-list-check text-blue-500"></i> นโยบายที่ผู้เล่นเลือกมากที่สุด
                        </h3>
                        <p class="text-xs text-slate-500 mb-6">จากผู้เล่นทั้งหมด ${totalSims.toLocaleString()} คน</p>
                        <div class="space-y-3">
                `;

                sortedPolicies.forEach(([label, count], index) => {
                    const pct = ((count / totalSims) * 100).toFixed(1);
                    // Heatmap color based on percentage - finer scale for 20-50% range
                    const pctNum = parseFloat(pct);
                    let barColor;
                    if (pctNum >= 45) {
                        barColor = 'bg-gradient-to-r from-red-500 to-red-600';
                    } else if (pctNum >= 35) {
                        barColor = 'bg-gradient-to-r from-red-400 to-orange-500';
                    } else if (pctNum >= 28) {
                        barColor = 'bg-gradient-to-r from-orange-500 to-orange-600';
                    } else if (pctNum >= 22) {
                        barColor = 'bg-gradient-to-r from-orange-400 to-orange-500';
                    } else if (pctNum >= 18) {
                        barColor = 'bg-gradient-to-r from-amber-500 to-yellow-500';
                    } else if (pctNum >= 14) {
                        barColor = 'bg-gradient-to-r from-yellow-500 to-amber-500';
                    } else if (pctNum >= 10) {
                        barColor = 'bg-gradient-to-r from-lime-500 to-lime-600';
                    } else if (pctNum >= 6) {
                        barColor = 'bg-gradient-to-r from-green-500 to-green-600';
                    } else {
                        barColor = 'bg-gradient-to-r from-emerald-500 to-emerald-600';
                    }

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
