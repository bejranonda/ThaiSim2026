# Sim-Thailand 2569 (ThaiSim2569) 🇹🇭

**Thai Political Simulation Game** - Experience governance through real policy choices from 16 political parties across 6 critical phases. Build your dream nation through strategic policy decisions and see how it impacts the economy, welfare, and democracy.

**Latest Release**: [v1.5.2](https://github.com/bejranonda/ThaiSim2026/releases/tag/v1.5.2) | **Data Updated**: 20 January 2569 (2026) | **Play Online**: [Sim-Thailand 2569](https://thalay.eu/sim-thailand-2569/)

<img width="1075" height="462" alt="image" src="https://github.com/user-attachments/assets/2c930164-cf1d-4a63-a070-f7f573fc5583" />


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

<img width="1732" height="666" alt="image" src="https://github.com/user-attachments/assets/c2c79657-7d53-4602-8073-c8da1576f58c" />


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

### **Cloudflare Pages** (Recommended) ⭐
Deploy with automatic GitHub integration and Firebase environment variables.
- `_redirects` file for SPA routing
- GitHub Actions workflow for automatic deployment
- No complex configuration needed!
- **See**: [CLOUDFLARE_QUICK_START.md](./CLOUDFLARE_QUICK_START.md) for Thai guide
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
- **Utilities**: html2canvas (Screenshot generation)
- **Build Tool**: Vite
- **Backend**: Firebase (Authentication & Firestore) for real-time voting data.

## 📜 Version History

### v1.5.2 (January 20, 2569/2026)
- 🎨 **Poll Results Page Improvements**:
  - Moved "ดูนโยบายทุกพรรค" button from topbar to bottom section (before "เล่นเกม" button) for better UX flow
  - Added "พัฒนาโดย..." footer with thalay.eu logo at bottom of results page for proper attribution
  - Changed poll result bar colors to use actual party colors instead of generic medal colors for better visual clarity
  - Changed section title from "นักเล่น" to "ผู้เล่น" for more appropriate Thai language usage
- 📊 **Policy Statistics Enhancements**:
  - Added player count display ("จากผู้เล่นทั้งหมด X คน") in policy statistics section for context
  - Improved color scale for policy heatmap with finer gradients for 20-50% range (red-orange-yellow-lime-green-emerald)
- 🎯 **Button Interaction Fix**: Added `overflow-hidden` class to buttons to prevent animate-ping from intercepting mouse events on adjacent elements

### v1.5.1 (January 19, 2569/2026)
- 📚 **Policy Access**: Replaced "Play Game" button on intro screen with direct "View all policies" link (`thalay.eu/policy2569`) to prioritize information access.
- 🗣️ **Wording Update**: Updated "View results" button text to "ดูผลโหวตพรรค และ นโยบายที่คนชอบ" (View party votes and policies people like) for clarity and engagement.
- 🔗 **Consistent Navigation**: Ensured consistent button links and terminology across Intro, Results, and Policy Explore pages.

### v1.4 (January 19, 2569/2026)
- 📊 **Consistent Metrics Format**: All National Status metrics now display uniformly with percentage symbols (e.g., "30%", "-20%")
- 🎯 **Enhanced Visual Hierarchy**: Increased visual overlap between National Status and Your Real Vote sections for stronger connection
- ♻️ **UX Optimization**: Tighter spacing reduces cognitive distance between results display and voting action, minimizing user forgetfulness
- 🔄 **Polish Release**: Consolidated all previous improvements into production-ready version

### v1.3.1 (January 19, 2569/2026)
- 💰 **Budget Factor Optimization**: Reduced budget impact multiplier from 1.5x to 1.05x for better gameplay balance and more sustainable policy choices across all 48 policies
- 🎯 **Navigation Improvements**: Moved "Your Real Vote" section closer to National Status results to encourage voting and reduce user forgetfulness
- 🔘 **CTA Consistency**: Updated call-to-action buttons across results page and policy explorer with consistent messaging "เล่นเกมเพื่อดูพรรคไหนเหมาะกับคุณ" and play icon
- 📊 **Results Dashboard Enhancement**: Added new results button linking to poll results and policy statistics (https://thalay.eu/poll2569)
- 🎨 **UI Polish**: Improved spacing between major sections for better visual hierarchy and user experience

### v1.3.0 (January 19, 2569/2026)
- 📸 **Save Result Image**: Added feature to save the simulation result card as an image.
- 🏷️ **Watermark**: Added "thalay.eu/sim2569" watermark to the result card.
- 📦 **Dependencies**: Added `html2canvas` for client-side screenshot generation.

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
**Latest Release**: [v1.5.2 on GitHub](https://github.com/bejranonda/ThaiSim2026/releases/tag/v1.5.2)
