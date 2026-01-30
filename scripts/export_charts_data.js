// Export Charts Data - Matching Results Page Charts
// Exports data that matches exactly what's displayed in the results page charts
// Usage: Run this in Node.js environment with dependencies installed

import { config } from 'dotenv';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from project root .env file
config({ path: join(__dirname, '../.env') });

// Firebase configuration
const firebaseConfig = {
    apiKey: process.env.VITE_FIREBASE_API_KEY || '',
    authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN || '',
    projectId: process.env.VITE_FIREBASE_PROJECT_ID || 'thaisim2569',
    storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET || '',
    messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
    appId: process.env.VITE_FIREBASE_APP_ID || '',
    measurementId: process.env.VITE_FIREBASE_MEASUREMENT_ID || ''
};

// Party data - matching src/js/data.js
const parties = {
    "PP": { name: "ประชาชน" },
    "PTP": { name: "เพื่อไทย" },
    "BJT": { name: "ภูมิใจไทย" },
    "UTN": { name: "รวมไทยสร้างชาติ" },
    "DEM": { name: "ประชาธิปัตย์" },
    "PPRP": { name: "พลังประชารัฐ" },
    "KLA": { name: "กล้าธรรม" },
    "PCC": { name: "ประชาชาติ" },
    "CTP": { name: "ชาติไทยพัฒนา" },
    "TST": { name: "ไทยสร้างไทย" },
    "CP": { name: "ชาติพัฒนา" },
    "SRT": { name: "เสรีรวมไทย" },
    "FAIR": { name: "เป็นธรรม" },
    "RAK": { name: "รักชาติ" },
    "TKM": { name: "ไทยก้าวใหม่" },
    "OKM": { name: "โอกาสใหม่" },
    "ECO": { name: "เศรษฐกิจ" },
    "NAP": { name: "ทางเลือกใหม่" }
};

console.log('📊 Starting charts data export...');

// Helper function to get party name
function getPartyName(partyId) {
    return parties[partyId]?.name || partyId;
}

// Helper function to escape CSV values
function escapeCsv(value) {
    if (value === null || value === undefined) return '';
    const str = String(value);
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
}

// Helper function to format timestamp
function formatTimestamp(timestamp) {
    if (!timestamp) return '';
    if (timestamp.toDate) {
        return timestamp.toDate().toISOString().split('T')[0];
    }
    if (timestamp instanceof Date) {
        return timestamp.toISOString().split('T')[0];
    }
    if (timestamp.seconds) {
        return new Date(timestamp.seconds * 1000).toISOString().split('T')[0];
    }
    return '';
}

// Get color category for policy statistics (matching results.js)
function getColorCategory(percentage) {
    if (percentage >= 45) return 'Red (>=45%)';
    if (percentage >= 35) return 'Red-Orange (35-45%)';
    if (percentage >= 28) return 'Orange (28-35%)';
    if (percentage >= 22) return 'Orange-Light (22-28%)';
    if (percentage >= 18) return 'Amber (18-22%)';
    if (percentage >= 14) return 'Yellow (14-18%)';
    if (percentage >= 10) return 'Lime (10-14%)';
    if (percentage >= 6) return 'Green (6-10%)';
    return 'Emerald (<6%)';
}

