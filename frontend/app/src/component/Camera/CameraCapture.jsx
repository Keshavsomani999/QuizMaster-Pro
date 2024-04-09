import React, { useRef, useState, useEffect } from 'react';
import * as faceapi from 'face-api.js';

const CameraCapture = () => {
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [faceDetected, setFaceDetected] = useState(false);

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = mediaStream;
      setStream(mediaStream);

      // Load face-api.js models
      Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
        faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
        faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
      ]).then(() => {
        setInterval(detectFace, 100); // Call detectFace every second
      });
    } catch (error) {
      console.error('Error accessing camera:', error);
    }
  };

  const stopCamera = () => {
    if (stream) {
      const tracks = stream.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setStream(null);
    }
  };

  const detectFace = async () => {
    const detections = await faceapi.detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions());
    setFaceDetected(!!detections);
  };

  useEffect(() => {
    if (!faceDetected) {
      alert("Face not detected! Please move your face in front of the camera.");
    }
  }, [faceDetected]);

  return (
    <div>
      <video ref={videoRef} autoPlay></video>
    </div>
  );
};

export default CameraCapture;
