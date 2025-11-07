
import React from 'react';

interface FeedbackProps {
  isCorrect: boolean;
  correctAnswer: string;
  onContinue: () => void;
}

const Feedback: React.FC<FeedbackProps> = ({ isCorrect, correctAnswer, onContinue }) => {
  const bgColor = isCorrect ? 'bg-green-100' : 'bg-red-100';
  const textColor = isCorrect ? 'text-green-600' : 'text-red-600';
  const buttonColor = isCorrect ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600';
  const message = isCorrect ? 'Excellent!' : 'Correct solution:';

  return (
    <div className={`fixed bottom-0 left-0 right-0 p-4 ${bgColor} transition-transform duration-300`}>
        <div className="max-w-2xl mx-auto flex justify-between items-center">
            <div>
                <h3 className={`text-xl font-bold ${textColor}`}>{message}</h3>
                {!isCorrect && <p className={`text-lg font-semibold ${textColor}`}>{correctAnswer}</p>}
            </div>
            <button
                onClick={onContinue}
                className={`px-10 py-3 text-lg font-bold text-white uppercase rounded-2xl ${buttonColor}`}
            >
                Continue
            </button>
        </div>
    </div>
  );
};

export default Feedback;
