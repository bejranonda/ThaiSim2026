# Sim-Thailand 2569 🇹🇭

Thai Political Simulation Game - Experience governance through real policy choices from 16 political parties across 6 critical phases.

## 🎮 About

Sim-Thailand 2569 is an interactive simulation that allows users to:
- **Simulate**: Make policy choices across 6 critical areas (Economy, Agriculture, Welfare, Anti-Corruption, National Security, Education).
- **Match**: Get matched with a political party based on policy alignment.
- **Vote**: Cast a manual vote for your preferred party after the simulation.
- **Track**: View aggregate voting results in real-time via the **Live Results Dashboard**.

**Reference Materials**: Political campaign data and debate transcripts are organized in the `/Campaign2569` folder for reference and research purposes.

## 🏗️ Project Structure

```
ThaiSim2569/
├── src/
│   ├── js/
│   │   ├── config.js      # Firebase configuration
│   │   ├── data.js        # Political parties and phases data
│   │   ├── game.js        # Core game simulation logic
│   │   ├── main.js        # Main entry point for the game
│   │   └── results.js     # Logic for the live results dashboard
│   └── css/
│       └── styles.css     # Tailwind CSS styles
├── Campaign2569/          # Political campaign reference files
│   ├── Nation_Debate2569.md
│   ├── party.md
│   ├── Campaign_2569.md
│   └── Campaign_Party2569.md
├── public/                # Static assets
├── index.html             # Main Simulation Game
├── results.html           # Live Results Dashboard
├── package.json           # Dependencies and scripts
├── vite.config.js         # Vite build configuration
├── tailwind.config.js     # Tailwind CSS configuration
├── netlify.toml           # Netlify deployment config
├── vercel.json            # Vercel deployment config
├── .env.example           # Environment variables template
└── firestore.rules        # Firebase security rules
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd ThaiSim2569
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Edit `.env` and fill in your Firebase credentials:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

### Development

Run the development server:
```bash
npm run dev
```

- **Game**: `http://localhost:3000`
- **Results**: `http://localhost:3000/results.html`

### Build

Build for production:
```bash
npm run build
```

Preview production build:
```bash
npm run preview
```

## 🌐 Deployment

### Deploying to Netlify

#### Option 1: Using Netlify CLI

1. Install Netlify CLI:
```bash
npm install -g netlify-cli
```

2. Login to Netlify:
```bash
netlify login
```

3. Deploy:
```bash
npm run deploy:netlify
```

#### Option 2: Using Netlify UI

1. Push your code to GitHub/GitLab
2. Go to [Netlify](https://app.netlify.com)
3. Click "New site from Git"
4. Select your repository
5. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
6. Add environment variables in Netlify dashboard (Site settings > Environment variables):
   - `VITE_FIREBASE_API_KEY`, etc.
7. Click "Deploy site"

### Deploying to Vercel

#### Option 1: Using Vercel CLI

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Deploy:
```bash
npm run deploy:vercel
```

#### Option 2: Using Vercel UI

1. Push your code to GitHub/GitLab
2. Go to [Vercel](https://vercel.com)
3. Click "New Project"
4. Import your repository
5. Configure project:
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
6. Add environment variables.
7. Click "Deploy"

## 🔒 Security

- **Environment Variables**: Never commit `.env` file to Git. Use `.env.example` as a template.
- **Firebase Rules**: Ensure your Firebase security rules are properly configured to allow write access for anonymous users to specific collections only (`sim_results_v7`, `poll_votes_v7`) and read access where appropriate.
- **API Keys**: While Firebase API keys are safe to expose in client-side code, always use Firebase Security Rules to protect your data.

## 🛠️ Technologies

- **Frontend**: HTML, CSS (Tailwind CSS), JavaScript (ES6+ Modules)
- **Build Tool**: Vite
- **Backend**: Firebase (Authentication & Firestore)
- **Deployment**: Netlify / Vercel

## 📝 Development Notes

### Firebase Configuration

The app uses Firebase for:
- **Anonymous Authentication**: To allow secure database writes without requiring user login.
- **Firestore**:
    - `sim_results_v7`: Stores the outcome of user simulations.
    - `poll_votes_v7`: Stores manual user votes (displayed in `/results.html`).

### Data Structure

- **Parties**: 16 Thai political parties with their policies
- **Phases**: 6 policy areas with 8 options each
- **Scoring**: Each choice adds points to matching parties
- **Results**: Top 5 parties are displayed based on user choices

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

MIT License - see LICENSE file for details

## 📧 Contact

For questions or support, please open an issue in the repository.

---

**Note**: This is a simulation tool for educational purposes. The policies and data are based on the Nation Election DEBATE and may not represent complete or current party platforms.