# AR Invitation Card with Video Overlay

A React-based web application that uses AR.js and A-Frame to display a video overlay on an invitation card marker when scanned with a mobile device camera.

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm start
```

## Testing on Mobile

Since AR requires HTTPS and camera access, use ngrok:

```bash
# Install ngrok
npm install -g ngrok

# Start ngrok tunnel
ngrok http 3000
```

Open the HTTPS URL on your mobile device!

## Features

- 📱 Mobile AR Support (iOS & Android)
- 🎥 Video tracking locked to card position
- 🔄 Real-time marker tracking
- 📷 Camera integration

## Using Custom Marker

1. Generate marker at: https://ar-js-org.github.io/AR.js/three.js/examples/marker-training/examples/generator.html
2. Save `.patt` file to `public/`
3. Update `App.jsx`:
   ```jsx
   <a-marker type="pattern" url="/your-marker.patt">
   ```

## Add Your Video

1. Place video in `public/` folder
2. Update `src/App.jsx`:
   ```jsx
   <video id="invitation-video" src="/your-video.mp4" ...>
   ```

## Deploy

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

## Switching Between Versions

Edit `src/index.jsx`:
- Basic AR: `import App from './App';`
- QR + AR: `import App from './AppAdvanced';`

## Documentation

- Full setup guide
- Marker customization guide
- Deployment instructions
- Troubleshooting tips

## License

MIT