// Export Poll Votes by Party (matching Party Vote Rankings)
async function exportPollVotesByParty(db, projectId, exportsDir) {
    console.log('\n📊 Exporting Poll Votes by Party...');
    const collectionPath = `artifacts/${projectId}/public/data/poll_votes_v7`;

    const querySnapshot = await getDocs(collection(db, collectionPath));

    if (querySnapshot.empty) {
        console.log('⚠️ No poll votes found');
        return null;
    }

    // Count votes by party (matching loadPollVotes logic)
    const counts = {};
    let total = 0;

    querySnapshot.forEach(doc => {
        const data = doc.data();
        const v = data.vote;
        counts[v] = (counts[v] || 0) + 1;
        total++;
    });

    // Sort by count descending
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);

    console.log(`📈 Found ${total} poll votes across ${sorted.length} parties`);

    // Generate CSV content
    const rows = [
        ['Rank', 'Party ID', 'Party Name', 'Vote Count', 'Percentage'],
        ...sorted.map(([key, count], index) => {
            const p = parties[key] || { name: key === 'OTHER' ? 'พรรคอื่นๆ' : 'ไม่ประสงค์ลงคะแนน' };
            const pct = ((count / total) * 100).toFixed(1);
            return [index + 1, key, p.name, count, `${pct}%`].map(escapeCsv).join(',');
        })
    ];

    const csvContent = rows.join('\n');
    const BOM = '\uFEFF';
    const finalContent = BOM + csvContent;

    // Save to file
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    const filename = join(exportsDir, `poll_votes_by_party_${timestamp}.csv`);
    writeFileSync(filename, finalContent, 'utf8');

    console.log(`✅ Poll votes by party saved: ${filename}`);

    return { filename, count: total };
}

// Export Daily Trends (matching Daily Trends Chart - Line Chart)
async function exportDailyTrends(db, projectId, exportsDir) {
    console.log('\n📊 Exporting Daily Trends...');
    const collectionPath = `artifacts/${projectId}/public/data/poll_votes_v7`;

    const querySnapshot = await getDocs(collection(db, collectionPath));

    if (querySnapshot.empty) {
        console.log('⚠️ No poll votes found');
        return null;
    }

    // Process timeline data (matching loadPollVotes logic)
    const dailyData = {}; // { 'YYYY-MM-DD': { 'PARTY_ID': count } }
    const allDates = new Set();
    const allParties = new Set();

    // First pass: collect all votes by date and party
    const partyTotals = {}; // For determining top 10

    querySnapshot.forEach(doc => {
        const data = doc.data();
        const v = data.vote;

        // Count party totals for ranking
        partyTotals[v] = (partyTotals[v] || 0) + 1;

        // Process timeline data
        if (data.timestamp) {
            const dateStr = formatTimestamp(data.timestamp);
            if (dateStr) {
                allDates.add(dateStr);
                allParties.add(v);
                if (!dailyData[dateStr]) dailyData[dateStr] = {};
                dailyData[dateStr][v] = (dailyData[dateStr][v] || 0) + 1;
            }
        }
    });

    if (allDates.size === 0) {
        console.log('⚠️ No timestamp data found');
        return null;
    }

    // Sort parties by total votes and take top 10 (matching renderVoteTrendChart logic)
    const sortedParties = Object.entries(partyTotals)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([key]) => key);

    const sortedDates = Array.from(allDates).sort();

    console.log(`📈 Found ${sortedDates.length} dates, top ${sortedParties.length} parties`);

    // Generate CSV content (pivot table format)
    const header = ['Date', ...sortedParties];
    const rows = [header];

    sortedDates.forEach(date => {
        const row = [date];
        sortedParties.forEach(partyKey => {
            row.push(dailyData[date][partyKey] || 0);
        });
        rows.push(row.map(escapeCsv).join(','));
    });

    const csvContent = rows.join('\n');
    const BOM = '\uFEFF';
    const finalContent = BOM + csvContent;

    // Save to file
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    const filename = join(exportsDir, `daily_trends_${timestamp}.csv`);
    writeFileSync(filename, finalContent, 'utf8');

    console.log(`✅ Daily trends saved: ${filename}`);

    return { filename, count: sortedDates.length };
}

