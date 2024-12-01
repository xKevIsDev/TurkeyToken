# Turkey Tokens 🦃

![Turkey Tokens Snapshot](/public/screenshot.png)

A fast-paced browser game where you catch turkeys to collect tokens and advance through increasingly challenging levels.

## 🎮 Gameplay

- Use your mouse to move the character around the screen
- Catch turkeys before they escape
- Each caught turkey gives you points and tokens
- Collect enough tokens to advance to the next level
- Don't let 5 turkeys escape or it's game over!

## 🔥 Features

- Mouse-locked controls for smooth gameplay
- Progressive difficulty system:
  - More turkeys spawn as levels increase
  - Turkeys move faster in higher levels
  - Faster spawn rates in higher levels
- Score multiplier system
- Level progression
- Sound effects
- High score system

## 🎯 Game Mechanics

### Difficulty Progression
- Base number of turkeys: 5 + current level
- Turkey speed increases with level
- Spawn rate increases with level (starts at 2s, decreases by 100ms per level, minimum 500ms)

### Scoring System
- Points awarded for each caught turkey
- Score multiplier increases with each level
- Tokens needed for level advancement
- Game ends if 5 turkeys escape

## 🛠️ Technical Stack

- Next.js 14
- TypeScript
- Framer Motion for animations
- Tailwind CSS for styling
- HTML5 Canvas for game rendering
- Web Audio API for sound effects

## 🚀 Getting Started

1. Clone the repository:

```bash
git clone https://github.com/yourusername/turkey-tokens.git
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Run the development server:

```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🎨 Customization

### Game Settings
You can modify game settings in `lib/game/utils.ts`:
- Turkey speed
- Spawn rates
- Difficulty progression
- Score multipliers

### Assets
- Sprites are located in the `public/sprites` directory
- Sound effects are in the `public/sounds` directory

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Turkey sprite assets
- Sound effects
- Game design inspiration

## 🐛 Known Issues

Please report any bugs or issues in the GitHub Issues section.

