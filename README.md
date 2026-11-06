# 🎮 Simon Says — Memory Arcade

An interactive and responsive Simon Says memory game built with **Vanilla JavaScript, Vite, Tailwind CSS v4, and DaisyUI v5**. Test your memory, improve your focus, and challenge yourself across multiple difficulty levels.

<p align="center">
  <a href="https://simonsays-memoryarcade.onrender.com/"><strong>🚀 Play Live Demo</strong></a>
</p>

## ✨ Features

- 🧠 **Memory Gameplay** – Remember and repeat increasingly longer sequences of four colored pads.
- 🎯 **Multiple Difficulty Levels** – Choose between Easy, Normal, Hard, and Pro.
- 🎨 **Theme Customization** – Switch between 10 DaisyUI themes: Forest, Dracula, Cupcake, Synthwave, Cyberpunk, Nord, Luxury, Aqua, Sunset, and Business.
- 🔊 **Sound Effects** – Interactive audio feedback powered by the Web Audio API, with a sound toggle.
- 🏆 **Achievement System** – Unlock 8 achievements by reaching milestone levels, from Level 5 to Level 50.
- 📊 **Score Tracking** – Keep track of your current level, score, and personal best.
- 💾 **LocalStorage Persistence** – Save your theme, sound preferences, personal best, and unlocked achievements.
- ⏯️ **Game Controls** – Start, pause, resume, and restart gameplay.
- ⌨️ **Keyboard Shortcuts** – Control the game using your keyboard.
- 📱 **Responsive Design** – Enjoy a consistent experience across desktop, tablet, and mobile devices.
- 🎮 **Game Over Dialog** – View your results when a game ends.

## 🕹️ Keyboard Controls

| Key | Action |
|---|---|
| `1` – `4` | Activate the corresponding color pad |
| `Space` | Start the game |
| `Enter` | Start the game |
| `Escape` | Pause / Resume the game |

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| HTML5 | Page structure |
| CSS3 | Custom styling and animations |
| Vanilla JavaScript | Game logic and interactions |
| Vite | Development server and build tool |
| Tailwind CSS v4 | Utility-first styling |
| DaisyUI v5 | Theme customization and UI components |
| Web Audio API | Sound effects |
| LocalStorage | Persistent game preferences and progress |

## ⚙️ Requirements

- Node.js 18 or later recommended
- npm

## 🚀 Run Locally

**1. Clone the repository**

```bash
git clone https://github.com/SanskarMittal605/SimonSays-MemoryArcade.git
```

**2. Navigate to the project directory**

```bash
cd SimonSays-MemoryArcade
```

**3. Install dependencies**

```bash
npm install
```

**4. Start the development server**

```bash
npm run dev
```

Open the local URL printed by Vite in your browser.

## 📦 Production Build

To generate an optimized production build:

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

The production-ready files are generated in the `dist/` directory.

## 📁 Project Structure

```text
SimonSays-MemoryArcade/
│
├── src/
│   ├── js/
│   │   └── game.js
│   │
│   ├── styles/
│   │   └── style.css
│   │
│   └── main.js
│
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
├── README.md
└── .gitignore
```

## 📝 Notes

- This is a frontend-only project; no backend or database is required.
- Scores, preferences, and achievement progress are stored locally in the browser using LocalStorage.
- Clearing browser site data will remove the saved personal best, preferences, and achievement progress.
- The four game-pad colors intentionally remain consistent across DaisyUI themes to keep gameplay easy to follow.

## 👨‍💻 Developer

**Sanskar Mittal**

- GitHub: [@SanskarMittal605](https://github.com/SanskarMittal605)
- Project Repository: [SimonSays-MemoryArcade](https://github.com/SanskarMittal605/SimonSays-MemoryArcade)
- Live Demo: [Simon Says — Memory Arcade](https://simonsays-memoryarcade.onrender.com/)

---

<p align="center">
  Made with ❤️ by Sanskar Mittal
</p>
