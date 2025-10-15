
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { ScanIcon, ErrorIcon } from './Icons';

interface CameraViewProps {
  onScan: (imageBase64: string) => void;
  isLoading: boolean;
}

export const CameraView: React.FC<CameraViewProps> = ({ onScan, isLoading }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;
    const enableCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error('Error accessing camera:', err);
        setCameraError('Camera access was denied. Please enable camera permissions in your browser settings.');
      }
    };

    enableCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleScanClick = useCallback(() => {
    if (isLoading || !videoRef.current || !canvasRef.current) {
      return;
    }
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (context) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
      const imageDataUrl = canvas.toDataURL('image/jpeg', 0.9);
      onScan(imageDataUrl);
    }
  }, [isLoading, onScan]);

  if (cameraError) {
    return (
      <div className="w-full aspect-square bg-gray-800 rounded-2xl border-2 border-red-500/50 flex flex-col items-center justify-center text-center p-6 shadow-lg">
        <ErrorIcon />
        <h3 className="mt-4 text-xl font-bold text-red-400">Camera Error</h3>
        <p className="mt-2 text-gray-300">{cameraError}</p>
      </div>
    );
  }

  return (
    <div className="w-full relative flex flex-col items-center">
      <div className="relative w-full aspect-[4/3] max-w-lg bg-black rounded-2xl overflow-hidden border-2 border-cyan-500/30 shadow-2xl shadow-cyan-900/50">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/30 pointer-events-none"></div>
        {/* Scanning Reticle */}
        <div className="absolute inset-8 border-2 border-cyan-400/50 rounded-lg flex items-center justify-center pointer-events-none">
           <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-cyan-400 rounded-tl-lg"></div>
           <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-cyan-400 rounded-tr-lg"></div>
           <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-cyan-400 rounded-bl-lg"></div>
           <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-cyan-400 rounded-br-lg"></div>
        </div>
        <canvas ref={canvasRef} className="hidden" />
      </div>

      <button
        onClick={handleScanClick}
        disabled={isLoading}
        className="mt-6 w-24 h-24 rounded-full bg-cyan-500 disabled:bg-gray-600 flex items-center justify-center transition-all duration-300 ease-in-out transform hover:scale-105 disabled:scale-100 focus:outline-none focus:ring-4 focus:ring-cyan-300/50 shadow-lg shadow-cyan-500/40"
      >
        {isLoading ? (
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-white"></div>
        ) : (
          <ScanIcon />
        )}
      </button>
       <p className="mt-4 text-gray-400">
        {isLoading ? 'Analyzing...' : 'Position card and press scan'}
       </p>
    </div>
  );
};
