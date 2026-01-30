import { parties } from './data.js';
import { db, appId, collection, getDocs, isBlackoutPeriod } from './config.js';
import '../css/styles.css';


function showBlackoutNotice() {
    const pollContainer = document.getElementById('poll-results-container');
    const chartContainer = document.getElementById('chart-container');
    const simContainer = document.getElementById('sim-results-container');

    // Hide chart container
    if (chartContainer) chartContainer.classList.add('hidden');

    // Show blackout notice in poll container
    if (pollContainer) {
        pollContainer.innerHTML = `
            <div class="text-center py-10 px-4">
                <div class="mb-6">
                    <i class="fa-solid fa-scale-balanced text-6xl text-amber-500 mb-4"></i>
                </div>
                <h3 class="text-2xl font-bold text-amber-500 mb-4">แจ้งเตือนตามกฎหมาย</h3>
                <p class="text-slate-300 mb-4 max-w-lg mx-auto">
                    ตามพระราชบัญญัติประกอบรัฐธรรมนูญว่าด้วยการเลือกตั้งสมาชิกสภาผู้แทนราษฎร
                </p>
                <div class="bg-slate-800/50 border border-slate-700 rounded-xl p-6 max-w-lg mx-auto mb-6">
                    <p class="text-slate-400 text-sm mb-2">
                        <strong class="text-white">มาตรา 72</strong> ห้ามทำสำรวจความคิดเห็นของประชาชน
                        ก่อนวันเลือกตั้ง
                    </p>
                    <p class="text-slate-500 text-xs">
                        ระงับการให้บริการชั่วคราว 30 ม.ค. - 8 ก.พ. 2569 (17:30 น.)
                    </p>
                </div>
                <div class="mt-5 pt-5 border-t border-slate-700">
                    <p class="text-emerald-400 text-base font-bold animate-pulse">
                        <i class="fa-solid fa-calendar-check mr-2"></i>
                        พบกันใหม่หลังเลือกตั้ง
                    </p>
                    <p class="text-emerald-200 text-2xl md:text-3xl font-extrabold mt-3 tracking-wide drop-shadow-[0_0_15px_rgba(52,211,153,0.5)] animate-pulse">
                        Sim-Government 2569
                    </p>
                </div>
            </div>
        `;
    }

    // Hide sim container or show notice
    if (simContainer) {
        simContainer.innerHTML = `
            <div class="text-center py-10">
                <i class="fa-solid fa-hourglass-half text-4xl text-slate-700 mb-4"></i>
                <p class="text-slate-500">ข้อมูลการจำลองจะแสดงอีกครั้งหลังเลือกตั้ง</p>
            </div>
        `;
    }
}


async function initResults() {
    const pollContainer = document.getElementById('poll-results-container');
    const simContainer = document.getElementById('sim-results-container');

    // Always show blackout notice (informational)
    const blackoutNotice = document.getElementById('blackout-notice');
    if (blackoutNotice) {
        blackoutNotice.classList.remove('hidden');
    }

    // Check if we're in the blackout period - hide results only during actual blackout
    if (isBlackoutPeriod()) {
        showBlackoutNotice();
        return; // Skip loading results
    }

    // 1. Fetch and Render Poll Votes (Fastest)
    if (pollContainer) {
        loadPollVotes(pollContainer);
    }

    // 2. Fetch and Render Sim Results (Heavier)
    if (simContainer) {
        loadSimResults(simContainer);
    }

    // Warning Modal Logic (Show Every Time)
    const warningModal = document.getElementById('warning-modal');
    const btnAck = document.getElementById('btn-ack-warning');
    const backdrop = document.getElementById('warning-backdrop');

    if (warningModal) {
        setTimeout(() => {
            warningModal.classList.remove('hidden');
        }, 1000);
    }

    if (btnAck && warningModal) {
        const closeModal = () => {
            warningModal.classList.add('opacity-0', 'pointer-events-none');
            setTimeout(() => {
                warningModal.classList.add('hidden');
            }, 500);
            warningModal.classList.add('hidden');
        };

        btnAck.addEventListener('click', closeModal);
        if (backdrop) backdrop.addEventListener('click', closeModal);
    }
}

