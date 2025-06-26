
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useExam } from '@/contexts/ExamContext';
import { ChevronLeft, ChevronRight, CheckCircle, Zap, Brain, Clock, Sparkles } from 'lucide-react';

const Exam = () => {
  const {
    userName,
    currentQuestion,
    setCurrentQuestion,
    answers,
    setAnswer,
    questions,
    calculateScore
  } = useExam();
  
  const navigate = useNavigate();
  const [selectedAnswer, setSelectedAnswer] = useState<number>(answers[currentQuestion]);

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    setAnswer(currentQuestion, answerIndex);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(answers[currentQuestion + 1]);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedAnswer(answers[currentQuestion - 1]);
    }
  };

  const handleSubmit = () => {
    calculateScore();
    navigate('/results');
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const answeredQuestions = answers.filter(answer => answer !== -1).length;

  if (!userName) {
    navigate('/');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50 p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-gradient-to-br from-purple-300/10 to-pink-300/10 rounded-full animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-gradient-to-tl from-blue-300/10 to-cyan-300/10 rounded-full animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 mb-8 border-0 hover:shadow-2xl transition-shadow duration-500">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent flex items-center gap-2">
                <Brain className="w-8 h-8 text-purple-600" />
                Python Exam
              </h1>
              <p className="text-gray-600 text-lg">Welcome, <span className="font-semibold text-purple-600">{userName}</span>! 🚀</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500 mb-1">Progress</p>
              <p className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {currentQuestion + 1} / {questions.length}
              </p>
            </div>
          </div>
          
          <div className="space-y-3">
            <Progress value={progress} className="h-3 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500 ease-out rounded-full"
                style={{ width: `${progress}%` }}
              />
            </Progress>
            <div className="flex justify-between text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                Question {currentQuestion + 1}
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle className="w-4 h-4 text-green-500" />
                {answeredQuestions} / {questions.length} answered
              </span>
            </div>
          </div>
        </div>

        {/* Question Card */}
        <Card className="mb-8 animate-fade-in border-0 shadow-xl bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-500">
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl text-gray-800 flex items-center gap-2">
              <Zap className="w-6 h-6 text-yellow-500" />
              {questions[currentQuestion].question}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {questions[currentQuestion].options.map((option, index) => (
              <div
                key={index}
                className={`p-5 rounded-xl border-2 cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-[1.02] ${
                  selectedAnswer === index
                    ? 'border-purple-500 bg-gradient-to-r from-purple-50 to-pink-50 shadow-lg transform scale-[1.02]'
                    : 'border-gray-200 hover:border-purple-300 bg-white/50'
                }`}
                onClick={() => handleAnswerSelect(index)}
              >
                <div className="flex items-center space-x-4">
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                      selectedAnswer === index
                        ? 'border-purple-500 bg-purple-500 shadow-lg'
                        : 'border-gray-300 hover:border-purple-400'
                    }`}
                  >
                    {selectedAnswer === index && (
                      <CheckCircle className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <span className="text-gray-700 text-lg">{option}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className="flex items-center space-x-2 h-12 px-6 border-2 border-gray-200 hover:border-purple-400 hover:bg-purple-50 rounded-xl transition-all duration-300 hover:scale-105 disabled:hover:scale-100"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="text-lg">Previous</span>
          </Button>

          <div className="flex space-x-2">
            {questions.map((_, index) => (
              <div
                key={index}
                className={`w-4 h-4 rounded-full transition-all duration-300 ${
                  answers[index] !== -1
                    ? 'bg-gradient-to-r from-green-400 to-green-600 shadow-lg'
                    : index === currentQuestion
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg animate-pulse'
                    : 'bg-gray-300'
                }`}
              />
            ))}
          </div>

          {currentQuestion === questions.length - 1 ? (
            <Button
              onClick={handleSubmit}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 h-12 px-6 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
              disabled={answeredQuestions < questions.length}
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Submit Exam
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              className="flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 h-12 px-6 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              <span>Next</span>
              <ChevronRight className="w-5 h-5" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Exam;
