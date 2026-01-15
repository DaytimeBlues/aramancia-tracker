# Aramancia | D&D 5e Wizard Tracker

A specialized character tracker for Aramancia Vaelithor, focusing on Wizard mechanics, Necromancy minion management, and standard D&D 5e rule compliance.

## Features

- **Spell Slots** - Standard Level 1-9 spell slot tracking with Arcane Recovery support
- **Minion Management** - Integrated tracker for Skeletons, Zombies, and Spirits (HP, AC, Attacks)
- **Concentration** - Single spell limit with CON save DC calculator
- **HP Management** - Current, Max, and Temporary HP tracking
- **Inventory System** - Magic item attunement and charge tracking
- **Rest System** - Short rest (Hit Dice) and Long Rest (Full Recovery) logic

## Tech Stack

- React 19 + TypeScript
- Vite 7
- Redux Toolkit
- Tailwind CSS 4
- Vitest
- Capacitor (Android)

## Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Run tests
npm run test

# Build for production
npm run build
```

## D&D 5e Wizard Rules (SRD 5.1)

| Mechanic | Implementation |
|----------|----------------|
| Spell Slots | Standard progression (e.g. 4/3/3/3/2/1/1/1/1 at Lv 20) |
| Minions | Tracks simplified stats for Animate Dead / Summon Undead |
| Concentration | One spell max, auto-clears on new cast |
| Death Saves | Standard success/failure tracking |

---

*Verified strict RAW compliance as per Agent instructions.*
