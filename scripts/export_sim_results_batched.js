// Export Simulation Results in batches (using REST API with pagination)
// This version uses Firebase REST API with proper pagination to handle large collections
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

console.log('🚀 Starting simulation results export (batched mode)...');

// Helper function to get party name
function getPartyName(partyId) {
    return parties[partyId]?.name || partyId;
}

// Helper function to format Firestore timestamp
function formatTimestamp(timestampField) {
    if (!timestampField) return '';
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
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
}

// Helper function to fetch documents with pagination and retry
async function fetchAllDocuments(baseUrl, collectionPath, apiKey) {
    const allDocuments = [];
    let pageToken = '';
    let batchCount = 0;
    const maxBatches = 100; // Safety limit
    const delayBetweenBatches = 500; // 500ms delay between batches to avoid rate limiting

    console.log('   📥 Fetching data in batches (this may take a while)...');

    do {
        batchCount++;
        if (batchCount > maxBatches) {
            console.log(`   ⚠️  Reached maximum batch limit (${maxBatches}). Stopping.`);
            break;
        }

        const url = `${baseUrl}${collectionPath}?pageSize=500${pageToken ? `&pageToken=${pageToken}` : ''}&key=${apiKey}`;

        try {
            const response = await fetch(url);

            if (!response.ok) {
                if (response.status === 429) {
                    console.log(`   ⏳ Rate limited. Waiting 2 seconds...`);
                    await new Promise(resolve => setTimeout(resolve, 2000));
                    continue; // Retry this batch
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (data.documents) {
                allDocuments.push(...data.documents);
                console.log(`   📄 Batch ${batchCount}: ${data.documents.length} documents (total: ${allDocuments.length})`);
            }

            pageToken = data.nextPageToken || '';

            // Add small delay between batches to avoid rate limiting
            if (pageToken && batchCount < maxBatches) {
                await new Promise(resolve => setTimeout(resolve, delayBetweenBatches));
            }

        } catch (error) {
            console.log(`   ⚠️  Error in batch ${batchCount}: ${error.message}`);
            // Continue with what we have
            break;
        }

    } while (pageToken);

    return allDocuments;
}

// Main function
async function main() {
    try {
        if (!process.env.VITE_FIREBASE_API_KEY) {
            console.error('❌ Firebase configuration not found in environment variables');
            console.error('💡 Please create a .env file with Firebase configuration');
            return;
        }

        console.log('🔧 Using Firebase configuration from .env file');
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
        const collectionPath = `/artifacts/${projectId}/public/data/sim_results_v7`;

        console.log('\n📊 Exporting Simulation Results...');

        const documents = await fetchAllDocuments(baseUrl, collectionPath, apiKey);

        if (documents.length === 0) {
            console.log('⚠️ No simulation results found');
            return;
        }

        console.log(`\n📈 Found ${documents.length} simulation results`);
        console.log('   📝 Generating CSV...');

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

        console.log(`\n✅ Simulation results saved: ${filename}`);
        console.log(`📊 Total simulation results exported: ${documents.length}`);

    } catch (error) {
        console.error('\n❌ Export failed:', error.message);
    }
}

// Run the main function
main();
