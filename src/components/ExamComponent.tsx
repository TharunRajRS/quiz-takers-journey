
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useExam } from '@/contexts/ExamContext';
import { CheckCircle, Clock, ArrowRight, BookOpen } from 'lucide-react';

const ExamComponent = () => {
  const navigate = useNavigate();
  const { 
    questions, 
    currentQuestionIndex, 
    answers, 
    startExam, 
    answerQuestion, 
    nextQuestion,
    user 
  } = useExam();
  
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes

  useEffect(() => {
    console.log('ExamComponent mounted, starting exam...');
    startExam();
  }, [startExam]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          console.log('Time is up, navigating to results');
          navigate('/results');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  useEffect(() => {
    console.log(`Question changed to index: ${currentQuestionIndex}`);
    setSelectedAnswer(null);
  }, [currentQuestionIndex]);

  const handleAnswerSelect = (answerIndex: number) => {
    console.log(`Selected answer: ${answerIndex} for question ${currentQuestionIndex}`);
    setSelectedAnswer(answerIndex);
    answerQuestion(answerIndex);
  };

  const handleNext = () => {
    if (selectedAnswer !== null) {
      console.log(`Processing next question. Current: ${currentQuestionIndex}, Total: ${questions.length}`);
      
      if (currentQuestionIndex === questions.length - 1) {
        console.log('Last question completed, moving to results');
        nextQuestion();
        // Small delay to ensure state is updated before navigation
        setTimeout(() => {
          navigate('/results');
        }, 100);
      } else {
        console.log('Moving to next question');
        nextQuestion();
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  if (!currentQuestion) {
    console.log('No current question found, showing loading...');
    return <div>Loading...</div>;
  }

  console.log(`Rendering question ${currentQuestionIndex + 1}: ${currentQuestion.question}`);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-400/10 to-cyan-400/10 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto max-w-4xl p-4 relative z-10">
        {/* Enhanced Header */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 mb-8 border-0">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-800">Welcome, {user?.name}!</h2>
                <p className="text-gray-600 text-sm">Python Programming Exam</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-xl shadow-lg">
              <Clock className="w-4 h-4" />
              <span className="font-bold">{formatTime(timeLeft)}</span>
            </div>
          </div>
          
          {/* Enhanced Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Question {currentQuestionIndex + 1} of {questions.length}</span>
              <span className="text-blue-600 font-semibold">{Math.round(progress)}% Complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-500 ease-out shadow-sm"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Enhanced Question Card */}
        <Card className="shadow-2xl bg-white/90 backdrop-blur-sm border-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/3 to-purple-500/3"></div>
          <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 relative z-10">
            <CardTitle className="text-xl text-gray-800 flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm font-bold">{currentQuestionIndex + 1}</span>
              </div>
              <span>Question {currentQuestionIndex + 1}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8 relative z-10">
            <h3 className="text-xl font-bold mb-8 text-gray-800 leading-relaxed">
              {currentQuestion.question}
            </h3>
            
            <div className="space-y-4">
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  className={`w-full p-6 text-left rounded-2xl border-2 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg ${
                    selectedAnswer === index
                      ? 'border-blue-500 bg-gradient-to-r from-blue-50 to-purple-50 shadow-lg'
                      : 'border-gray-200 bg-white/80 backdrop-blur-sm hover:border-blue-300 hover:bg-blue-50'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                      selectedAnswer === index
                        ? 'border-blue-500 bg-blue-500 text-white'
                        : 'border-gray-300 text-gray-600'
                    }`}>
                      {String.fromCharCode(65 + index)}
                    </div>
                    <span className="text-gray-800 font-medium">{option}</span>
                    {selectedAnswer === index && (
                      <CheckCircle className="w-5 h-5 text-blue-500 ml-auto" />
                    )}
                  </div>
                </button>
              ))}
            </div>

            <div className="flex justify-end mt-8">
              <Button 
                onClick={handleNext}
                disabled={selectedAnswer === null}
                className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                  selectedAnswer !== null
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {currentQuestionIndex === questions.length - 1 ? 'Submit Exam' : 'Next Question'}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ExamComponent;
