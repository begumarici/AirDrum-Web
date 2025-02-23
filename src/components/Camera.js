import React, { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import SkeletonDetection from "./SkeletonDetection";

const Camera = ({ deviceId }) => {
  const webcamRef = useRef(null);
  const [startSkeleton, setStartSkeleton] = useState(false);

  useEffect(() => {
    return () => {
      if (webcamRef.current && webcamRef.current.stream) {
        webcamRef.current.stream.getTracks().forEach((track) => track.stop());
      }
      setStartSkeleton(false);
    };
  }, []);
  

  return (
    <div className="camera-container">
      <Webcam
        ref={webcamRef}
        audio={false}
        videoConstraints={{ deviceId: deviceId ? { exact: deviceId } : undefined }}
        onUserMedia={() => {
          setTimeout(() => setStartSkeleton(true), 1000);
        }}
        onUserMediaStopped={() => {
          setStartSkeleton(false);
        }}
        style={{
          display: "none", 
        }}
      />
      {startSkeleton && webcamRef.current && webcamRef.current.video && (
        <SkeletonDetection videoElement={webcamRef.current.video} />
      )}
    </div>
  );
};

export default Camera;