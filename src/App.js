import React, { useState, useRef } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import ReactH5Player from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import "./App.css";
import Camera from "./components/Camera";

const songs = [
  { title: "Imagine Dragons - Believer (drumless)", src: "/songs/Believer.mp3" },
  { title: "Winter Acoustic Guitar Backing Track In C Major", src: "/songs/winter.mp3" },
  
];

function HomePage() {
  const hiHatRef = useRef(new Audio("/sounds/Closed-Hi-Hat-1.wav"));
  const crashRef = useRef(new Audio("/sounds/Crash-Cymbal-1.wav"));

  const handleMouseEnter = () => {
    hiHatRef.current.currentTime = 0;
    hiHatRef.current.play();
  };

  const handleClick = () => {
    crashRef.current.currentTime = 0;
    crashRef.current.play();
  };

  return (
    <div className="App">
      <div className="frame">
        <h1>Air Drum</h1>
        <p>Enjoy playing drums using your camera and hand movements!</p>
        <Link to="/drum">
          <button
            className="start-button"
            onMouseEnter={handleMouseEnter}
            onClick={handleClick}
          >
            Start
          </button>
        </Link>
      </div>
    </div>
  );
}

function DrumPage() {
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [devices, setDevices] = useState([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState("");
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const streamRef = useRef(null);

  const handleToggleCamera = () => {
    if (!isCameraActive) {
      navigator.mediaDevices
        .getUserMedia({ video: { deviceId: selectedDeviceId } })
        .then((stream) => {
          streamRef.current = stream;
          navigator.mediaDevices.enumerateDevices().then((devices) => {
            const videoDevices = devices.filter(
              (device) => device.kind === "videoinput"
            );
            setDevices(videoDevices);
            if (videoDevices.length > 0) {
              setSelectedDeviceId(videoDevices[0].deviceId);
            }
            setIsCameraActive(true);
          });
        })
        .catch((err) => {
          console.error("Camera permission not granted:", err);
        });
    } else {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
      setIsCameraActive(false);
      setDevices([]);
      setSelectedDeviceId("");
    }
  };

  const handleNext = () => {
    setCurrentSongIndex((prev) => (prev + 1) % songs.length);
  };

  const handlePrevious = () => {
    setCurrentSongIndex((prev) =>
      prev === 0 ? songs.length - 1 : prev - 1
    );
  };

  return (
    <div className="App2">
      <header>
        <div className="info-box">
          <h2>How It Works?</h2>
          <ul>
            <li>
              Move your <strong>right hand</strong> downward at hip level in the
              middle of your body to trigger the <strong>hi-hat</strong> sound.
            </li>
            <li>
              Move your <strong>left hand</strong> downward at hip level in the
              middle of your body to trigger the <strong>snare</strong> sound.
            </li>
            <li>
              Lift your <strong>right foot</strong> and press it back down to
              trigger the <strong>bass drum</strong>.
            </li>
            <li>
              Swing your <strong>right hand</strong> outward to the right side
              of your body to trigger the <strong>crash</strong> sound.
            </li>
            <li>
              Swing your <strong>left hand</strong> outward to the left side of
              your body to trigger the <strong>cymbal</strong> sound.
            </li>
            <li>
      Use the <strong>drumless music player</strong> to play along with 
      music tracks designed for practice. 
    </li>
          </ul>
          <p className="note">
            <strong>Note:</strong> Ensure your camera is positioned to capture
            your full body for accurate motion detection. Perform your movements
            clearly and distinctly to trigger the correct sounds. Avoid small or
            subtle movements, as they may not be detected by the system.
          </p>
        </div>

        <h1 className="app2_h1">Let's Play!</h1>
        <div className="controls">
  <div className="button-group">
    <button onClick={handleToggleCamera} className="toggle-camera-button">
      {isCameraActive ? "Stop Camera" : "Start Camera"}
    </button>
    <Link to="/">
      <button className="back-button">Back to Home</button>
    </Link>
  </div>
  <div className="additional-controls">
    <div className="camera-selection">
      <label htmlFor="camera-select">Select Camera:</label>
      <select
        id="camera-select"
        onChange={(e) => setSelectedDeviceId(e.target.value)}
        value={selectedDeviceId}
        disabled={!isCameraActive} // Kamera aktif değilse devre dışı bırak
      >
        {devices.length > 0 ? (
          devices.map((device, index) => (
            <option key={device.deviceId} value={device.deviceId}>
              {device.label || `Camera ${index + 1}`}
            </option>
          ))
        ) : (
          <option value="">No cameras available</option>
        )}
      </select>
    </div>
    <div className="music-player">
  <ReactH5Player
    src={songs[currentSongIndex].src}
    onClickNext={handleNext}
    onClickPrevious={handlePrevious}
    onEnded={handleNext}
    showSkipControls
    showJumpControls={false}
    header={
      <div className="rhap_header">
        <div className="scroll-container">
          <span>{songs[currentSongIndex].title} • </span>
          <span>{songs[currentSongIndex].title} • </span>
        </div>
      </div>
    }
    autoPlay={false}
    controls={isCameraActive} // Kamera aktif değilse player kontrolleri devre dışı
  />
</div>


  </div>
</div>


      </header>

      <main>
        {isCameraActive && (
          <div className="camera-frame">
            <Camera deviceId={selectedDeviceId} />
          </div>
        )}
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/drum" element={<DrumPage />} />
      </Routes>
    </Router>
  );
}

export default App;
