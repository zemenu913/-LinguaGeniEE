
import React, { useState, useMemo } from 'react';
import { LessonData, Language, QuestionWithImage } from '../types';
import ProgressBar from './ProgressBar';
import Feedback from './Feedback';
import LessonCompleted from './LessonCompleted';
import QuestionDisplay from './QuestionDisplay';
import { getHint } from '../services/geminiService';

interface LessonProps {
  lesson: LessonData;
  language: Language;
  onComplete: () => void;
}

type AnswerState = 'unanswered' | 'selected' | 'checking';
type FeedbackState = 'correct' | 'incorrect' | null;

const Lesson: React.FC<LessonProps> = ({ lesson, language, onComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [answerState, setAnswerState] = useState<AnswerState>('unanswered');
  const [feedback, setFeedback] = useState<FeedbackState>(null);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [hint, setHint] = useState<string | null>(null);
  const [isHintLoading, setIsHintLoading] = useState(false);

  const currentQuestion = useMemo(() => lesson.questions[currentQuestionIndex], [lesson.questions, currentQuestionIndex]);

  const handleSelectOption = (option: string) => {
    if (answerState === 'unanswered' || answerState === 'selected') {
      setSelectedOption(option);
      setAnswerState('selected');
    }
  };

  const handleCheckAnswer = () => {
    if (!selectedOption) return;
    setAnswerState('checking');
    const isCorrect = selectedOption === currentQuestion.correctAnswer;
    if (isCorrect) {
      setFeedback('correct');
      setCorrectAnswers(prev => prev + 1);
    } else {
      setFeedback('incorrect');
    }
  };

  const handleContinue = () => {
    if (currentQuestionIndex < lesson.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      resetQuestionState();
    } else {
      // Lesson finished
    }
  };
  
  const handleRequestHint = async () => {
    setIsHintLoading(true);
    setHint(null);
    const generatedHint = await getHint(currentQuestion.questionText, currentQuestion.options, language.name);
    setHint(generatedHint);
    setIsHintLoading(false);
  };

  const resetQuestionState = () => {
      setSelectedOption(null);
      setAnswerState('unanswered');
      setFeedback(null);
      setHint(null);
      setIsHintLoading(false);
  };
  
  const isLessonFinished = currentQuestionIndex >= lesson.questions.length;

  if (isLessonFinished) {
    return <LessonCompleted score={correctAnswers} total={lesson.questions.length} onRestart={onComplete} />;
  }

  const getButtonState = (option: string) => {
    if (answerState !== 'checking') {
      return option === selectedOption ? 'selected' : 'default';
    }
    // State is 'checking'
    if (option === currentQuestion.correctAnswer) return 'correct';
    if (option === selectedOption && option !== currentQuestion.correctAnswer) return 'incorrect';
    return 'disabled';
  };

  return (
    <div className="flex flex-col h-screen">
        <header className="p-4">
            <ProgressBar current={currentQuestionIndex + 1} total={lesson.questions.length} />
        </header>

        <main className="flex-grow flex flex-col justify-between p-4">
            <QuestionDisplay 
                question={currentQuestion} 
                onSelectOption={handleSelectOption}
                selectedOption={selectedOption}
                getButtonState={getButtonState}
                hint={hint}
                isHintLoading={isHintLoading}
                onRequestHint={handleRequestHint}
                answerState={answerState}
            />
        </main>
        
        <footer className="h-36">
            {feedback ? (
                <Feedback
                    isCorrect={feedback === 'correct'}
                    correctAnswer={currentQuestion.correctAnswer}
                    onContinue={handleContinue}
                />
            ) : (
                <div className="p-4 border-t-2 border-gray-200 flex items-center">
                    <button
                        onClick={handleCheckAnswer}
                        disabled={answerState !== 'selected'}
                        className="w-full py-4 text-xl font-bold text-white uppercase rounded-2xl transition-all duration-200 disabled:bg-gray-300 bg-green-500 hover:bg-green-600"
                    >
                        Check
                    </button>
                </div>
            )}
        </footer>
    </div>
  );
};


export default Lesson;
