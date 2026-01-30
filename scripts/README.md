# Export Scripts for ThaiSim2569

Scripts for exporting poll data and simulation results from Firebase Firestore to CSV files.

## Available Scripts

### Charts Data Export (Matches Results Page)
- **`export_charts_data.js`** - Export data matching results page charts
  - **Poll Votes by Party** - Party rankings with vote counts and percentages
  - **Daily Trends** - Timeline data (top 10 parties, pivot table format)
  - **Policy Statistics** - Most selected policies with rankings
  - **Party Winners** - Top 20 parties by match count
  - **Raw Poll Votes** - Individual vote records with timestamps (27K+ records)
  - Uses same calculation logic as `results.js`

### Main Export Scripts
- **`export_all_polls_sdk.js`** - Export using Firebase SDK (RECOMMENDED)
  - Uses Firebase SDK (same as website) to avoid rate limits
  - Exports Poll Votes successfully
  - Simulation Results may timeout for large datasets

- **`export_sim_results_batched.js`** - Export Simulation Results in batches
  - Use this if Simulation Results timeout in the main script
  - Uses REST API with pagination and delays
  - Handles large collections better

- `export_all_polls.js` - Export using REST API (may have rate limits)
  - Original version using Firebase REST API
  - May encounter rate limiting issues

- `export_policy_stats_local.js` - Export policy statistics only
  - Exports "Most Selected Policies" data from `sim_results_v7`
  - Generates aggregated policy rankings

### Utility Scripts
- `cleanup-empty-policies.js` - Utility script for cleaning up empty policies
- `debug_data.js` - Debug script for analyzing Firestore data structure (for development)

## How to Use

### Export Charts Data (Matching Results Page)

Exports data that exactly matches the charts displayed on the results page.

1. **Install dependencies:**
   ```bash
   npm install dotenv firebase
   ```

2. **Run the script:**
   ```bash
   node export_charts_data.js
   ```

3. **CSV files will be saved** in `exports/` folder:
   - `poll_votes_by_party_{timestamp}.csv` - Party rankings with counts and percentages
   - `daily_trends_{timestamp}.csv` - Daily vote timeline (top 10 parties, pivot format)
   - `policy_statistics_{timestamp}.csv` - Policy selection rankings
   - `party_winners_{timestamp}.csv` - Top 20 parties by match count
   - `raw_poll_votes_{timestamp}.csv` - Individual vote records with timestamps

**Output formats:**
- **Poll Votes by Party**: Rank, Party ID, Party Name, Vote Count, Percentage
- **Daily Trends**: Date, Party1, Party2, ... (top 10 parties as columns)
- **Policy Statistics**: Rank, Policy Name, Count, Percentage
- **Party Winners**: Rank, Party ID, Party Name, Win Count, Percentage
- **Raw Poll Votes**: Timestamp, Party ID, Party Name (27K+ individual records)

### Export All Poll Data (Recommended)

Exports both Poll Votes and Simulation Results to CSV files.

1. **Install dependencies:**
   ```bash
   npm install dotenv
   ```

2. **Configure .env file:**
   - The script automatically reads Firebase configuration from `../.env`
   - No manual .env creation needed if using the project root .env

3. **Run the script:**
   ```bash
   node export_all_polls.js
   ```

4. **CSV files will be saved** in `exports/` folder:
   - `poll_votes_{timestamp}.csv` - All poll votes from users
   - `sim_results_{timestamp}.csv` - All simulation results

### Export Policy Statistics Only

Exports aggregated policy rankings from simulation results.

1. **Run the script:**
   ```bash
   node export_policy_stats_local.js
   ```

2. **CSV file will be saved** in the current directory with name:
   `policy_stats_{timestamp}.csv`

## Output

### Export All Poll Data

**`poll_votes_{timestamp}.csv`:**
```csv
Timestamp,Party,Party Name
2025-01-30T10:30:00,PP,ประชาชน
2025-01-30T10:31:00,PTP,เพื่อไทย
...
```

**`sim_results_{timestamp}.csv`:**
```csv
Timestamp,Winner,Party Name,Policy Choices,Eco,Soc,Lib,Budget
2025-01-30T10:30:00,PP,ประชาชน,"คืนครูให้นักเรียน|ยกเลิกเกณฑ์ทหาร",65,75,80,-26
...
```

### Export Policy Statistics Only

CSV file format:
```csv
Rank,Policy Name,Count,Percentage
1,"คืนครูให้นักเรียน",111,73.5%
2,"ยกเลิกเกณฑ์ทหาร",97,64.2%
3,"ทักษะอนาคต (Wellness/Tech)",94,62.3%
...
```

## Notes

- **Export All Poll Data:**
  - Fetches from both `poll_votes_v7` and `sim_results_v7` collections
  - Handles pagination automatically for large datasets
  - CSV files include BOM for proper Thai character display in Excel on Windows
  - Uses Firebase REST API for reliable data fetching

- **Export Policy Statistics:**
  - Fetches from the `sim_results_v7` collection only
  - Data is aggregated and sorted by the most selected policies
  - Processes Firestore's nested map structure for policy choices

- Firebase configuration is loaded securely from project root .env file

## Error Handling

If errors occur:
- `Firebase configuration not found` - Check your .env file in the project root
- `permission-denied` - Check Firebase security rules and make sure Firestore is in test mode
- `not-found` or `404` - The collection name might have changed or the collection path is incorrect
- General issues - Check your internet connection and ensure Firestore is enabled

## Environment Variables

The scripts use environment variables from the `.env` file in the project root. Create a `.env` file based on `.env.example`:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```