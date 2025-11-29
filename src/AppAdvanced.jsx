import { useEffect, useRef, useState } from 'react';
import './App.css';

function AppAdvanced() {
  const [isARSupported, setIsARSupported] = useState(true);
  const [cameraPermission, setCameraPermission] = useState(null);
  const [videoError, setVideoError] = useState(false);
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
    };
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
        <p>Point camera at the invitation card</p>
        {videoError && (
          <small style={{ display: 'block', marginTop: '5px', color: '#ffeb3b' }}>
            ⚠️ Video file missing. Add video to public/invitation-video.mp4
          </small>
        )}
      </div>

      <a-scene
        ref={sceneRef}
        embedded
        arjs="sourceType: webcam; debugUIEnabled: false; detectionMode: mono_and_matrix; matrixCodeType: 3x3;"
        vr-mode-ui="enabled: false"
      >
        <a-entity camera></a-entity>

        <a-marker preset="hiro" raycaster="objects: .clickable" emitevents="true">
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
