
import React from 'react';
import { QuestionWithImage } from '../types';

interface QuestionDisplayProps {
    question: QuestionWithImage;
    onSelectOption: (option: string) => void;
    selectedOption: string | null;
    getButtonState: (option: string) => 'default' | 'selected' | 'correct' | 'incorrect' | 'disabled';
    hint: string | null;
    isHintLoading: boolean;
    onRequestHint: () => void;
    answerState: 'unanswered' | 'selected' | 'checking';
}

const OptionButton: React.FC<{
    option: string;
    state: 'default' | 'selected' | 'correct' | 'incorrect' | 'disabled';
    onClick: (option: string) => void;
}> = ({ option, state, onClick }) => {
    
    const baseClasses = "w-full p-4 border-2 rounded-2xl text-lg text-gray-700 font-bold transition-all duration-200 text-left";

    const stateClasses = {
        default: "bg-white border-gray-200 hover:bg-gray-100 hover:border-gray-300",
        selected: "bg-blue-100 border-blue-400",
        correct: "bg-green-100 border-green-500 text-green-700",
        incorrect: "bg-red-100 border-red-500 text-red-700",
        disabled: "bg-gray-100 border-gray-200 text-gray-400 opacity-70"
    };

    return (
        <button onClick={() => onClick(option)} disabled={state === 'disabled'} className={`${baseClasses} ${stateClasses[state]}`}>
            {option}
        </button>
    );
};


const QuestionDisplay: React.FC<QuestionDisplayProps> = ({
    question, onSelectOption, selectedOption, getButtonState,
    hint, isHintLoading, onRequestHint, answerState
}) => {
    return (
        <div className="flex flex-col items-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">{question.questionText}</h2>
            <div className="relative w-48 h-48 mb-6 bg-gray-100 rounded-lg flex items-center justify-center">
                {question.imageUrl ? (
                    <img src={question.imageUrl} alt={question.prompt} className="object-contain w-full h-full rounded-lg" />
                ) : (
                    <div className="w-full h-full bg-gray-200 animate-pulse rounded-lg"></div>
                )}
            </div>

            <div className="w-full max-w-md space-y-3">
                {question.options.map((option, index) => (
                    <OptionButton 
                        key={index} 
                        option={option} 
                        state={getButtonState(option)} 
                        onClick={onSelectOption} 
                    />
                ))}
            </div>

            {answerState !== 'checking' && (
                <div className="mt-6 text-center">
                    {hint ? (
                        <p className="text-gray-600 bg-yellow-100 border border-yellow-300 p-3 rounded-lg">{hint}</p>
                    ) : (
                        <button onClick={onRequestHint} disabled={isHintLoading} className="text-blue-500 hover:text-blue-700 font-semibold disabled:opacity-50">
                            {isHintLoading ? 'Getting a hint...' : 'Need a hint?'}
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

export default QuestionDisplay;
