import React, { useEffect, useRef } from "react";
import { Pose } from "@mediapipe/pose";
import MovementDetector from "./MovementDetector";
import SoundTrigger from "./SoundTrigger";

const SkeletonDetection = ({ videoElement }) => {
  const canvasRef = useRef(null);
  const visualsRef = useRef({});
  const poseRef = useRef(null);

  const soundTrigger = new SoundTrigger();

  const movementDetector = new MovementDetector({
    playSound: (soundName) => {
      const visualElement = visualsRef.current[soundName];
      if (visualElement) {
        visualElement.style.opacity = "1"; // Make the visual visible
        visualElement.style.animation = "none"; // Reset animation

        // Make the visual semi-transparent again
        setTimeout(() => {
          visualElement.style.opacity = "0.5"; 
        }, 300);
      }

      soundTrigger.playSound(soundName);
    },
  });

  useEffect(() => {
    if (!videoElement) return;

    const canvasElement = canvasRef.current;
    const canvasCtx = canvasElement.getContext("2d");

    const pose = new Pose({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`,
    });

    pose.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      enableSegmentation: false,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    pose.onResults((results) => {
      canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);

      if (results.poseLandmarks) {
        Object.keys(visualsRef.current).forEach((key) => {
          visualsRef.current[key].style.visibility = "visible";
        });

        canvasCtx.save();
        canvasCtx.translate(canvasElement.width, 0);
        canvasCtx.scale(-1, 1); // Mirror effect

        canvasCtx.drawImage(
          videoElement,
          0,
          0,
          canvasElement.width,
          canvasElement.height
        );

        canvasCtx.restore();
        movementDetector.detectMovement(results.poseLandmarks);

        const landmarks = results.poseLandmarks;

        if (landmarks) {
          const leftHip = landmarks[23];
          const rightHip = landmarks[24];
          const leftShoulder = landmarks[11];
          const rightShoulder = landmarks[12];

          // Position visuals based on skeleton
          visualsRef.current["hihat"].style.left = `${
            canvasRef.current.width - leftHip.x * canvasElement.width
          }px`;
          visualsRef.current["hihat"].style.top = `${
            leftHip.y * canvasElement.height + 25
          }px`;

          visualsRef.current["snare"].style.left = `${
            canvasRef.current.width - rightHip.x * canvasElement.width
          }px`;
          visualsRef.current["snare"].style.top = `${
            rightHip.y * canvasElement.height + 25
          }px`;

          visualsRef.current["cymbal"].style.left = `${
            canvasRef.current.width - (rightShoulder.x * canvasElement.width + 400)
          }px`;
          visualsRef.current["cymbal"].style.top = `${
            rightShoulder.y * canvasElement.height
          }px`;

          visualsRef.current["crash"].style.left = `${
            canvasRef.current.width - (leftShoulder.x * canvasElement.width - 400)
          }px`;
          visualsRef.current["crash"].style.top = `${
            leftShoulder.y * canvasElement.height
          }px`;

          visualsRef.current["bass"].style.left = `${
            canvasRef.current.width - (rightHip.x * canvasElement.width - 130) 
          }px`;
          visualsRef.current["bass"].style.top = `${
            rightHip.y * canvasElement.height + 300 
          }px`;
          
        }
      } else {
        Object.keys(visualsRef.current).forEach((key) => {
          visualsRef.current[key].style.visibility = "hidden";
        });
      }
    });

    poseRef.current = pose;

    const camera = new window.Camera(videoElement, {
      onFrame: async () => {
        await pose.send({ image: videoElement });
      },
      width: 960,
      height: 720,
    });

    camera.start();

    return () => {
      if (poseRef.current) {
        poseRef.current.close(); // Properly close the pose instance
        poseRef.current = null;
      }

      if (videoElement.srcObject) {
        videoElement.srcObject.getTracks().forEach((track) => track.stop());
        videoElement.srcObject = null; // Clear the video source
      }

      const canvasCtx = canvasElement.getContext("2d");
      if (canvasCtx) {
        canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
      }
    };
  }, [videoElement]);

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <canvas
        ref={canvasRef}
        width="960"
        height="720"
        style={{
          width: "100%",
          height: "100%",
        }}
      />
      {["crash", "snare", "hihat", "cymbal", "bass"].map((key) => (
        <img
          ref={(el) => (visualsRef.current[key] = el)}
          key={key}
          src={`/images/${key}.png`}
          alt={key}
          className={`${key}-visual`}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            transform: "translate(-50%, -50%)",
            width: "150px",
            height: "150px",
            opacity: 0.3,
            visibility: "hidden",
            transition: "opacity 0.5s ease-out",
          }}
        />
      ))}
    </div>
  );
};

export default SkeletonDetection;
