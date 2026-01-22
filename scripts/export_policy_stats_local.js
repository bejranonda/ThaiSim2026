// Export Policy Statistics to CSV - Local Version with .env support
// This version uses environment variables from .env file
// Usage: Run this in Node.js environment with dotenv installed

import dotenv from 'dotenv';
import { writeFileSync } from 'fs';

// Load environment variables from project root .env file
dotenv.config({ path: '../.env' });

console.log('🚀 Starting policy statistics export...');

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
        console.log('📊 Fetching policy data from Firestore...');

        // Use Firebase REST API to get data with proper API key
        const baseUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents`;
        const collectionUrl = `${baseUrl}/artifacts/${projectId}/public/data/sim_results_v7`;

        const apiKey = process.env.VITE_FIREBASE_API_KEY;
        const response = await fetch(`${collectionUrl}?pageSize=1000&key=${apiKey}`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const policyCounts = {};
        let totalSims = 0;

        // Process documents with correct data structure
        console.log('📋 Processing documents...');

        if (data.documents && data.documents.length > 0) {
            data.documents.forEach((doc) => {
                const fields = doc.fields;

                // Check if policyChoices exists and is an array
                if (fields.policyChoices && fields.policyChoices.arrayValue) {
                    const policyChoices = fields.policyChoices.arrayValue.values || [];

                    policyChoices.forEach(policy => {
                        // Extract label from the mapValue structure
                        const label = policy.mapValue?.fields?.label?.stringValue || 'Unknown Policy';
                        policyCounts[label] = (policyCounts[label] || 0) + 1;
                    });
                    totalSims++;
                }
            });
        } else {
            console.log('No documents found in the collection');
            return;
        }

        if (totalSims === 0) {
            console.log('⚠️ No simulation data found');
            return;
        }

        console.log(`📈 Found ${totalSims.toLocaleString()} simulations with ${Object.keys(policyCounts).length} unique policies`);
        console.log('Top policies:', Object.entries(policyCounts).sort((a, b) => b[1] - a[1]).slice(0, 5));

        // Sort policies by count (descending)
        const sortedPolicies = Object.entries(policyCounts)
            .sort((a, b) => b[1] - a[1]);

        // Generate CSV content
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
        const csvContent = [
            // Header
            ['Rank', 'Policy Name', 'Count', 'Percentage'].join(','),
            '',
            // Data rows
            ...sortedPolicies.map(([label, count], index) => {
                const percentage = ((count / totalSims) * 100).toFixed(1);
                const csvLabel = `"${label.replace(/"/g, '""')}"`; // Escape quotes
                return [
                    index + 1,
                    csvLabel,
                    count.toString(), // Use toString instead of toLocaleString
                    `${percentage}%`
                ].join(',');
            })
        ].join('\n');

        // Add BOM for Excel compatibility
        const BOM = '\uFEFF';
        const finalContent = BOM + csvContent;

        // Save to file
        const filename = `policy_stats_${timestamp}.csv`;

        // Write to file using ES modules
        writeFileSync(filename, finalContent, 'utf8');

        console.log(`✅ CSV saved: ${filename}`);
        console.log(`📊 Total policies exported: ${sortedPolicies.length}`);
        console.log(`🏆 Top policy: ${sortedPolicies[0][0]} (${sortedPolicies[0][1]} votes)`);

        // Show progress summary
        console.group('📊 Export Summary');
        console.log(`Total simulations: ${totalSims.toLocaleString()}`);
        console.log(`Unique policies: ${Object.keys(policyCounts).length}`);
        console.log(`Average selections per policy: ${(totalSims / Object.keys(policyCounts).length).toFixed(1)}`);
        console.log(`File saved to: ${process.cwd()}/${filename}`);
        console.groupEnd();

    } catch (error) {
        console.error('❌ Export failed:', error.message);

        if (error.message.includes('permission-denied')) {
            console.log('🔒 Permission denied. This usually means:');
            console.log('   1. The Firebase database rules don\'t allow public reading');
            console.log('   2. Check your Firebase security rules');
            console.log('   3. Make sure Firestore is in test mode for public access');
        } else if (error.message.includes('not-found')) {
            console.log('🔍 Collection not found. The collection name might have changed.');
            console.log('💡 Check if "sim_results_v7" collection exists in your Firebase database.');
        } else {
            console.log('💡 General troubleshooting steps:');
            console.log('   1. Check your .env file configuration');
            console.log('   2. Verify the Firebase project ID is correct');
            console.log('   3. Check your internet connection');
            console.log('   4. Make sure Firestore is enabled in Firebase Console');
        }
    }
}

// Run the main function
main();