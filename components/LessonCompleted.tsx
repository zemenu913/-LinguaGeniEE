
import React from 'react';
import { LinguaGenieIcon } from './icons/LinguaGenieIcon';

interface LessonCompletedProps {
  score: number;
  total: number;
  onRestart: () => void;
}

const LessonCompleted: React.FC<LessonCompletedProps> = ({ score, total, onRestart }) => {
  const percentage = Math.round((score / total) * 100);

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center p-4">
      <LinguaGenieIcon className="w-24 h-24 mb-4 text-green-500"/>
      <h2 className="text-3xl font-extrabold text-gray-800 mb-2">Lesson Complete!</h2>
      <p className="text-lg text-gray-500 mb-6">Great job, you're making progress!</p>
      
      <div className="mb-8">
        <p className="text-5xl font-bold text-green-500">{percentage}%</p>
        <p className="text-gray-600">Score: {score} / {total}</p>
      </div>

      <button
        onClick={onRestart}
        className="w-full max-w-sm py-4 text-xl font-bold text-white uppercase rounded-2xl transition-colors duration-200 bg-green-500 hover:bg-green-600"
      >
        Start Over
      </button>
    </div>
  );
};

export default LessonCompleted;