// Export Policy Statistics (matching Policy Preferences)
async function exportPolicyStatistics(db, projectId, exportsDir) {
    console.log('\n📊 Exporting Policy Statistics...');
    const collectionPath = `artifacts/${projectId}/public/data/sim_results_v7`;

    const querySnapshot = await getDocs(collection(db, collectionPath));

    if (querySnapshot.empty) {
        console.log('⚠️ No simulation results found');
        return null;
    }

    // Count policy choices (matching loadSimResults logic)
    const policyCounts = {};
    let totalSims = 0;

    querySnapshot.forEach(doc => {
        const data = doc.data();
        if (data.policyChoices && Array.isArray(data.policyChoices)) {
            data.policyChoices.forEach(policy => {
                const label = policy.label || policy;
                policyCounts[label] = (policyCounts[label] || 0) + 1;
            });
            totalSims++;
        }
    });

    // Sort by count descending
    const sortedPolicies = Object.entries(policyCounts).sort((a, b) => b[1] - a[1]);

    console.log(`📈 Found ${totalSims} simulations, ${sortedPolicies.length} unique policies`);

    // Generate CSV content
    const rows = [
        ['Rank', 'Policy Name', 'Count', 'Percentage'],
        ...sortedPolicies.map(([label, count], index) => {
            const pct = ((count / totalSims) * 100).toFixed(1);
            return [index + 1, label, count, `${pct}%`].map(escapeCsv).join(',');
        })
    ];

    const csvContent = rows.join('\n');
    const BOM = '\uFEFF';
    const finalContent = BOM + csvContent;

    // Save to file
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    const filename = join(exportsDir, `policy_statistics_${timestamp}.csv`);
    writeFileSync(filename, finalContent, 'utf8');

    console.log(`✅ Policy statistics saved: ${filename}`);

    return { filename, count: sortedPolicies.length };
}

// Export Party Winners (matching Party Match Winners)
async function exportPartyWinners(db, projectId, exportsDir) {
    console.log('\n📊 Exporting Party Winners...');
    const collectionPath = `artifacts/${projectId}/public/data/sim_results_v7`;

    const querySnapshot = await getDocs(collection(db, collectionPath));

    if (querySnapshot.empty) {
        console.log('⚠️ No simulation results found');
        return null;
    }

    // Count winners (matching loadSimResults logic)
    const winnerCounts = {};
    let totalWinners = 0;

    querySnapshot.forEach(doc => {
        const data = doc.data();
        if (data.winner) {
            const partyKey = data.winner;
            if (parties[partyKey]) {
                winnerCounts[partyKey] = (winnerCounts[partyKey] || 0) + 1;
                totalWinners++;
            }
        }
    });

    // Sort by count descending and take top 20 (matching results.js)
    const sortedWinners = Object.entries(winnerCounts).sort((a, b) => b[1] - a[1]).slice(0, 20);

    console.log(`📈 Found ${totalWinners} total winners, top ${sortedWinners.length} parties`);

    // Generate CSV content
    const rows = [
        ['Rank', 'Party ID', 'Party Name', 'Win Count', 'Percentage'],
        ...sortedWinners.map(([key, count], index) => {
            const p = parties[key] || { name: key };
            const pct = ((count / totalWinners) * 100).toFixed(1);
            return [index + 1, key, p.name, count, `${pct}%`].map(escapeCsv).join(',');
        })
    ];

    const csvContent = rows.join('\n');
    const BOM = '\uFEFF';
    const finalContent = BOM + csvContent;

    // Save to file
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    const filename = join(exportsDir, `party_winners_${timestamp}.csv`);
    writeFileSync(filename, finalContent, 'utf8');

    console.log(`✅ Party winners saved: ${filename}`);

    return { filename, count: sortedWinners.length };
}

