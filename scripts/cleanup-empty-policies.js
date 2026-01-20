import 'dotenv/config';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, deleteDoc } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
    apiKey: process.env.VITE_FIREBASE_API_KEY,
    authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.VITE_FIREBASE_APP_ID,
    measurementId: process.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Validate configuration
if (!firebaseConfig.projectId) {
    console.error('Error: VITE_FIREBASE_PROJECT_ID environment variable is required');
    console.error('Please set the required Firebase environment variables:');
    console.error('  VITE_FIREBASE_API_KEY');
    console.error('  VITE_FIREBASE_AUTH_DOMAIN');
    console.error('  VITE_FIREBASE_PROJECT_ID');
    console.error('  VITE_FIREBASE_STORAGE_BUCKET');
    console.error('  VITE_FIREBASE_MESSAGING_SENDER_ID');
    console.error('  VITE_FIREBASE_APP_ID');
    console.error('  VITE_FIREBASE_MEASUREMENT_ID');
    process.exit(1);
}

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const appId = firebaseConfig.projectId;

async function cleanupEmptyPolicies() {
    console.log('Starting cleanup of empty policy data...');
    console.log(`Project ID: ${appId}`);

    const resultsRef = collection(db, 'artifacts', appId, 'public', 'data', 'sim_results_v7');
    const snapshot = await getDocs(resultsRef);

    let deletedCount = 0;
    let totalCount = 0;
    let emptyCount = 0;

    for (const docSnapshot of snapshot.docs) {
        totalCount++;
        const data = docSnapshot.data();

        // Check if policyChoices is empty, undefined, or has length 0
        const hasNoPolicyChoices = !data.policyChoices || data.policyChoices.length === 0;
        // Also check if choices array is empty (for backward compatibility)
        const hasNoChoices = !data.choices || data.choices.length === 0;

        if (hasNoPolicyChoices && hasNoChoices) {
            emptyCount++;
            await deleteDoc(docSnapshot.ref);
            deletedCount++;
            console.log(`Deleted document: ${docSnapshot.id}`);
        }
    }

    console.log('\n=== Cleanup Summary ===');
    console.log(`Total documents scanned: ${totalCount}`);
    console.log(`Documents with no policies: ${emptyCount}`);
    console.log(`Documents deleted: ${deletedCount}`);
    console.log(`Documents remaining: ${totalCount - deletedCount}`);
}

cleanupEmptyPolicies().catch(error => {
    console.error('Cleanup failed:', error);
    process.exit(1);
});
