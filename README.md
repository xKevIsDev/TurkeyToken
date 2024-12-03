# Byte Blitz 🖥️

![Byte Blitz Screenshot](/public/screenshot.png)

A fast-paced browser game where you collect code fragments to prevent system memory leaks. Built with Next.js and Framer Motion.

## 🎮 Gameplay

- Use your mouse to control the system cursor
- Collect code fragments before they escape memory
- Each fragment collected increases your byte count
- Collect enough bytes to compile and advance levels
- Don't let 5 fragments leak or the system crashes!

## 🔥 Features

- Mouse-locked precision controls
- Progressive difficulty system:
  - More fragments spawn at higher levels
  - Fragments move faster in higher levels
  - Spawn rates increase with level progression
- Processing speed multiplier system
- Level progression with visual effects
- Retro tech sound effects
- Global leaderboard system

## 🎯 Game Mechanics

### System Progression
- Base number of fragments: 5 + current level
- Fragment speed increases with level
- Spawn rate increases with level (starts at 2s, decreases by 100ms per level, minimum 500ms)

### Scoring System
- Bytes awarded for each collected fragment
- Processing speed multiplier increases with each level
- Bytes needed for compilation increases per level
- System crash after 5 memory leaks

## 🛠️ Technical Stack

- Next.js 14
- TypeScript
- Framer Motion for animations
- Tailwind CSS for styling
- HTML5 Canvas for game rendering
- Web Audio API for sound effects
- Supabase for leaderboard

## 🚀 Getting Started

1. Clone the repository:

```bash
git clone https://github.com/yourusername/byte-blitz.git
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Set up environment variables:

```bash
cp .env.example .env.local
```
Then add your Supabase credentials to `.env.local`

4. Run the development server:

```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🎨 Customization

### Game Settings
You can modify game settings in `lib/game/utils.ts`:
- Fragment speed
- Spawn rates
- Difficulty progression
- Score multipliers

### Assets
- Sound effects are in the `public/sounds` directory
- Visual assets are in the `public/sprites` directory

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Sound effects:
  - [freesound_community](https://pixabay.com/users/freesound_community-46691455/)
  - [rescopicsound](https://pixabay.com/users/rescopicsound-45188866/)
- Game design inspiration from classic arcade games
- Built by [@KevIsDev](https://x.com/KevIsDev)

## 🐛 Known Issues

Please report any bugs or issues in the GitHub Issues section.

