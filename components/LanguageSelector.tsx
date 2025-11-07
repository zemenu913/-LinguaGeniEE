
import React from 'react';
import { Language } from '../types';
import { LinguaGenieIcon } from './icons/LinguaGenieIcon';

interface LanguageSelectorProps {
  languages: Language[];
  onSelect: (language: Language) => void;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ languages, onSelect }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-8">
        <LinguaGenieIcon className="w-24 h-24 mb-4 text-green-500" />
        <h1 className="text-4xl font-extrabold text-gray-800 mb-2">Welcome to LinguaGenie</h1>
        <p className="text-lg text-gray-500 mb-10">Choose a language to start your journey!</p>
        <div className="w-full grid grid-cols-2 gap-4">
            {languages.map((lang) => (
            <button
                key={lang.code}
                onClick={() => onSelect(lang)}
                className="group flex flex-col items-center justify-center p-6 bg-white border-2 border-gray-200 rounded-xl hover:border-green-400 hover:bg-green-50 transition-all duration-200"
            >
                <span className="text-5xl mb-3">{lang.flag}</span>
                <span className="text-xl font-bold text-gray-700 group-hover:text-green-600">{lang.name}</span>
            </button>
            ))}
      </div>
    </div>
  );
};

export default LanguageSelector;
