import { useEffect, useRef, useState } from 'react';
import './App.css';

function App() {
  const [isARSupported, setIsARSupported] = useState(true);
  const [cameraPermission, setCameraPermission] = useState(null);
  const [videoError, setVideoError] = useState(false);
  const sceneRef = useRef(null);

  useEffect(() => {
    // Suppress cross-origin script errors from A-Frame/AR.js
    const handleGlobalError = (event) => {
      if (event.message === 'Script error.') {
        event.preventDefault();
        return true;
      }
    };
    window.addEventListener('error', handleGlobalError);

    // Check if the browser supports necessary features
    const checkSupport = () => {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setIsARSupported(false);
        return false;
      }
      return true;
    };

    if (checkSupport()) {
      // Request camera permission (use back camera on mobile)
      navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      })
        .then(() => {
          setCameraPermission('granted');
        })
        .catch((err) => {
          console.error('Camera permission denied:', err);
          setCameraPermission('denied');
        });
    }

    // Load AR.js and A-Frame scripts dynamically
    const loadScripts = () => {
      // Check if scripts are already loaded
      if (document.querySelector('script[src*="aframe"]')) {
        return;
      }

      // A-Frame
      const aframeScript = document.createElement('script');
      aframeScript.src = 'https://aframe.io/releases/1.4.2/aframe.min.js';
      aframeScript.crossOrigin = 'anonymous';

      aframeScript.onerror = () => {
        console.error('Failed to load A-Frame');
      };

      aframeScript.onload = () => {
        // AR.js
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

    // Fix canvas sizing after AR.js loads
    const fixCanvasSize = () => {
      setTimeout(() => {
        const canvas = document.querySelector('canvas.a-canvas');
        const video = document.querySelector('video.arjs-video');

        if (canvas) {
          canvas.style.width = '100vw';
          canvas.style.height = '100vh';
          canvas.style.position = 'fixed';
          canvas.style.top = '0';
          canvas.style.left = '0';
          console.log('Canvas fixed:', canvas.style.width, canvas.style.height);
        }

        if (video) {
          video.style.width = '100vw';
          video.style.height = '100vh';
          video.style.position = 'fixed';
          video.style.top = '0';
          video.style.left = '0';
          video.style.objectFit = 'cover';
          console.log('Video fixed:', video.style.width, video.style.height);
        }
      }, 2000);

      // Try again after 4 seconds in case it takes longer
      setTimeout(() => {
        const canvas = document.querySelector('canvas.a-canvas');
        const video = document.querySelector('video.arjs-video');
        if (canvas) {
          canvas.style.width = '100vw';
          canvas.style.height = '100vh';
        }
        if (video) {
          video.style.width = '100vw';
          video.style.height = '100vh';
        }
      }, 4000);
    };

    fixCanvasSize();

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
      // Cleanup: stop video streams when component unmounts
      /* eslint-disable react-hooks/exhaustive-deps */
      window.removeEventListener('error', handleGlobalError);
      if (sceneRef.current) {
        const video = sceneRef.current.querySelector('video');
        if (video && video.srcObject) {
          const tracks = video.srcObject.getTracks();
          tracks.forEach(track => track.stop());
        }
      }
      /* eslint-enable react-hooks/exhaustive-deps */
    };
  }, []);

  if (!isARSupported) {
    return (
      <div className="error-container">
        <h2>AR Not Supported</h2>
        <p>Your browser doesn't support the required features for AR. Please use a modern mobile browser.</p>
      </div>
    );
  }

  if (cameraPermission === 'denied') {
    return (
      <div className="error-container">
        <h2>Camera Permission Required</h2>
        <p>Please allow camera access to use AR features.</p>
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
        <p>Point your camera at the Hiro marker</p>
        {videoError && (
          <small style={{ display: 'block', marginTop: '5px', color: '#ffeb3b' }}>
            ⚠️ Video file missing. Add video to public/invitation-video.mp4
          </small>
        )}
      </div>

      {/* AR Scene */}
      <a-scene
        ref={sceneRef}
        embedded
        arjs="sourceType: webcam; debugUIEnabled: true; detectionMode: mono_and_matrix; matrixCodeType: 3x3; trackingMethod: best;"
        vr-mode-ui="enabled: false"
        renderer="logarithmicDepthBuffer: true; precision: medium;"
        style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh' }}
      >
        {/* Camera */}
        <a-entity camera></a-entity>

        {/* Marker - Using Hiro pattern (you can generate custom markers) */}
        <a-marker preset="hiro" raycaster="objects: .clickable" emitevents="true" cursor="fuse: false; rayOrigin: mouse;">
          {/* Video Element - Replace with your actual video URL */}
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

          {/* Optional: Add a border/frame around the content */}
          <a-plane
            color="#ffffff"
            width="1.7"
            height="1"
            position="0 0 -0.01"
            rotation="-90 0 0"
            opacity="0.8"
          ></a-plane>
        </a-marker>

        {/* Assets */}
        <a-assets>
          {/* Replace this video URL with your actual video */}
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

      {/* Debug Info (optional) */}
      <div className="debug-info">
        <small>Move your device slowly for better tracking</small>
      </div>
    </div>
  );
}

export default App;
