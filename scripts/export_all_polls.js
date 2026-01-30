// Export All Poll Data to CSV - Poll Votes and Simulation Results
// This version uses environment variables from .env file
// Usage: Run this in Node.js environment with dotenv installed

import dotenv from 'dotenv';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from project root .env file
dotenv.config({ path: join(__dirname, '../.env') });

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

console.log('🚀 Starting poll data export...');

// Helper function to get party name
function getPartyName(partyId) {
    return parties[partyId]?.name || partyId;
}

// Helper function to format Firestore timestamp
function formatTimestamp(timestampField) {
    if (!timestampField) return '';
    // Firestore timestamp can be in different formats
    if (timestampField.timestampValue) {
        return timestampField.timestampValue;
    }
    if (timestampField.stringValue) {
        return timestampField.stringValue;
    }
    if (timestampField.integerValue) {
        return new Date(parseInt(timestampField.integerValue) * 1000).toISOString();
    }
    return '';
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

// Helper function to fetch all documents from a collection with pagination
async function fetchAllDocuments(baseUrl, collectionPath, apiKey) {
    const allDocuments = [];
    let pageToken = '';

    do {
        const url = `${baseUrl}${collectionPath}?pageSize=1000${pageToken ? `&pageToken=${pageToken}` : ''}&key=${apiKey}`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.documents) {
            allDocuments.push(...data.documents);
        }

        pageToken = data.nextPageToken || '';
        console.log(`   📄 Fetched ${data.documents?.length || 0} documents (total: ${allDocuments.length})`);

    } while (pageToken);

    return allDocuments;
}

// Export Poll Votes
async function exportPollVotes(projectId, baseUrl, apiKey, exportsDir) {
    console.log('\n📊 Exporting Poll Votes...');
    const collectionPath = `/artifacts/${projectId}/public/data/poll_votes_v7`;

    const documents = await fetchAllDocuments(baseUrl, collectionPath, apiKey);

    if (documents.length === 0) {
        console.log('⚠️ No poll votes found');
        return null;
    }

    console.log(`📈 Found ${documents.length} poll votes`);

    // Generate CSV content
    const rows = [
        ['Timestamp', 'Party', 'Party Name'],
        ...documents.map(doc => {
            const fields = doc.fields || {};
            const vote = fields.vote?.stringValue || '';
            const timestamp = formatTimestamp(fields.timestamp || fields.createTime);
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
    console.log(`📊 Total poll votes exported: ${documents.length}`);

    return { filename, count: documents.length };
}

// Export Simulation Results
async function exportSimResults(projectId, baseUrl, apiKey, exportsDir) {
    console.log('\n📊 Exporting Simulation Results...');
    const collectionPath = `/artifacts/${projectId}/public/data/sim_results_v7`;

    const documents = await fetchAllDocuments(baseUrl, collectionPath, apiKey);

    if (documents.length === 0) {
        console.log('⚠️ No simulation results found');
        return null;
    }

    console.log(`📈 Found ${documents.length} simulation results`);

    // Generate CSV content
    const rows = [
        ['Timestamp', 'Winner', 'Party Name', 'Policy Choices', 'Eco', 'Soc', 'Lib', 'Budget'],
        ...documents.map(doc => {
            const fields = doc.fields || {};
            const winner = fields.winner?.stringValue || '';
            const partyName = getPartyName(winner);
            const timestamp = formatTimestamp(fields.timestamp || fields.createTime);

            // Extract policy choices
            let policyChoices = '';
            if (fields.choices && fields.choices.arrayValue) {
                const choices = fields.choices.arrayValue.values || [];
                policyChoices = choices
                    .map(c => c.stringValue)
                    .filter(Boolean)
                    .join('|');
            } else if (fields.policyChoices && fields.policyChoices.arrayValue) {
                const choices = fields.policyChoices.arrayValue.values || [];
                policyChoices = choices
                    .map(c => c.mapValue?.fields?.label?.stringValue || '')
                    .filter(Boolean)
                    .join('|');
            }

            // Extract stats
            const stats = fields.stats?.mapValue?.fields || {};
            const eco = stats.eco?.integerValue || stats.eco?.doubleValue || '';
            const soc = stats.soc?.integerValue || stats.soc?.doubleValue || '';
            const lib = stats.lib?.integerValue || stats.lib?.doubleValue || '';
            const budget = stats.budget?.integerValue || stats.budget?.doubleValue || '';

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
    console.log(`📊 Total simulation results exported: ${documents.length}`);

    return { filename, count: documents.length };
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

        // Use a simple REST API approach to avoid Firebase SDK issues
        const projectId = process.env.VITE_FIREBASE_PROJECT_ID || 'thaisim2569';

        console.log('📱 Using project ID:', projectId);

        // Create exports directory if it doesn't exist
        const exportsDir = join(__dirname, '../exports');
        if (!existsSync(exportsDir)) {
            mkdirSync(exportsDir, { recursive: true });
            console.log(`📁 Created exports directory: ${exportsDir}`);
        }

        const baseUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents`;
        const apiKey = process.env.VITE_FIREBASE_API_KEY;

        // Export both collections
        const pollVotesResult = await exportPollVotes(projectId, baseUrl, apiKey, exportsDir);
        const simResultsResult = await exportSimResults(projectId, baseUrl, apiKey, exportsDir);

        // Print summary
        console.log('\n' + '='.repeat(50));
        console.log('📊 EXPORT SUMMARY');
        console.log('='.repeat(50));
        if (pollVotesResult) {
            console.log(`✅ Poll Votes: ${pollVotesResult.count} records → ${pollVotesResult.filename}`);
        } else {
            console.log(`⚠️ Poll Votes: No data found`);
        }
        if (simResultsResult) {
            console.log(`✅ Simulation Results: ${simResultsResult.count} records → ${simResultsResult.filename}`);
        } else {
            console.log(`⚠️ Simulation Results: No data found`);
        }
        console.log('='.repeat(50));
        console.log('\n✨ Export completed successfully!');

    } catch (error) {
        console.error('\n❌ Export failed:', error.message);

        if (error.message.includes('permission-denied')) {
            console.log('\n🔒 Permission denied. This usually means:');
            console.log('   1. The Firebase database rules don\'t allow public reading');
            console.log('   2. Check your Firebase security rules');
            console.log('   3. Make sure Firestore is in test mode for public access');
        } else if (error.message.includes('not-found') || error.message.includes('404')) {
            console.log('\n🔍 Collection not found. This might mean:');
            console.log('   1. The collection name has changed');
            console.log('   2. The collection path is incorrect');
            console.log('   3. Check if the collections exist in your Firebase database');
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
