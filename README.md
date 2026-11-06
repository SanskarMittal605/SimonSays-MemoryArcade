# Simon Says — Memory Arcade

A responsive Simon Says memory game built with Vanilla JavaScript, Vite, Tailwind CSS v4 and DaisyUI v5.

## Features

- Four-color sequence memory gameplay
- Easy, Normal and Hard difficulty settings
- DaisyUI theme selector (Forest, Dracula, Cupcake, Synthwave, Cyberpunk, Nord, Luxury, Aqua, Sunset and Business)
- Theme, sound and personal-best persistence with LocalStorage
- Sound effects using the Web Audio API
- Start, pause, resume and restart controls
- Keyboard controls: `1`–`4` for pads, `Space` or `Enter` to start, `Escape` to pause/resume
- Responsive layout and accessible button labels
- Game-over results dialog

## Requirements

- Node.js 18+ recommended
- npm

## Run locally

```bash
npm install
npm run dev
```

Open the local URL printed by Vite.

## Production build

```bash
npm run build
npm run preview
```

## Project structure

```text
simon-says-upgraded/
├── index.html
├── package.json
├── vite.config.js
├── src/
│   ├── main.js
│   ├── js/
│   │   └── game.js
│   └── styles/
│       └── style.css
└── README.md
```

## Notes

- This is a frontend-only project. Scores and preferences are stored in the current browser using LocalStorage.
- Clearing browser site data will clear the saved personal best and preferences.
- The four game-pad colors intentionally remain consistent across DaisyUI themes so the game remains easy to follow.
