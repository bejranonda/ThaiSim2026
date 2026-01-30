# Sim-Thailand 2569 (ThaiSim2569) 🇹🇭

**Thai Political Simulation Game** - Experience governance through real policy choices from 18 political parties across 6 critical phases. Build your dream nation through strategic policy decisions and see how it impacts the economy, welfare, and democracy.

**Latest Release**: [v3.0.1](https://github.com/bejranonda/ThaiSim2026/releases/tag/v3.0.1) | **Data Updated**: 30 January 2569 (2026) | **Play Online**: [Sim-Thailand 2569](https://thalay.eu/sim-thailand-2569/)

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
- **18 Political Parties**: Complete with real policy platforms from the 2569 election cycle.
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

### v3.0.1 (January 30, 2569/2026) - "Aware Release Refined: IO, We Know You"
- 🏷️ **UI Refinement**: Updated Home Page banner to **"New Release 3.0 – IO, We Know You"**.
- 🛡️ **Warning Modal Enhancement**: Added explicit instructions to the Results page warning modal, encouraging users to audit the **"Daily Vote Trend Chart"** for transparency.
- 📝 **Documentation Synchronization**: Updated version numbers and release notes across all project documentation.

### v3.0.0 (January 30, 2569/2026) - "Aware Release: Anti-Fraud & Transparency"
- 🛡️ **Anti-Fraud Measures**:
  - Added **Warning Modal** to both Home and Results pages to deter malicious voting activity and automated scripts.
  - Implemented persistent awareness: Warning pops up on every page load to ensure all users are informed.
- 📊 **Transparency Enhancements**:
  - Integrated **Daily Vote Trend Chart** using Chart.js to visualize voting patterns over time.
  - Allows the public to audit and identify suspicious spikes in voting data for any party.
- 🏷️ **Brand Refresh**:
  - Updated theme to **"Aware Release 3.0 – IO, We Know You"** reflecting the focus on transparency and anti-manipulation.
- 🔧 **Under the Hood**:
  - Added `chart.js` dependency for advanced data visualization.
  - Optimized modal logic for better visibility across different application states.

### v2.3.0 (January 28, 2569/2026) - "Facebook Integration & Release Documentation Update"
- 🔗 **Social Media Integration**:
  - Added Facebook link (thalay.eu) to developer credits section for better social presence
  - Updated attribution in both simulation and results pages
- 📝 **Documentation Update**:
  - Updated README release information to v2.3.0
  - Fixed release version display in index.html home page
  - Synchronized version number across all documentation and website elements

### v2.2.0 (January 28, 2569/2026) - "Release Update & Documentation Sync"
- 🔄 **Version Update**:
  - Updated README release information to v2.2.0
  - Synchronized version number across all documentation and website elements
- 📝 **Documentation Enhancement**:
  - Updated repository links to reflect current release status
  - Ensured consistent version references across all platforms

### v2.1.3 (January 28, 2569/2026) - "Social Presence & Accuracy Update"
- 🔗 **Social Media Integration**:
  - Added Facebook link (`thalay.eu`) to the developer credit section on both the simulation and live results pages.
- 🏷️ **Naming Consistency**:
  - Shortened "พรรคชาติไทยพัฒนา" to **"ชาติไทยพัฒนา(ไม่ส่งผู้สมัคร)"** for better UI fit and clarity.
- 📊 **UI Refinement**:
  - Streamlined the simulation results header to **"พรรคแรกที่นโยบายตรงใจที่สุด (จากการจำลอง)"**.

### v2.1.2 (January 28, 2569/2026) - "Mature Content & Public Voice Update"
- 🏛️ **Policy Diversity Enhancement**:
  - Added "Pornhub / Sex Toy ถูกกฎหมาย" to Phase 1 (Economy) - Regulating adult entertainment industry
  - Added "Sex Worker ถูกกฎหมาย" to Phase 3 (Welfare) - Protecting rights of adult service workers
  - Both policies support NAP (New Alternative Party) platform with balanced socio-economic impact
- 🎯 **Scoring Adjustments**:
  - Economy: +15 points from new adult entertainment regulation
  - Social Welfare: +15 points from sex worker legalization
  - Liberty: +20 points from both policies (individual freedom focus)
  - Budget: +17 points total from regulated taxation
- 🗳️ **Enhanced Vote Results**:
  - **Top Matched Parties**: Increased display limit from 10 to **20 parties**.
  - **Top Voted Policies**: Removed limit to show **ALL** voted policies sorted by popularity.

### v2.0.1 (January 28, 2569/2026) - "Future Edition Update"
- 🚀 **New Visual Identity**: Added space-themed background animation with twinkling stars on the home screen.
- 🏷️ **New Label**: "New Release 2 - Future Edition" badge added prominently above the main title.
- ✨ **Immersive Gameplay Animations**:
  - **Neon HUD/Stats**: The HUD and stat values pulse and brighten when updated by policy choices.
  - **Choice Overlays**: Choice cards now feature scanlines and pulsing neon borders when selected.
  - **Future Grid**: A subtle global CRT scanline grid added for a premium "Future Edition" feel.
- 🎮 **Scoring Balance (Round 3)**:
  - Reduced stat gains (Economy, Welfare, Democracy) by 50% (0.5x multiplier) to make 100% scores harder and more meaningful.
  - All score additions are now rounded to clean integers for better UI/UX.
  - Updated tooltips to accurately reflect these reduced point values.
- ✨ **Enhanced Celebration**: Replaced standard confetti with neon star-shaped confetti for a "Space Party" themed celebration on the results page.
- 🔧 **Code Refinement**: Improved internal scoring logic and consistent tooltip rendering across phases.

### v2.0.0 (January 28, 2569/2026) - "Release 2 Major Update"
- 🆕 **New Political Party Added**:
  - พรรคทางเลือกใหม่ (New Alternative Party) led by มงคลกิตติ์ สุขสินธารานนท์ (พรี่เต้)
  - Added to both **Policy Explorer** (10 policies) and **Simulation Game** (6 phases)
  - Party color: #ff6b2c (vibrant orange)
  - Party icon: Rocket (fa-rocket) symbolizing space and future programs
  - Updated party count from 17 to 18 parties
- 📚 **Policy Database Enhancement**:
  - All policies sourced from The Matter article (https://thematter.co/brief/255470/255470)
  - Policies span categories: Economy, Social, Education, Security, and Politics
  - Includes forward-thinking policies like space force, nuclear program, and Elon Musk advisorship
- 🎮 **Simulation Game Integration**:
  - NAP mapped to 6 existing policy options
  - Added **18 New Policy Options [Release2]** (3 per phase) extending choices for all parties
  - Highlights:
    - **Economy**: Mega Projects (Landbridge), Virtual Bank
    - **Agriculture**: Unlock Local Fishery, Smart Farmer AI
    - **Welfare**: Parental Leave 180 Days, Stepped Elderly Allowance
    - **Anti-Corruption**: Regulatory Guillotine, Higher Lottery Penalties
    - **Security**: Cyber Army, Space Force, Nuclear Program
    - **Education**: Space Trip, AI in Classroom, Elon Musk Advisor

### v1.7.1 (January 22, 2569/2026)
- 🏆 **Winner Statistics Dashboard**:
  - Added new section showing top 10 parties from all simulations
  - Card grid layout displaying party icons, names, win counts, and percentages
  - Responsive design (2 columns on mobile, up to 5 columns on desktop)
  - Real-time updates from Firebase simulation results
- 📊 **Vote Distribution Visualization**:
  - Replaced single-party progress bar with stacked bar chart
  - Shows vote distribution across all parties with matching party colors
  - Visual representation of proportional vote shares
- 📝 **Improved Thai Labels**:
  - Streamlined header text: "คะแนนเสียงจริงจากผู้เล่น Sim-Thailand 2569"
  - Updated section headers for better clarity:
    - "พรรคที่ผู้เล่นโหวตให้ (ไม่ใช่ผลการจำลอง)"
    - "พรรคแรกที่นโยบายตรงใจที่สุด (จากการจำลอง)"

### v1.7.0 (January 20, 2569/2026)
- 🔍 **Policy Statistics Export Tool**:
  - Added feature to export policy selection statistics as downloadable CSV file
  - Users can analyze most popular policies across all simulations
  - Policy export includes frequency rankings and percentages
  - Enhanced data analysis capabilities for researchers and educators

### v1.6.1 (January 20, 2569/2026)
- 🔍 **Policy Explorer with Search Bar**:
  - Added new file `policy_explore_with_search.html` with search functionality
  - Search bar positioned at the top of the page before existing filters
  - Real-time search across policy titles, descriptions, and party names
  - Clear button (X) appears when typing, resets search on click
  - Escape key support to clear search
  - Search works in combination with existing party and category filters
  - Helper text explaining search scope: "ค้นหาจากชื่อนโยบาย คำอธิบาย และชื่อพรรคการเมือง"
  - Original `policy_explore.html` remains unchanged for backward compatibility

### v1.6.0 (January 20, 2569/2026)
- 🎨 **Scroll Indicator Visual Enhancement**:
  - Changed reminder text from "อย่าลืม!" to "ยังไม่เสร็จ! อย่าลืมลงมา..." for clearer messaging
  - Updated color scheme from blue to neon fuchsia (pink) with glow effect
  - Added custom CSS animation `text-glow-pink` for pulsing neon glow on reminder text
  - Applied consistent fuchsia color to chevron-down icons

### v1.5.9 (January 20, 2569/2026)
- 📊 **Policy Statistics Enhancement**:
  - Increased policy rankings display from top 15 to top 20 most selected policies
  - Users can now see more comprehensive policy choice data from all players
  - Better insight into which policies resonate most with the player base

### v1.5.8 (January 20, 2569/2026)
- 🎨 **UI Enhancement - Party Name Consistency**:
  - Removed "พรรค" prefix from all political party names in the voting section
  - Party names now display uniformly (e.g., "ประชาชน" instead of "พรรคประชาชน")
  - Exception: "พรรคอื่นๆ" (Other Parties) retains the prefix for clarity
- 📝 **Improved User Experience**:
  - Cleaner, more concise party name display in the "เสียงจริงของคุณ" (Your Real Vote) section
  - Consistent naming across all 16 political parties

### v1.5.7 (January 20, 2569/2026)
- 🐛 **Bug Fix - Scroll Indicator Visibility**:
  - Fixed scroll indicator incorrectly appearing on Intro page in Desktop view
  - Changed "อย่าลื่น" (slip) to "อย่าลืม" (forget) for correct Thai spelling
  - Added proper JavaScript control for both mobile and desktop scroll indicators
  - Scroll indicators now only appear on Results page as intended
- 🔧 **Technical Improvements**:
  - Added unique IDs (`scroll-indicator-mobile`, `scroll-indicator-desktop`) to scroll indicators
  - Implemented explicit show/hide logic in JavaScript for better control
  - Removed conflicting CSS classes (`md:flex`) that caused visibility issues

### v1.5.6 (January 20, 2569/2026)
- 🧹 **Data Quality Enhancement**:
  - Added validation to prevent saving simulation results without any policy selections to Firebase
  - Users who skip all policies will no longer create empty database entries
  - Vote functionality remains independent - users can still vote for parties without playing the simulation
- 🗄️ **Database Cleanup**:
  - Removed 23 existing empty policy records from Firebase (out of 62 total records)
  - Cleaner data for more accurate policy statistics and analysis

### v1.5.5 (January 20, 2569/2026)
- 📢 **Vote Section Awareness Enhancement**:
  - Added prominent scroll indicator with animated arrow and text "👇 อย่าลื่น! ลงมาโหวตพรรคที่คุณจะเลือกจริงด้านล่าง 👇"
  - Responsive positioning: shows before "5 อันดับรองลงมา" on mobile, after "สถานะประเทศของคุณ" on desktop
  - Optimized spacing for maximum visibility while maintaining clean layout
- 🎨 **Enhanced Vote Section Visual**:
  - Added gradient border (border-blue-500) with glow pulse animation
  - Added red badge "⚠️ ขั้นตอนสุดท้าย" with pulsing effect
  - Enlarged headline to text-3xl with icon
  - Added CTA banner with clear messaging "เกมจำลองเสร็จแล้ว แต่อย่าลืมลงมาโหวตพรรคที่คุณจะเลือกจริงในวันเลือกตั้ง!"
  - Enhanced vote button with gradient, larger size (py-6), and hover scale animation
- 🌐 **Language Update**: Changed "สถานะประเทศ" to "สถานะประเทศของคุณ (Your National Status)" for better user engagement
- ✨ **CSS Animations**: Added glow-pulse keyframe animation for vote section emphasis

### v1.5.4 (January 20, 2569/2026)
- 📱 **Mobile HUD Improvements**:
  - Increased Thai label font sizes on mobile for better readability (text-xs to lg:text-lg)
  - Increased score value font sizes (text-xs to md:text-base)
  - Added right padding (pr-2) to score values for better visual separation from adjacent stat labels
  - Optimized responsive breakpoints for better cross-device consistency
  - Removed English abbreviations entirely for cleaner mobile display
- 🎨 **Visual Clarity**: Enhanced spacing and typography to reduce confusion between stat labels and values

### v1.5.3 (January 20, 2569/2026)
- 🎮 **Gameplay Balance**: Reduced initial stat values from 30 to 10 for Economy (Eco), Society (Soc), and Democracy (Dem/Lib) to show more dramatic progress as players choose policies
- 💰 **Budget Stability**: Maintained budget at 100 to avoid negative values too easily during gameplay
- 📊 **Enhanced Progression**: Lower baseline stats make policy choices more impactful and visual progress more apparent throughout the simulation

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
**Latest Release**: [v3.0.1 on GitHub](https://github.com/bejranonda/ThaiSim2026/releases/tag/v3.0.1)
