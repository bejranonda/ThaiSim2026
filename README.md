# Sim-Thailand 2569 (ThaiSim2569) 🇹🇭

**Thai Political Simulation Game** - Experience governance through real policy choices from 16 political parties across 6 critical phases. Build your dream nation through strategic policy decisions and see how it impacts the economy, welfare, and democracy.

**Latest Release**: [v1.2](https://github.com/bejranonda/ThaiSim2026/releases/tag/v1.2) | **Data Updated**: 17 January 2569 (2026) | **Play Online**: [Sim-Thailand 2569](https://thalay.eu/sim-thailand-2569/)

## 🎮 About

**Sim-Thailand 2569** is an interactive political simulation designed for the 2569 (2026) Thai General Election context. It allows users to:
- **Simulate**: Make policy choices across 6 critical phases with three tracking metrics:
  - 📊 **Economy (ศก.)**: Economic and fiscal policy
  - 🤝 **Welfare (สังคม)**: Social welfare and quality of life
  - ⚖️ **Democracy (ปชต.)**: Democratic values and governance
- **Match**: Get matched with a political party based on policy alignment across all metrics.
- **Vote**: Cast a manual vote for your preferred party after the simulation.
- **Track**: View aggregate voting results in real-time via the **Live Results Dashboard**.
- **Monitor**: Track national status across all three pillars in detailed results view.

### 📚 Educational Content

**Reference Materials**: Political campaign data and debate transcripts are organized in the `/Campaign2569` folder. All policies are sourced from the **Nation Election DEBATE** (Updated: 17 January 2569) to ensure accuracy and educational value.

### 🎯 Features
- **16 Political Parties**: Complete with real policy platforms from the 2569 election cycle.
- **6 Critical Phases**: Cover major policy areas like Economy, Land/Agriculture, Welfare, Anti-Corruption, National Security, and Future/Education.
- **Real-Time Results**: Live dashboard showing voting trends from all users.
- **Educational Tool**: Learn about the Thai political landscape through interactive simulation.
- **Anonymous**: No login required to play.

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
├── public/                # Static assets
├── index.html             # Main Simulation Game
├── results.html           # Live Results Dashboard
├── package.json           # Dependencies and scripts
└── vite.config.js         # Vite build configuration
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/bejranonda/ThaiSim2569.git
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
*(Configure your Firebase credentials in the `.env` file)*

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

## 🌐 Deployment

This project supports deployment on multiple platforms:

### **Cloudflare Pages** (Recommended)
Deploy with automatic GitHub integration and Firebase environment variables.
- `wrangler.toml` included
- `_redirects` file for SPA routing
- GitHub Actions workflow for automatic deployment
- **See**: [CLOUDFLARE_DEPLOYMENT.md](./CLOUDFLARE_DEPLOYMENT.md) for detailed guide

### **Netlify**
- `netlify.toml` included
- Easy integration with GitHub

### **Vercel**
- `vercel.json` included
- Zero-config deployment

### Quick Start: Cloudflare Pages
1. Push your code to GitHub
2. Go to [Cloudflare Pages](https://pages.cloudflare.com)
3. Connect your GitHub repo
4. Set Firebase environment variables in dashboard
5. Deploy automatically on each push!

For detailed instructions, see [CLOUDFLARE_DEPLOYMENT.md](./CLOUDFLARE_DEPLOYMENT.md)

## 🛠️ Technologies

- **Frontend**: HTML, CSS (Tailwind CSS), JavaScript (ES6+ Modules)
- **Build Tool**: Vite
- **Backend**: Firebase (Authentication & Firestore) for real-time voting data.

## 📜 Version History

### v1.2 (January 19, 2569/2026)
- ✨ **GitHub Integration**: Add GitHub repository link to intro screen release section
- 🎨 **UI Enhancement**: Improve layout with separate line for release information
- 🔗 **Direct Links**: Link to [GitHub Repository](https://github.com/bejranonda/ThaiSim2026)

### v1.1 (January 18, 2569/2026)
- 🎭 **Animation Enhancements**: Improved game animations and visual effects
- ✍️ **Developer Credits**: Enhanced styling for developer credits on intro and results screens
- 🎨 **UI Polish**: Advanced UI polish with interactive effects

### v1.0.0 (January 17, 2569/2026)
- 🚀 **Official Release**: Sim-Thailand 2569
- 🔄 **Latest Data**: Policies updated based on Nation Election DEBATE
- ✨ **Features**:
  - Enhanced UI with separator lines and cleaner footer
  - "No Match" logic for users who skip all questions
  - Prominent "Try Simulation" CTA on results page
  - Live real-time voting results from Firebase

---

**Note**: This is a simulation tool for educational purposes. The policies and data are based on public debate information and may not represent complete party platforms.

**Repository**: [github.com/bejranonda/ThaiSim2026](https://github.com/bejranonda/ThaiSim2026)
**Developed by**: [thalay.eu](https://thalay.eu)
**Latest Release**: [v1.2 on GitHub](https://github.com/bejranonda/ThaiSim2026/releases/tag/v1.2)
