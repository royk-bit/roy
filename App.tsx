
import React, { useState, useCallback } from 'react';
import { CameraView } from './components/CameraView';
import { ScanResult } from './components/ScanResult';
import { analyzeFlamCard } from './services/geminiService';
import { LogoIcon } from './components/Icons';

type ScanResultData = {
  title: string;
  description: string;
  abilities: string[];
};


const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [scanResult, setScanResult] = useState<ScanResultData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);

  const handleScan = useCallback(async (imageBase64: string) => {
    setIsLoading(true);
    setError(null);
    setScanResult(null);
    try {
      const resultText = await analyzeFlamCard(imageBase64);
      
      // Basic parsing of the response. A more robust solution might use JSON mode.
      const lines = resultText.split('\n').filter(line => line.trim() !== '');
      const title = lines.find(line => line.startsWith('**'))?.replace(/\*\*/g, '').trim() || 'Unknown Card';
      const description = lines.find(line => !line.startsWith('**') && !line.startsWith('*') && line.length > 20) || 'No description available.';
      const abilities = lines.filter(line => line.startsWith('* ')).map(line => line.replace('* ', '').trim());

      const parsedResult: ScanResultData = {
          title,
          description,
          abilities
      };

      setScanResult(parsedResult);
    } catch (err) {
      console.error(err);
      setError('Failed to analyze card. The AI may be offline, or the image could not be processed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const resetScanner = () => {
    setScanResult(null);
    setError(null);
  };

  const startCamera = () => {
    setIsCameraActive(true);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl mx-auto flex flex-col items-center">
        <header className="flex items-center space-x-3 mb-4">
          <LogoIcon />
          <h1 className="text-3xl font-bold tracking-wider text-cyan-400 drop-shadow-[0_0_5px_rgba(0,255,255,0.7)]">
            FLAM SCANNER
          </h1>
        </header>

        {!isCameraActive ? (
          <div className="text-center p-8 bg-gray-800/50 rounded-lg border border-cyan-500/30">
            <p className="mb-6 text-gray-300">Activate your camera to scan a Flam Card.</p>
            <button
              onClick={startCamera}
              className="px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-gray-900 font-bold rounded-full shadow-lg shadow-cyan-500/30 hover:shadow-cyan-400/50 transition-all duration-300 transform hover:scale-105"
            >
              Activate Camera
            </button>
          </div>
        ) : (
          <div className="w-full relative">
            {scanResult || error ? (
              <ScanResult result={scanResult} error={error} onReset={resetScanner} />
            ) : (
              <CameraView onScan={handleScan} isLoading={isLoading} />
            )}
          </div>
        )}
        
        <footer className="mt-8 text-xs text-gray-500">
          Powered by Gemini API. For entertainment purposes only.
        </footer>
      </div>
    </div>
  );
};

export default App;
