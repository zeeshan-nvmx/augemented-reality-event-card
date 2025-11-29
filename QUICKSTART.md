# Quick Start - AR Invitation Card

## 🚀 Get Running in 3 Minutes

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Server
```bash
npm start
```

### 3. Test on Mobile
```bash
# In new terminal
ngrok http 3000
```

Open ngrok HTTPS URL on mobile → Allow camera → Point at Hiro marker!

## 📥 Get Hiro Marker

Download & print: https://raw.githubusercontent.com/AR-js-org/AR.js/master/data/images/hiro.png

Or display on another screen and point your phone at it.

## 🎥 Add Your Video

1. Put video in `public/my-video.mp4`
2. Edit `src/App.jsx` line 95:
   ```jsx
   src="/my-video.mp4"
   ```

## 🎯 Use Your Invitation as Marker

1. Generate at: https://ar-js-org.github.io/AR.js/three.js/examples/marker-training/examples/generator.html
2. Save `.patt` file to `public/`
3. Edit `src/App.jsx` line 72:
   ```jsx
   <a-marker type="pattern" url="/invitation.patt">
   ```

## 🚀 Deploy

```bash
# Vercel (easiest)
npm install -g vercel
vercel

# Or Netlify
npm run build
npx netlify-cli deploy --prod
```

That's it! 🎉
