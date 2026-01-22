# Export Policy Statistics Script

Created to export "Most Selected Policies" data from Firebase Firestore to a CSV file.

## Available Scripts

- `export_policy_stats_local.js` - Local version with .env support (RECOMMENDED)
- `cleanup-empty-policies.js` - Utility script for cleaning up empty policies
- `debug_data.js` - Debug script for analyzing Firestore data structure (for development)

## How to Use

### Local Version with .env (Recommended)
This script works in a Node.js environment with Firebase configuration from .env file.

1. **Install dependencies:**
   ```bash
   npm install dotenv
   ```

2. **Configure .env file:**
   - The script automatically reads Firebase configuration from `../.env`
   - No manual .env creation needed if using the project root .env

3. **Run the script:**
   ```bash
   node export_policy_stats_local.js
   ```

4. **CSV file will be saved** in the current directory with name:
   `policy_stats_{timestamp}.csv`

## Output

CSV file format:
```csv
Rank,Policy Name,Count,Percentage
1,"คืนครูให้นักเรียน",111,73.5%
2,"ยกเลิกเกณฑ์ทหาร",97,64.2%
3,"ทักษะอนาคต (Wellness/Tech)",94,62.3%
...
```

## Notes

- The script fetches data from the `sim_results_v7` collection in Firebase
- Data is sorted by the most selected policies
- The CSV file includes BOM for proper Thai character display in Excel on Windows
- Firebase configuration is loaded securely from project root .env file
- Uses Firebase REST API for reliable data fetching
- Processes Firestore's nested map structure for policy choices

## Error Handling

If errors occur:
- `Firebase configuration not found` - Check your .env file in the project root
- `permission-denied` - Check Firebase security rules and make sure Firestore is in test mode
- `not-found` - The collection name might have changed
- `HTTP error! status: 404` - Verify the Firebase project ID and collection path
- General issues - Check your internet connection and ensure Firestore is enabled

## How to Use

### Local Version with .env (Recommended)
This script works in a Node.js environment with Firebase configuration from .env file.

1. **Install dependencies:**
   ```bash
   npm install dotenv
   ```

2. **Create .env file:**
   ```bash
   cp .env.example .env
   ```
   Edit the .env file with your Firebase credentials

3. **Run the script:**
   ```bash
   node export_policy_stats_local.js
   ```

4. **CSV file will be saved** in the current directory with name:
   `policy_stats_{timestamp}.csv`

## Environment Variables

Create a `.env` file based on `.env.example`:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

## Output

CSV file format:
```csv
Rank,Policy Name,Count,Percentage
1,"ดิจิทัลวอลเล็ต / รัฐร่วมจ่าย",1234,45.2%
2,"10,000 บาทดิจิทัล",987,36.1%
...
```

## Notes

- The script fetches data from the `sim_results_v7` collection in Firebase
- Data is sorted by the most selected policies
- The CSV file includes BOM for proper Thai character display in Excel on Windows
- Firebase configuration is loaded securely from .env file

## Error Handling

If errors occur:
- `Firebase configuration not found` - Check your .env file
- `permission-denied` - Check Firebase security rules and credentials
- `not-found` - The collection name might have changed
- General issues - Verify Firebase project ID and internet connection