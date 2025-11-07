
import React from 'react';
import { Language, Level } from '../types';

interface LevelSelectorProps {
  language: Language;
  onSelectLevel: (level: Level) => void;
  onBack: () => void;
}

const levels: { name: Level; description: string }[] = [
  { name: 'Beginner', description: 'Start with basic vocabulary and simple phrases.' },
  { name: 'Intermediate', description: 'Tackle more complex sentences and grammar.' },
  { name: 'Advanced', description: 'Master nuanced grammar and idiomatic expressions.' },
];

const LevelSelector: React.FC<LevelSelectorProps> = ({ language, onSelectLevel, onBack }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-8">
        <div className="w-full text-left mb-8">
            <button onClick={onBack} className="text-lg text-gray-500 hover:text-gray-800 transition-colors">
                &larr; Back to Languages
            </button>
        </div>
        <span className="text-6xl mb-4">{language.flag}</span>
        <h1 className="text-3xl font-extrabold text-gray-800 mb-2">Learning {language.name}</h1>
        <p className="text-lg text-gray-500 mb-10">Choose your level to begin.</p>
        
        <div className="w-full max-w-sm space-y-4">
            {levels.map((level) => (
                <button
                    key={level.name}
                    onClick={() => onSelectLevel(level.name)}
                    className="w-full text-left p-5 bg-white border-2 border-gray-200 rounded-xl hover:border-green-400 hover:bg-green-50 transition-all duration-200 group"
                >
                    <h3 className="text-xl font-bold text-gray-700 group-hover:text-green-600">{level.name}</h3>
                    <p className="text-gray-500">{level.description}</p>
                </button>
            ))}
        </div>
    </div>
  );
};

export default LevelSelector;
