import { useEffect, useRef, useState } from 'react';
import './App.css';

function AppAdvanced() {
  const [isARSupported, setIsARSupported] = useState(true);
  const [cameraPermission, setCameraPermission] = useState(null);
  const [videoError, setVideoError] = useState(false);
  const [markerFound, setMarkerFound] = useState(false);
  const sceneRef = useRef(null);

  // Initial setup - check support and request permissions
  useEffect(() => {
    // Suppress cross-origin script errors from A-Frame/AR.js
    const handleGlobalError = (event) => {
      if (event.message === 'Script error.') {
        event.preventDefault();
        return true;
      }
    };
    window.addEventListener('error', handleGlobalError);

    // Check browser support
    const checkSupport = () => {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setIsARSupported(false);
        return false;
      }
      return true;
    };

    if (checkSupport()) {
      navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
        .then(() => {
          setCameraPermission('granted');
        })
        .catch((err) => {
          console.error('Camera permission denied:', err);
          setCameraPermission('denied');
        });
    }

    // Load AR.js and A-Frame scripts
    const loadScripts = () => {
      // Check if scripts are already loaded
      if (document.querySelector('script[src*="aframe"]')) {
        return;
      }

      const aframeScript = document.createElement('script');
      aframeScript.src = 'https://aframe.io/releases/1.4.2/aframe.min.js';
      aframeScript.crossOrigin = 'anonymous';

      aframeScript.onerror = () => {
        console.error('Failed to load A-Frame');
      };

      aframeScript.onload = () => {
        const arScript = document.createElement('script');
        arScript.src = 'https://raw.githack.com/AR-js-org/AR.js/master/aframe/build/aframe-ar.js';
        arScript.crossOrigin = 'anonymous';

        arScript.onerror = () => {
          console.error('Failed to load AR.js');
        };

        document.head.appendChild(arScript);
      };

      document.head.appendChild(aframeScript);
    };

    loadScripts();

    // Fix canvas sizing after AR.js loads - ULTRA AGGRESSIVE for mobile portrait
    const applyFix = () => {
      const canvas = document.querySelector('canvas.a-canvas');
      const video = document.querySelector('video.arjs-video');
      const container = document.querySelector('.a-canvas');
      const aScene = document.querySelector('a-scene');

      const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
      const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);

      console.log('Viewport:', vw, 'x', vh, 'Orientation:', window.orientation || window.screen?.orientation?.angle);

      if (canvas) {
        // Set CSS properties
        canvas.style.setProperty('width', vw + 'px', 'important');
        canvas.style.setProperty('height', vh + 'px', 'important');
        canvas.style.setProperty('min-width', vw + 'px', 'important');
        canvas.style.setProperty('min-height', vh + 'px', 'important');
        canvas.style.setProperty('max-width', vw + 'px', 'important');
        canvas.style.setProperty('max-height', vh + 'px', 'important');
        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.right = '0';
        canvas.style.bottom = '0';
        canvas.style.zIndex = '0';
        canvas.style.display = 'block';
        canvas.style.margin = '0';
        canvas.style.padding = '0';
        canvas.style.transform = 'none';

        // Set actual canvas resolution
        canvas.width = vw;
        canvas.height = vh;

        console.log('Canvas fixed:', vw, 'x', vh, '- Canvas actual:', canvas.width, 'x', canvas.height);
      }

      if (video) {
        video.style.setProperty('width', vw + 'px', 'important');
        video.style.setProperty('height', vh + 'px', 'important');
        video.style.position = 'fixed';
        video.style.top = '0';
        video.style.left = '0';
        video.style.right = '0';
        video.style.bottom = '0';
        video.style.objectFit = 'cover';
        video.style.zIndex = '0';
        console.log('Video fixed:', vw, 'x', vh);
      }

      if (container) {
        container.style.width = vw + 'px';
        container.style.height = vh + 'px';
      }

      if (aScene) {
        aScene.style.width = vw + 'px';
        aScene.style.height = vh + 'px';
      }
    };

    // Apply fix on load
    setTimeout(applyFix, 500);
    setTimeout(applyFix, 1000);
    setTimeout(applyFix, 2000);
    setTimeout(applyFix, 3000);
    setTimeout(applyFix, 4000);

    // Keep applying periodically for first 15 seconds
    const interval = setInterval(applyFix, 1000);
    setTimeout(() => clearInterval(interval), 15000);

    // Apply on resize and orientation change
    const handleResize = () => {
      console.log('Window resized or orientation changed');
      setTimeout(applyFix, 100);
      setTimeout(applyFix, 500);
      setTimeout(applyFix, 1000);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
    if (window.screen?.orientation) {
      window.screen.orientation.addEventListener('change', handleResize);
    }

    // Set up video error handler
    const handleVideoError = () => {
      console.warn('Video file not found. Add your video to public/invitation-video.mp4');
      setVideoError(true);
    };

    // Add event listener after a short delay to ensure video element exists
    setTimeout(() => {
      const videoElement = document.getElementById('invitation-video');
      if (videoElement) {
        videoElement.addEventListener('error', handleVideoError);
      }
    }, 1000);

    return () => {
      window.removeEventListener('error', handleGlobalError);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
      if (window.screen?.orientation) {
        window.screen.orientation.removeEventListener('change', handleResize);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Set up marker detection event listeners
  useEffect(() => {
    const setupMarkerListeners = () => {
      setTimeout(() => {
        const marker = document.querySelector('a-marker');
        if (marker) {
          marker.addEventListener('markerFound', () => {
            console.log('Marker found!');
            setMarkerFound(true);
          });
          marker.addEventListener('markerLost', () => {
            console.log('Marker lost');
            setMarkerFound(false);
          });
        }
      }, 2000);
    };

    setupMarkerListeners();
  }, []);

  if (!isARSupported) {
    return (
      <div className="error-container">
        <h2>AR Not Supported</h2>
        <p>Your browser doesn't support AR features.</p>
      </div>
    );
  }

  if (cameraPermission === 'denied') {
    return (
      <div className="error-container">
        <h2>Camera Permission Required</h2>
        <p>Please allow camera access to use this app.</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  if (cameraPermission === null) {
    return (
      <div className="loading-container">
        <h2>Requesting Camera Access...</h2>
      </div>
    );
  }

  return (
    <div className="App">
      <div className="instructions">
        <p>
          {markerFound ? '✓ Marker Detected!' : 'Point camera at the invitation card'}
        </p>
        {!markerFound && (
          <small style={{ display: 'block', marginTop: '5px', opacity: 0.8 }}>
            Looking for marker...
          </small>
        )}
        {videoError && (
          <small style={{ display: 'block', marginTop: '5px', color: '#ffeb3b' }}>
            ⚠️ Video file missing. Add video to public/invitation-video.mp4
          </small>
        )}
      </div>

      <a-scene
        ref={sceneRef}
        embedded
        arjs="sourceType: webcam; debugUIEnabled: true; detectionMode: mono_and_matrix; matrixCodeType: 3x3; trackingMethod: best;"
        vr-mode-ui="enabled: false"
        renderer="logarithmicDepthBuffer: true; precision: medium;"
        style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 0 }}
      >
        <a-entity camera></a-entity>

        <a-marker
          preset="hiro"
          raycaster="objects: .clickable"
          emitevents="true"
          cursor="fuse: false; rayOrigin: mouse;"
        >
          {!videoError && (
            <a-video
              src="#invitation-video"
              width="1.6"
              height="0.9"
              position="0 0 0"
              rotation="-90 0 0"
              opacity="1"
            ></a-video>
          )}

          {/* Placeholder when video is missing */}
          {videoError && (
            <a-box
              color="#667eea"
              width="1.6"
              height="0.9"
              depth="0.1"
              position="0 0 0"
              rotation="-90 0 0"
            ></a-box>
          )}

          <a-plane
            color="#ffffff"
            width="1.7"
            height="1"
            position="0 0 -0.01"
            rotation="-90 0 0"
            opacity="0.8"
          ></a-plane>
        </a-marker>

        <a-assets>
          <video
            id="invitation-video"
            src="/invitation-video.mp4"
            preload="auto"
            autoPlay
            loop
            crossOrigin="anonymous"
            playsInline
            muted
          ></video>
        </a-assets>
      </a-scene>
    </div>
  );
}

export default AppAdvanced;
