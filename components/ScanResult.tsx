
import React from 'react';
import { ErrorIcon, SparklesIcon } from './Icons';

type ScanResultData = {
  title: string;
  description: string;
  abilities: string[];
};

interface ScanResultProps {
  result: ScanResultData | null;
  error: string | null;
  onReset: () => void;
}

export const ScanResult: React.FC<ScanResultProps> = ({ result, error, onReset }) => {
  if (error) {
    return (
      <div className="w-full aspect-[4/3] max-w-lg bg-gray-800/80 backdrop-blur-sm rounded-2xl border-2 border-red-500/50 flex flex-col items-center justify-center text-center p-6 shadow-lg animate-fade-in">
        <ErrorIcon />
        <h3 className="mt-4 text-xl font-bold text-red-400">Analysis Failed</h3>
        <p className="mt-2 text-gray-300 max-w-md">{error}</p>
        <button
          onClick={onReset}
          className="mt-6 px-5 py-2 bg-red-500 hover:bg-red-400 text-white font-bold rounded-full transition-colors duration-300"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!result) {
    return null; // Or a placeholder
  }

  return (
    <div className="w-full max-w-lg bg-gray-800/80 backdrop-blur-sm rounded-2xl border-2 border-cyan-500/50 shadow-2xl shadow-cyan-900/50 p-6 flex flex-col animate-fade-in">
      <div className="flex-grow overflow-y-auto pr-2">
        <h2 className="text-3xl font-bold text-cyan-400 text-center mb-4 drop-shadow-[0_0_5px_rgba(0,255,255,0.7)]">
          {result.title}
        </h2>
        <p className="text-gray-300 mb-6 text-center italic">{result.description}</p>
        
        {result.abilities.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-cyan-300 mb-3 flex items-center gap-2">
              <SparklesIcon />
              Abilities
            </h3>
            <ul className="space-y-2 list-inside">
              {result.abilities.map((ability, index) => (
                <li key={index} className="text-gray-200 bg-gray-700/50 p-3 rounded-lg border-l-4 border-cyan-500">
                  {ability}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <div className="mt-6 text-center">
        <button
          onClick={onReset}
          className="px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-gray-900 font-bold rounded-full shadow-lg shadow-cyan-500/30 hover:shadow-cyan-400/50 transition-all duration-300 transform hover:scale-105"
        >
          Scan Another Card
        </button>
      </div>
    </div>
  );
};
