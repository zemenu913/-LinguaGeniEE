
import React from 'react';
import { LinguaGenieIcon } from './icons/LinguaGenieIcon';

interface LoadingScreenProps {
  message: string;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ message }) => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <LinguaGenieIcon className="w-24 h-24 mb-6 text-green-500 animate-bounce" />
      <p className="text-xl text-gray-600 font-semibold text-center">{message}</p>
    </div>
  );
};

export default LoadingScreen;
