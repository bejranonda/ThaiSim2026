// Export All Poll Data to CSV - Using Firebase Client SDK
// This version uses Firebase SDK (same as the website) to avoid REST API rate limits
// Usage: Run this in Node.js environment with dependencies installed

import { config } from 'dotenv';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, orderBy } from 'firebase/firestore';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from project root .env file
config({ path: join(__dirname, '../.env') });

// Firebase configuration - matching src/js/config.js
// Note: Firebase SDK in Node.js uses the same config as browser

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

console.log('🚀 Starting poll data export (using Firebase SDK)...');

// Helper function to get party name
function getPartyName(partyId) {
    return parties[partyId]?.name || partyId;
}

// Helper function to escape CSV values
function escapeCsv(value) {
    if (value === null || value === undefined) return '';
    const str = String(value);
    // Escape quotes by doubling them and wrap in quotes if contains comma, quote or newline
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
}

// Helper function to format timestamp
function formatTimestamp(timestamp) {
    if (!timestamp) return '';
    if (timestamp.toDate) {
        return timestamp.toDate().toISOString();
    }
    if (timestamp.seconds) {
        return new Date(timestamp.seconds * 1000).toISOString();
    }
    return String(timestamp);
}

// Export Poll Votes
async function exportPollVotes(db, projectId, exportsDir) {
    console.log('\n📊 Exporting Poll Votes...');
    const collectionPath = `artifacts/${projectId}/public/data/poll_votes_v7`;

    const querySnapshot = await getDocs(collection(db, collectionPath));

    if (querySnapshot.empty) {
        console.log('⚠️ No poll votes found');
        return null;
    }

    console.log(`📈 Found ${querySnapshot.size} poll votes`);

    // Generate CSV content
    const rows = [
        ['Timestamp', 'Party', 'Party Name'],
        ...querySnapshot.docs.map(doc => {
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
    const filename = join(exportsDir, `poll_votes_${timestamp}.csv`);
    writeFileSync(filename, finalContent, 'utf8');

    console.log(`✅ Poll votes saved: ${filename}`);
    console.log(`📊 Total poll votes exported: ${querySnapshot.size}`);

    return { filename, count: querySnapshot.size };
}

// Export Simulation Results with batching for large collections
async function exportSimResults(db, projectId, exportsDir) {
    console.log('\n📊 Exporting Simulation Results...');
    const collectionPath = `artifacts/${projectId}/public/data/sim_results_v7`;

    // For large collections, we need to fetch in batches
    console.log('   📥 Fetching simulation results (this may take a while for large datasets)...');

    let allDocs = [];
    let querySnapshot = await getDocs(collection(db, collectionPath));

    // Collect all documents
    querySnapshot.forEach(doc => allDocs.push(doc));

    console.log(`   📥 Fetched ${allDocs.length} documents...`);

    if (allDocs.length === 0) {
        console.log('⚠️ No simulation results found');
        return null;
    }

    console.log(`📈 Found ${allDocs.length} simulation results`);

    // Generate CSV content
    const rows = [
        ['Timestamp', 'Winner', 'Party Name', 'Policy Choices', 'Eco', 'Soc', 'Lib', 'Budget'],
        ...allDocs.map(doc => {
            const data = doc.data();
            const winner = data.winner || '';
            const partyName = getPartyName(winner);
            const timestamp = formatTimestamp(data.timestamp);

            // Extract policy choices
            let policyChoices = '';
            if (data.choices && Array.isArray(data.choices)) {
                policyChoices = data.choices.join('|');
            } else if (data.policyChoices && Array.isArray(data.policyChoices)) {
                policyChoices = data.policyChoices
                    .map(c => c.label || '')
                    .filter(Boolean)
                    .join('|');
            }

            // Extract stats
            const stats = data.stats || {};
            const eco = stats.eco ?? '';
            const soc = stats.soc ?? '';
            const lib = stats.lib ?? '';
            const budget = stats.budget ?? '';

            return [timestamp, winner, partyName, policyChoices, eco, soc, lib, budget].map(escapeCsv).join(',');
        })
    ];

    const csvContent = rows.join('\n');
    const BOM = '\uFEFF';
    const finalContent = BOM + csvContent;

    // Save to file
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    const filename = join(exportsDir, `sim_results_${timestamp}.csv`);
    writeFileSync(filename, finalContent, 'utf8');

    console.log(`✅ Simulation results saved: ${filename}`);
    console.log(`📊 Total simulation results exported: ${allDocs.length}`);

    return { filename, count: allDocs.length };
}

// Main function
async function main() {
    try {
        // Check if we have Firebase config from environment
        if (!process.env.VITE_FIREBASE_API_KEY) {
            console.error('❌ Firebase configuration not found in environment variables');
            console.error('💡 Please create a .env file with Firebase configuration');
            console.error('💡 Copy .env.example to .env and fill in your Firebase credentials');
            return;
        }

        console.log('🔧 Using Firebase configuration from .env file');
        console.log('📱 Using project ID:', process.env.VITE_FIREBASE_PROJECT_ID);

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

        // Export both collections (with separate error handling)
        let pollVotesResult = null;
        let simResultsResult = null;

        try {
            pollVotesResult = await exportPollVotes(db, projectId, exportsDir);
        } catch (error) {
            console.log(`\n⚠️  Poll Votes export failed: ${error.message}`);
        }

        try {
            simResultsResult = await exportSimResults(db, projectId, exportsDir);
        } catch (error) {
            console.log(`\n⚠️  Simulation Results export failed: ${error.message}`);
            console.log(`💡 Try running: node export_sim_results_batched.js`);
        }

        // Print summary
        console.log('\n' + '='.repeat(50));
        console.log('📊 EXPORT SUMMARY');
        console.log('='.repeat(50));
        if (pollVotesResult) {
            console.log(`✅ Poll Votes: ${pollVotesResult.count} records → ${pollVotesResult.filename}`);
        } else {
            console.log(`⚠️ Poll Votes: Failed or no data`);
        }
        if (simResultsResult) {
            console.log(`✅ Simulation Results: ${simResultsResult.count} records → ${simResultsResult.filename}`);
        } else {
            console.log(`⚠️ Simulation Results: Failed (try export_sim_results_batched.js)`);
        }
        console.log('='.repeat(50));

        if (pollVotesResult || simResultsResult) {
            console.log('\n✨ Export completed!');
        } else {
            console.log('\n❌ Export failed - see errors above');
        }

    } catch (error) {
        console.error('\n❌ Export failed:', error.message);
        console.error(error);

        if (error.message.includes('permission-denied')) {
            console.log('\n🔒 Permission denied. This usually means:');
            console.log('   1. The Firebase database rules don\'t allow reading');
            console.log('   2. Check your Firebase security rules');
        } else if (error.code === 'unavailable') {
            console.log('\n🔒 Firebase is unavailable. This might mean:');
            console.log('   1. The Firebase project is not found or does not exist');
            console.log('   2. Firestore is not enabled for this project');
        } else {
            console.log('\n💡 General troubleshooting steps:');
            console.log('   1. Check your .env file configuration');
            console.log('   2. Verify the Firebase project ID is correct');
            console.log('   3. Check your internet connection');
            console.log('   4. Make sure Firestore is enabled in Firebase Console');
        }
    }
}

// Run the main function
main();