import Chart from 'chart.js/auto';

async function loadPollVotes(container) {
    // Check blackout period (safety check)
    if (isBlackoutPeriod()) {
        showBlackoutNotice();
        return;
    }

    try {
        if (!db) throw new Error("Database connection not available");

        const snapshot = await getDocs(collection(db, 'artifacts', appId, 'public', 'data', 'poll_votes_v7'));

        const counts = {};
        let total = 0;

        // Data for Chart
        const dailyData = {}; // { 'YYYY-MM-DD': { 'PARTY_ID': count } }
        const allDates = new Set();
        const allParties = new Set();

        snapshot.forEach(doc => {
            const data = doc.data();
            const v = data.vote;
            counts[v] = (counts[v] || 0) + 1;
            total++;

            // Process Timeline Data
            if (data.timestamp) {
                let dateStr;
                // Handle Firestore Timestamp or JS Date
                if (data.timestamp.toDate) {
                    dateStr = data.timestamp.toDate().toISOString().split('T')[0];
                } else if (data.timestamp instanceof Date) {
                    dateStr = data.timestamp.toISOString().split('T')[0];
                } else {
                    // Fallback try parsing string
                    try {
                        dateStr = new Date(data.timestamp).toISOString().split('T')[0];
                    } catch (e) {
                        // Invalid date
                    }
                }

                if (dateStr) {
                    allDates.add(dateStr);
                    allParties.add(v);

                    if (!dailyData[dateStr]) dailyData[dateStr] = {};
                    dailyData[dateStr][v] = (dailyData[dateStr][v] || 0) + 1;
                }
            }
        });

        // Debug: Check if we have date data
        // console.log("Daily Data:", dailyData);

        if (total === 0) {
            container.innerHTML = `
                <div class="text-center py-10">
                    <i class="fa-solid fa-box-open text-4xl text-slate-700 mb-4"></i>
                    <p class="text-slate-500">ยังไม่มีข้อมูลโหวตในระบบ</p>
                </div>
            `;
            return;
        }

        const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);

        let html = `
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                <div>
                    <h3 class="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <i class="fa-solid fa-chart-simple text-blue-500"></i> พรรคที่ผู้เล่นโหวตให้ (ไม่ใช่ผลการจำลอง)
                    </h3>
                    <div class="space-y-4">
        `;

        sorted.forEach(([key, count], index) => {
            const p = parties[key] || { name: key === 'OTHER' ? 'พรรคอื่นๆ' : 'ไม่ประสงค์ลงคะแนน', color: 'text-slate-400', icon: 'fa-circle-question' };
            const pct = ((count / total) * 100).toFixed(1);

            const rankStyle = index < 3 ? 'font-bold text-white' : 'text-slate-400';
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
                        <p class="text-xs text-slate-500 mb-2">สัดส่วนคะแนนเสียงทุกพรรค:</p>
                        <div class="w-full bg-slate-800 h-4 rounded-full overflow-hidden flex">
${sorted.map(([key, count]) => {
            const p = parties[key] || { color: 'text-slate-400' };
            const pct = ((count / total) * 100).toFixed(2);
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
            const bgColor = partyColorMap[p.color] || '#94a3b8';
            return `<div style="width: ${pct}%; background-color: ${bgColor}" class="h-full first:rounded-l-full last:rounded-r-full" title="${p.name}: ${pct}%"></div>`;
        }).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `;

        container.innerHTML = html;

        // Render Chart if data exists
        if (allDates.size > 0) {
            renderVoteTrendChart(dailyData, Array.from(allDates).sort(), Array.from(allParties));
        }

    } catch (e) {
        console.error("Poll Votes Fetch Error:", e);
        container.innerHTML = `
            <div class="text-center py-10">
                <i class="fa-solid fa-triangle-exclamation text-4xl text-red-500 mb-4"></i>
                <p class="text-red-400">เกิดข้อผิดพลาดในการโหลดข้อมูลโหวต</p>
                <p class="text-xs text-slate-600 mt-2">${e.message}</p>
            </div>
        `;
    }
}

function renderVoteTrendChart(dailyData, sortedDates, involvedParties) {
    const ctx = document.getElementById('voteTrendChart');
    const chartContainer = document.getElementById('chart-container');

    if (!ctx || !chartContainer) return;

    chartContainer.classList.remove('hidden');

    const datasets = involvedParties.map(partyKey => {
        const p = parties[partyKey] || { name: partyKey === 'OTHER' ? 'พรรคอื่นๆ' : 'ไม่ประสงค์ลงคะแนน', color: 'text-slate-400' };

        // Map Colors
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
        const color = partyColorMap[p.color] || '#94a3b8';

        const dataPoints = sortedDates.map(date => {
            return (dailyData[date] && dailyData[date][partyKey]) ? dailyData[date][partyKey] : 0;
        });

        // Only include if total votes > 0
        if (dataPoints.reduce((a, b) => a + b, 0) === 0) return null;

        return {
            label: p.name,
            data: dataPoints,
            borderColor: color,
            backgroundColor: color,
            borderWidth: 2,
            tension: 0.3,
            fill: false
        };
    }).filter(ds => ds !== null); // Filter out empty datasets

    // Sort datasets by total votes descending for better legend
    datasets.sort((a, b) => {
        const sumA = a.data.reduce((x, y) => x + y, 0);
        const sumB = b.data.reduce((x, y) => x + y, 0);
        return sumB - sumA;
    });

    // Limit to top 10 parties to keep chart readable
    const topDatasets = datasets.slice(0, 10);

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: sortedDates, // e.g. ["2026-01-28", "2026-01-29"]
            datasets: topDatasets
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: 'index',
                intersect: false,
            },
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: '#94a3b8',
                        usePointStyle: true,
                        boxWidth: 8
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                    titleColor: '#e2e8f0',
                    bodyColor: '#e2e8f0',
                    borderColor: 'rgba(51, 65, 85, 0.5)',
                    borderWidth: 1
                }
            },
            scales: {
                x: {
                    grid: { color: 'rgba(51, 65, 85, 0.3)' },
                    ticks: { color: '#94a3b8' }
                },
                y: {
                    grid: { color: 'rgba(51, 65, 85, 0.3)' },
                    ticks: { color: '#94a3b8' },
                    beginAtZero: true
                }
            }
        }
    });
}

async function loadSimResults(container) {
    // Check blackout period (safety check)
    if (isBlackoutPeriod()) {
        container.innerHTML = `
            <div class="text-center py-10">
                <i class="fa-solid fa-hourglass-half text-4xl text-slate-700 mb-4"></i>
                <p class="text-slate-500">ข้อมูลการจำลองจะแสดงอีกครั้งหลังสิ้นสุดช่วงห้ามเผยแพร่ผลโพล</p>
            </div>
        `;
        return;
    }

    try {
        if (!db) throw new Error("Database connection not available");

        // Fetch Sim Results ONCE for both sections
        const simSnapshot = await getDocs(collection(db, 'artifacts', appId, 'public', 'data', 'sim_results_v7'));

        const policyCounts = {};
        const winnerCounts = {};
        let totalSims = 0;
        let totalWinners = 0;

        simSnapshot.forEach(doc => {
            const data = doc.data();

            // Process Policies
            if (data.policyChoices && Array.isArray(data.policyChoices)) {
                data.policyChoices.forEach(policy => {
                    const label = policy.label || policy;
                    policyCounts[label] = (policyCounts[label] || 0) + 1;
                });
                totalSims++;
            }

            // Process Winners
            if (data.winner) {
                const partyKey = data.winner;
                if (parties[partyKey]) {
                    winnerCounts[partyKey] = (winnerCounts[partyKey] || 0) + 1;
                    totalWinners++;
                }
            }
        });

        let html = '';

        // Render Policies Section
        if (totalSims > 0) {
            const sortedPolicies = Object.entries(policyCounts).sort((a, b) => b[1] - a[1]);

            html += `
                <div class="w-full">
                    <h3 class="text-xl font-bold text-white mb-2 flex items-center gap-2">
                        <i class="fa-solid fa-list-check text-blue-500"></i> นโยบายที่ผู้เล่นเลือกมากที่สุด
                    </h3>
                    <p class="text-xs text-slate-500 mb-6">จากผู้เล่นทั้งหมด ${totalSims.toLocaleString()} คน</p>
                    <div class="space-y-3">
            `;

            sortedPolicies.forEach(([label, count], index) => {
                const pct = ((count / totalSims) * 100).toFixed(1);
                const pctNum = parseFloat(pct);
                let barColor;
                if (pctNum >= 45) barColor = 'bg-gradient-to-r from-red-500 to-red-600';
                else if (pctNum >= 35) barColor = 'bg-gradient-to-r from-red-400 to-orange-500';
                else if (pctNum >= 28) barColor = 'bg-gradient-to-r from-orange-500 to-orange-600';
                else if (pctNum >= 22) barColor = 'bg-gradient-to-r from-orange-400 to-orange-500';
                else if (pctNum >= 18) barColor = 'bg-gradient-to-r from-amber-500 to-yellow-500';
                else if (pctNum >= 14) barColor = 'bg-gradient-to-r from-yellow-500 to-amber-500';
                else if (pctNum >= 10) barColor = 'bg-gradient-to-r from-lime-500 to-lime-600';
                else if (pctNum >= 6) barColor = 'bg-gradient-to-r from-green-500 to-green-600';
                else barColor = 'bg-gradient-to-r from-emerald-500 to-emerald-600';

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
            html += `</div></div>`;
        }

        // Render Winners Section
        if (totalWinners > 0) {
            const sortedWinners = Object.entries(winnerCounts).sort((a, b) => b[1] - a[1]).slice(0, 20);

            html += `
                <div class="mt-10 w-full pt-10 border-t border-slate-800">
                    <h3 class="text-xl font-bold text-white mb-2 flex items-center gap-2">
                        <i class="fa-solid fa-trophy text-yellow-500"></i> พรรคแรกที่นโยบายตรงใจที่สุด (จากการจำลอง)
                    </h3>
                    <p class="text-xs text-slate-500 mb-6">จากการจำลองทั้งหมด ${totalWinners.toLocaleString()} ครั้ง</p>
                    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            `;

            sortedWinners.forEach(([key, count]) => {
                const p = parties[key];
                const pct = ((count / totalWinners) * 100).toFixed(1);
                html += `
                    <div class="bg-slate-800/50 border border-slate-700 rounded-xl p-4 text-center hover:bg-slate-700/50 transition">
                        <div class="w-12 h-12 mx-auto mb-3 rounded-full bg-slate-900 flex items-center justify-center">
                            <i class="fa-solid ${p.icon} ${p.color} text-xl"></i>
                        </div>
                        <div class="text-lg font-bold ${p.color} mb-1">${p.name}</div>
                        <div class="text-2xl font-extrabold text-white">${count.toLocaleString()}</div>
                        <div class="text-xs text-slate-500">${pct}%</div>
                    </div>
                `;
            });
            html += `</div></div>`;
        }

        if (totalSims === 0 && totalWinners === 0) {
            container.innerHTML = `
                <div class="text-center py-10">
                    <i class="fa-solid fa-box-open text-4xl text-slate-700 mb-4"></i>
                    <p class="text-slate-500">ยังไม่มีข้อมูลการจำลองในระบบ</p>
                </div>
            `;
        } else {
            container.innerHTML = html;
        }

    } catch (e) {
        console.error("Sim Results Fetch Error:", e);
        container.innerHTML = `
            <div class="text-center py-10">
                <i class="fa-solid fa-triangle-exclamation text-4xl text-red-500 mb-4"></i>
                <p class="text-red-400">เกิดข้อผิดพลาดในการโหลดข้อมูลการจำลอง</p>
                <p class="text-xs text-slate-600 mt-2">${e.message}</p>
            </div>
        `;
    }
}

document.addEventListener('DOMContentLoaded', initResults);