// Export Raw Poll Votes with Timestamps (individual vote records)
async function exportRawPollVotes(db, projectId, exportsDir) {
    console.log('\n📊 Exporting Raw Poll Votes (with timestamps)...');
    const collectionPath = `artifacts/${projectId}/public/data/poll_votes_v7`;

    const querySnapshot = await getDocs(collection(db, collectionPath));

    if (querySnapshot.empty) {
        console.log('⚠️ No poll votes found');
        return null;
    }

    console.log(`📈 Found ${querySnapshot.size} raw poll vote records`);

    // Generate CSV content with all individual vote records
    const rows = [
        ['Timestamp', 'Party ID', 'Party Name'],
        ...Array.from(querySnapshot.docs).map(doc => {
            const data = doc.data();
            const vote = data.vote || '';
            const timestamp = formatTimestamp(data.timestamp);
            const partyName = getPartyName(vote);
            return [timestamp, vote, partyName].map(escapeCsv).join(',');
        })
    ];

    const csvContent = rows.join('\n');
    const BOM = '\uFEFF';
    const finalContent = BOM + csvContent;

    // Save to file
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    const filename = join(exportsDir, `raw_poll_votes_${timestamp}.csv`);
    writeFileSync(filename, finalContent, 'utf8');

    console.log(`✅ Raw poll votes saved: ${filename}`);

    return { filename, count: querySnapshot.size };
}

// Main function
async function main() {
    try {
        // Check if we have Firebase config from environment
        if (!process.env.VITE_FIREBASE_API_KEY) {
            console.error('❌ Firebase configuration not found in environment variables');
            console.error('💡 Please create a .env file with Firebase configuration');
            return;
        }

        console.log('🔧 Using Firebase configuration from .env file');
        console.log('📱 Using project ID:', process.env.VITE_FIREBASE_PROJECT_ID || 'thaisim2569');

        // Initialize Firebase
        const app = initializeApp(firebaseConfig);
        const db = getFirestore(app);

        // Create exports directory if it doesn't exist
        const exportsDir = join(__dirname, '../exports');
        if (!existsSync(exportsDir)) {
            mkdirSync(exportsDir, { recursive: true });
            console.log(`📁 Created exports directory: ${exportsDir}`);
        }

        const projectId = process.env.VITE_FIREBASE_PROJECT_ID || 'thaisim2569';

        // Export all charts data (with separate error handling)
        const results = {};

        try {
            results.pollVotes = await exportPollVotesByParty(db, projectId, exportsDir);
        } catch (error) {
            console.log(`\n⚠️  Poll Votes by Party export failed: ${error.message}`);
        }

        try {
            results.dailyTrends = await exportDailyTrends(db, projectId, exportsDir);
        } catch (error) {
            console.log(`\n⚠️  Daily Trends export failed: ${error.message}`);
        }

        try {
            results.policyStats = await exportPolicyStatistics(db, projectId, exportsDir);
        } catch (error) {
            console.log(`\n⚠️  Policy Statistics export failed: ${error.message}`);
        }

        try {
            results.partyWinners = await exportPartyWinners(db, projectId, exportsDir);
        } catch (error) {
            console.log(`\n⚠️  Party Winners export failed: ${error.message}`);
        }

        try {
            results.rawPollVotes = await exportRawPollVotes(db, projectId, exportsDir);
        } catch (error) {
            console.log(`\n⚠️  Raw Poll Votes export failed: ${error.message}`);
        }

        // Print summary
        console.log('\n' + '='.repeat(50));
        console.log('📊 EXPORT SUMMARY');
        console.log('='.repeat(50));
        console.log(`✅ Poll Votes by Party: ${results.pollVotes ? '✓' : '✗'}`);
        console.log(`✅ Daily Trends: ${results.dailyTrends ? '✓' : '✗'}`);
        console.log(`✅ Policy Statistics: ${results.policyStats ? '✓' : '✗'}`);
        console.log(`✅ Party Winners: ${results.partyWinners ? '✓' : '✗'}`);
        console.log(`✅ Raw Poll Votes: ${results.rawPollVotes ? '✓' : '✗'}`);
        console.log('='.repeat(50));
        console.log('\n✨ Export completed!');
        console.log('💡 Files saved to: exports/');

    } catch (error) {
        console.error('\n❌ Export failed:', error.message);
        console.error(error);
    }
}

// Run the main function
main();
