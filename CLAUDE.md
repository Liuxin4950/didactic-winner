# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A 3D vision simulator built with React + TypeScript + Vite that simulates myopia/hyperopia/astigmatism vision effects in real-time. Users can input vision parameters (sphere, cylinder, axis) and see the visual blur effects on a 3D rendered scene.

## Commands

```bash
# Install dependencies and start dev server
pnpm dev

# Build for production
pnpm build

# Production build with BUILD_MODE=prod
pnpm build:prod

# Run ESLint
pnpm lint

# Preview production build
pnpm preview
```

## Tech Stack

- **React 18** + **TypeScript** + **Vite**
- **react-three-fiber** + **@react-three/drei** (3D rendering)
- **@react-three/postprocessing** (bloom, depth-of-field effects)
- **Three.js** (core 3D library)
- **Tailwind CSS** (styling)
- **Radix UI** (accessible UI primitives)
- **pnpm** (package manager)
- **Playwright** (testing)

## Architecture

```
src/
├── App.tsx              # Root component with layout
├── contexts/
│   └── VisionContext.tsx    # Global state: vision params + view mode
├── components/
│   ├── 3d/
│   │   ├── Scene3D.tsx         # Main 3D canvas with postprocessing
│   │   ├── EyeModel.tsx        # 3D eye model
│   │   └── SimulationScene.tsx # Vision simulation scene
│   ├── ui/
│   │   └── ControlPanel.tsx    # Vision parameter controls
│   └── ErrorBoundary.tsx
├── hooks/
│   └── use-mobile.tsx
└── lib/
    └── utils.ts         # tailwind-merge utility
```

## State Management

Uses React Context (`VisionContext`) with:
- `params`: Vision parameters `{ sphere, cylinder, axis }`
- `viewMode`: Either `'anatomy'` (3D eye model) or `'simulation'` (blur effect view)

## 3D Rendering Pipeline

1. Scene3D renders a `@react-three/fiber` Canvas
2. Based on `viewMode`, renders either:
   - **Anatomy view**: EyeModel with OrbitControls, Environment lighting
   - **Simulation view**: SimulationScene with postprocessing blur effects
3. Post-processing: Bloom + DepthOfField (myopia blur effect)

## Key Files to Modify

- `src/contexts/VisionContext.tsx` - Vision parameters and view mode state
- `src/components/3d/Scene3D.tsx` - 3D rendering and postprocessing setup
- `src/components/3d/SimulationScene.tsx` - Vision simulation scene content
- `src/components/ui/ControlPanel.tsx` - Parameter input controls
