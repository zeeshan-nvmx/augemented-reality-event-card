# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AR Invitation Card is a React-based web application that uses AR.js and A-Frame to display video overlays on physical invitation card markers via mobile device cameras. The app supports both basic AR marker tracking (using the Hiro marker) and an advanced flow with QR code scanning before AR activation.

## Development Commands

```bash
# Install dependencies
npm install

# Start development server (runs on port 3000)
npm start

# Run tests
npm test

# Build for production
npm run build
```

## Mobile Testing Setup

AR features require HTTPS and camera access. For mobile testing:

```bash
# Install ngrok globally if not already installed
npm install -g ngrok

# Start the dev server first
npm start

# In a separate terminal, create HTTPS tunnel
ngrok http 3000
```

Use the ngrok HTTPS URL on mobile devices to test AR functionality.

## Architecture

### Two App Versions

The project has two complete app implementations that can be swapped by editing `src/index.jsx`:

1. **App.jsx** (Basic AR): Direct AR marker tracking with video overlay
   - Camera permission flow → AR scene with marker detection
   - Uses Hiro marker preset by default

2. **AppAdvanced.jsx** (QR + AR): Two-stage flow with QR code scanning first
   - Stage 1: QR code scanning using jsQR library
   - Stage 2: AR marker tracking (same as basic version)
   - Includes "Skip QR Scan" button for testing

To switch versions, modify the import in `src/index.jsx`:
```jsx
import App from './App';           // Basic AR
import App from './AppAdvanced';   // QR + AR flow
```

### AR Scene Configuration

Both app versions use A-Frame with AR.js for marker-based AR:

- **A-Frame**: 3D scene framework (v1.4.2)
- **AR.js**: Marker tracking library
- Scripts loaded dynamically in `useEffect` hooks
- Scene configured with `arjs` attribute on `<a-scene>` element

Key AR.js settings:
- `sourceType: webcam`: Use device camera
- `debugUIEnabled: false`: Hide debug UI
- `detectionMode: mono_and_matrix`: Support both marker types
- `matrixCodeType: 3x3`: QR matrix code configuration

### Video Overlay System

Videos are defined in two places within each App component:

1. **Assets section** (`<a-assets>`): Video element with ID (line ~130 in App.jsx, ~233 in AppAdvanced.jsx)
   ```jsx
   <video id="invitation-video" src="/sample-video.mp4" ...>
   ```

2. **Marker content** (`<a-marker>`): A-Frame video entity referencing the asset (line ~108 in App.jsx, ~214 in AppAdvanced.jsx)
   ```jsx
   <a-video src="#invitation-video" width="1.6" height="0.9" rotation="-90 0 0">
   ```

The video must be in the `public/` folder. Update both the `src` attribute in the `<video>` tag and ensure the ID matches the reference in `<a-video>`.

### Marker Configuration

Default marker: Hiro preset (`preset="hiro"`)

To use custom markers (e.g., actual invitation card image):

1. Generate `.patt` file at: https://ar-js-org.github.io/AR.js/three.js/examples/marker-training/examples/generator.html
2. Save to `public/` folder
3. Update marker configuration in App.jsx (line ~106) or AppAdvanced.jsx (line ~212):
   ```jsx
   <a-marker type="pattern" url="/your-marker.patt">
   ```

### Camera Permissions & State Management

Both apps follow the same permission flow:

1. Check browser support (`navigator.mediaDevices`)
2. Request camera permissions
3. Display appropriate UI based on state:
   - `null`: Loading/requesting
   - `'denied'`: Permission denied error
   - `'granted'`: Show AR scene

Camera streams are properly cleaned up in `useEffect` return functions to prevent memory leaks.

### Styling

- `public/index.html`: Global mobile optimizations (viewport, touch behavior, fixed positioning)
- `src/App.css`: Basic AR version styles
- `src/AppAdvanced.css`: QR scanning UI and two-stage flow styles
- Mobile-first design with fullscreen camera views

## Common Customizations

**Change video source:**
- Place video file in `public/` folder
- Update `src` in both App.jsx and AppAdvanced.jsx at the `<video>` element

**Adjust video size/position:**
- Modify `width`, `height`, `position`, `rotation` attributes on `<a-video>` element
- Default: 1.6x0.9 size, -90° rotation to lay flat on marker

**Configure marker tracking:**
- Marker element attributes: `preset`, `type`, `url`, `raycaster`, `emitevents`
- Video position is relative to marker origin (0,0,0)

## Deployment

**Vercel:**
```bash
npm install -g vercel
vercel
```

**Netlify:**
```bash
npm run build
npx netlify-cli deploy --prod
```

Both platforms provide HTTPS automatically, which is required for camera access.
