
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useExam } from '@/contexts/ExamContext';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { User, Clock, CheckCircle, Zap, Target } from 'lucide-react';

const ExamComponent = () => {
  const navigate = useNavigate();
  const { 
    questions, 
    currentQuestionIndex, 
    answers, 
    isCompleted,
    user,
    startExam,
    answerQuestion,
    nextQuestion
  } = useExam();

  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [timeElapsed, setTimeElapsed] = useState(0);

  useEffect(() => {
    startExam();
    const timer = setInterval(() => {
      setTimeElapsed(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (isCompleted) {
      navigate('/results');
    }
  }, [isCompleted, navigate]);

  useEffect(() => {
    setSelectedAnswer(null);
  }, [currentQuestionIndex]);

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    answerQuestion(answerIndex);
  };

  const handleNext = () => {
    if (selectedAnswer !== null) {
      nextQuestion();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const currentQuestion = questions[currentQuestionIndex];

  if (!currentQuestion) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-400/10 to-cyan-400/10 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto max-w-4xl p-4 relative z-10">
        {/* Header with user info and timer */}
        <div className="mb-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border-0">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="font-semibold text-gray-800">Welcome, {user?.name}</span>
                <p className="text-sm text-gray-500">Python Programming Expert</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 bg-gradient-to-r from-blue-50 to-purple-50 px-4 py-2 rounded-xl">
                <Clock className="w-5 h-5 text-blue-600" />
                <span className="font-mono text-blue-700 font-semibold">{formatTime(timeElapsed)}</span>
              </div>
            </div>
          </div>
          
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-blue-600 bg-clip-text text-transparent">
                Python Programming Exam
              </h1>
              <p className="text-gray-600 mt-1">Question {currentQuestionIndex + 1} of {questions.length}</p>
            </div>
            <div className="flex items-center space-x-2 bg-gradient-to-r from-green-50 to-blue-50 px-4 py-2 rounded-xl">
              <Target className="w-5 h-5 text-green-600" />
              <span className="text-sm font-semibold text-green-700">
                {Math.round(((currentQuestionIndex + 1) / questions.length) * 100)}% Complete
              </span>
            </div>
          </div>
          
          {/* Enhanced progress bar */}
          <div className="relative w-full bg-gray-100 rounded-full h-4 overflow-hidden">
            <div 
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-600 rounded-full transition-all duration-700 ease-out shadow-lg"
              style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
            >
              <div className="absolute inset-0 bg-white/20 rounded-full animate-pulse"></div>
            </div>
          </div>
          
          {/* Enhanced question indicators */}
          <div className="flex justify-center mt-6 space-x-2">
            {questions.map((_, index) => (
              <div
                key={index}
                className={`relative w-4 h-4 rounded-full transition-all duration-500 ${
                  index < currentQuestionIndex 
                    ? 'bg-gradient-to-r from-green-400 to-emerald-500 shadow-lg scale-110' 
                    : index === currentQuestionIndex 
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 animate-pulse shadow-lg scale-125' 
                    : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                {index < currentQuestionIndex && (
                  <CheckCircle className="w-3 h-3 text-white absolute top-0.5 left-0.5" />
                )}
              </div>
            ))}
          </div>
        </div>

        <Card className="mb-8 shadow-2xl animate-fade-in bg-white/90 backdrop-blur-sm border-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5"></div>
          <CardHeader className="relative z-10 bg-gradient-to-r from-blue-50 to-purple-50">
            <CardTitle className="text-xl flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">Q{currentQuestionIndex + 1}</span>
              </div>
              <span className="text-gray-800">{currentQuestion.question}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="relative z-10 p-8">
            <RadioGroup
              value={selectedAnswer?.toString() || ""}
              onValueChange={(value) => handleAnswerSelect(parseInt(value))}
              className="space-y-4"
            >
              {currentQuestion.options.map((option, index) => (
                <div 
                  key={index} 
                  className={`group relative flex items-center space-x-4 p-5 rounded-2xl border-2 transition-all duration-300 cursor-pointer hover:shadow-lg ${
                    selectedAnswer === index 
                      ? 'border-blue-500 bg-gradient-to-r from-blue-50 to-purple-50 shadow-lg transform scale-[1.02]' 
                      : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                  }`}
                  onClick={() => handleAnswerSelect(index)}
                >
                  <RadioGroupItem value={index.toString()} id={`option-${index}`} className="hidden" />
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                    selectedAnswer === index 
                      ? 'border-blue-500 bg-blue-500' 
                      : 'border-gray-300 group-hover:border-blue-400'
                  }`}>
                    {selectedAnswer === index && (
                      <div className="w-2 h-2 rounded-full bg-white"></div>
                    )}
                  </div>
                  <Label 
                    htmlFor={`option-${index}`} 
                    className="cursor-pointer flex-1 text-gray-700 font-medium"
                  >
                    <span className="inline-flex items-center">
                      <span className="w-8 h-8 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center mr-3 text-sm font-bold text-gray-600 group-hover:from-blue-100 group-hover:to-purple-100 group-hover:text-blue-600 transition-all duration-200">
                        {String.fromCharCode(65 + index)}
                      </span>
                      {option}
                    </span>
                  </Label>
                  {selectedAnswer === index && (
                    <Zap className="w-5 h-5 text-blue-600 animate-pulse" />
                  )}
                </div>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>

        <div className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={() => navigate('/')}
            className="bg-white/80 backdrop-blur-sm border-gray-200 hover:bg-red-50 hover:border-red-300 hover:text-red-600 transition-all duration-200 px-6 py-3 rounded-xl shadow-lg"
          >
            Exit Exam
          </Button>
          
          <Button 
            onClick={handleNext}
            disabled={selectedAnswer === null}
            className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg ${
              selectedAnswer !== null 
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white hover:shadow-xl transform hover:scale-105' 
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {currentQuestionIndex === questions.length - 1 ? 'Finish Exam' : 'Next Question'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ExamComponent;
