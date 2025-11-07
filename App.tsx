
import React, { useState, useCallback } from 'react';
import { Language, LessonData, Level } from './types';
import { generateLesson } from './services/geminiService';
import LanguageSelector from './components/LanguageSelector';
import LevelSelector from './components/LevelSelector';
import Lesson from './components/Lesson';
import LoadingScreen from './components/LoadingScreen';
import { LANGUAGES } from './constants';

const App: React.FC = () => {
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<Level | null>(null);
  const [currentLesson, setCurrentLesson] = useState<LessonData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [error, setError] = useState<string | null>(null);

  const startNewLesson = useCallback(async (language: Language, level: Level) => {
    setIsLoading(true);
    setError(null);
    setCurrentLesson(null);

    try {
      setLoadingMessage(`Crafting your ${level} ${language.name} lesson...`);
      const lessonPlan = await generateLesson(language.name, level);

      if (!lessonPlan || lessonPlan.questions.length === 0) {
        throw new Error('Failed to generate a valid lesson plan.');
      }

      setLoadingMessage('Generating lesson images...');
      const questionsWithImages = await Promise.all(
        lessonPlan.questions.map(async (question, index) => {
          setLoadingMessage(`Generating image ${index + 1} of ${lessonPlan.questions.length}: ${question.prompt}...`);
          // NOTE: For simplicity, re-using the existing generateImage function. 
          // In a real app, prompts might be adjusted based on level.
          const { generateImage } = await import('./services/geminiService');
          const imageUrl = await generateImage(question.prompt);
          return { ...question, imageUrl };
        })
      );

      setCurrentLesson({ ...lessonPlan, questions: questionsWithImages });
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred. Please try again.');
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  }, []);
  
  const handleSelectLanguage = (language: Language) => {
    setSelectedLanguage(language);
    setSelectedLevel(null);
  };

  const handleSelectLevel = (level: Level) => {
    if(selectedLanguage) {
        setSelectedLevel(level);
        startNewLesson(selectedLanguage, level);
    }
  };

  const resetSelection = () => {
      setSelectedLanguage(null);
      setSelectedLevel(null);
      setCurrentLesson(null);
      setError(null);
  }

  const renderContent = () => {
    if (isLoading) {
      return <LoadingScreen message={loadingMessage} />;
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center h-screen text-center p-4">
          <h2 className="text-2xl font-bold text-red-500 mb-4">Oops! Something went wrong.</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={resetSelection}
            className="px-6 py-3 bg-green-500 text-white font-bold rounded-xl shadow-md hover:bg-green-600 transition-colors"
          >
            Start Over
          </button>
        </div>
      );
    }

    if (currentLesson && selectedLanguage) {
      return <Lesson lesson={currentLesson} language={selectedLanguage} onComplete={resetSelection} />;
    }
    
    if (selectedLanguage) {
        return <LevelSelector language={selectedLanguage} onSelectLevel={handleSelectLevel} onBack={() => setSelectedLanguage(null)} />;
    }

    return <LanguageSelector languages={LANGUAGES} onSelect={handleSelectLanguage} />;
  };

  return (
    <div className="bg-gray-50 min-h-screen text-gray-800">
      <div className="container mx-auto max-w-2xl p-4">
        {renderContent()}
      </div>
    </div>
  );
};

export default App;
