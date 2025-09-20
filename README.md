
# Yeobooth

Yeobooth is a modern, minimalist web-based photobooth application built with React, TypeScript, Vite, and TailwindCSS. It allows users to capture photos using their webcam, select from multiple layout and frame options, and download a beautifully composited image with a live preview. The project is designed for both desktop and mobile use, with a focus on a clean, glassmorphic UI and a seamless user experience.

## Features

- Minimalist, glassmorphic user interface
- Three layout options: 1x1, 1x3, and 2x2
- Two frame styles per layout (Yeobooth and White)
- Real-time webcam capture with countdown and flash effect
- Live preview that matches the final downloadable image (including frame and caption)
- Custom caption support with real-time preview
- Download high-quality PNG collages
- Responsive design for desktop and mobile
- Extensible architecture for adding new layouts, frames, or features
- (AR filters coming soon)

## Table of Contents
- [Demo](#demo)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Usage Guide](#usage-guide)
- [Customization](#customization)
- [Technical Details](#technical-details)
- [Contributing](#contributing)
- [License](#license)

## Demo

To run the project locally, see [Getting Started](#getting-started).

## Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm (comes with Node.js)

### Installation

1. Clone the repository:
   ```sh
   git clone <your-repo-url>
   cd yeobooth
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the development server:
   ```sh
   npm run dev
   ```
4. Open your browser to the local address shown in the terminal (default: http://localhost:5173)

### Build for Production

```sh
npm run build
```

### Linting

```sh
npm run lint
```

## Project Structure

```
your-project/
├── public/                # Static assets (SVGs, icons, etc.)
├── src/
│   ├── components/
│   │   ├── LandingPage.tsx    # Welcome screen
│   │   ├── Selection.tsx      # Layout and frame selection
│   │   └── Photobooth.tsx     # Main photobooth functionality
│   ├── assets/                # Frame images and icons
│   ├── index.css              # Tailwind and custom styles
│   ├── App.tsx                # App routing
│   └── main.tsx               # App entry point
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## Usage Guide

### User Flow
1. **Landing Page**: Click the camera button to start.
2. **Selection Page**: Choose your preferred layout and frame. Options include:
   - Layouts: 1x1 (single), 1x3 (strip), 2x2 (grid)
   - Frames: Yeobooth or White (per layout)
3. **Photobooth**:
   - See a live, square camera preview
   - Take photos (with countdown and flash)
   - Progress indicator for multi-shot layouts
   - Add a custom caption (live preview)
   - Download the final composited image (frame, photos, caption)
   - Start a new session or return to selection at any time

### Layouts and Frames
- **1x1**: Single large photo
- **1x3**: Three vertical photos (strip)
- **2x2**: Four photos in a grid
- Each layout supports two frame styles (Yeobooth and White)

### Downloaded Image
- The downloaded PNG matches the live preview exactly, including:
  - Frame
  - Photo arrangement
  - Caption (if provided)
  - Outlines and rounded corners

## Customization

### Adding Layouts or Frames
- To add a new layout, extend the `layouts` array in `Photobooth.tsx` and `Selection.tsx`.
- To add a new frame, add the image to `src/assets/frames/` and update the `frames` object in both files.

### Styling
- Modify `src/index.css` for custom glassmorphism, fonts, and color palette.
- TailwindCSS is used for utility-first styling and responsive design.

### Fonts
- Uses "Cherry Bomb One" and "DynaPuff" from Google Fonts (see `index.css`).

## Technical Details

- **React 19** with functional components and hooks
- **TypeScript** for type safety
- **Vite** for fast development and builds
- **TailwindCSS** for styling
- **React Router** for navigation
- **Canvas API** for compositing photos, frames, and captions
- **Webcam access** via `navigator.mediaDevices.getUserMedia`
- **Live preview** uses an offscreen canvas to match the download output
- **Responsive**: All UI components adapt to mobile and desktop

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for bug fixes, new features, or improvements.

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.
