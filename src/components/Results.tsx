
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useExam } from '@/contexts/ExamContext';
import { Trophy, Award, Target, RotateCcw, CheckCircle, X, Home } from 'lucide-react';

const Results = () => {
  const { userName, score, questions, answers, resetExam } = useExam();
  const navigate = useNavigate();

  useEffect(() => {
    if (!userName) {
      navigate('/');
      return;
    }
  }, [userName, navigate]);

  const percentage = (score / questions.length) * 100;
  
  const getGrade = () => {
    if (percentage >= 90) return { grade: 'A+', color: 'text-green-600', message: 'Outstanding!' };
    if (percentage >= 80) return { grade: 'A', color: 'text-green-500', message: 'Excellent!' };
    if (percentage >= 70) return { grade: 'B', color: 'text-blue-500', message: 'Good Job!' };
    if (percentage >= 60) return { grade: 'C', color: 'text-yellow-500', message: 'Fair' };
    return { grade: 'F', color: 'text-red-500', message: 'Need Improvement' };
  };

  const { grade, color, message } = getGrade();

  const handleRetakeExam = () => {
    resetExam();
    navigate('/exam');
  };

  const handleGoHome = () => {
    navigate('/');
  };

  if (!userName) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Results Header */}
        <Card className="mb-6 animate-fade-in">
          <CardHeader className="text-center">
            <div className="flex justify-between items-start mb-4">
              <div></div>
              <div className="mx-auto w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                <Trophy className="w-10 h-10 text-white" />
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleGoHome}
                className="flex items-center space-x-1"
              >
                <Home className="w-4 h-4" />
                <span>Home</span>
              </Button>
            </div>
            <CardTitle className="text-3xl font-bold text-gray-800 mb-2">
              Exam Complete!
            </CardTitle>
            <p className="text-lg text-gray-600">Congratulations, {userName}!</p>
          </CardHeader>
          
          <CardContent className="text-center space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Award className="w-8 h-8 mx-auto text-blue-500" />
                <h3 className="font-semibold text-gray-700">Your Score</h3>
                <p className="text-3xl font-bold text-blue-600">{score} / {questions.length}</p>
              </div>
              
              <div className="space-y-2">
                <Target className="w-8 h-8 mx-auto text-purple-500" />
                <h3 className="font-semibold text-gray-700">Percentage</h3>
                <p className="text-3xl font-bold text-purple-600">{percentage.toFixed(1)}%</p>
              </div>
              
              <div className="space-y-2">
                <Trophy className="w-8 h-8 mx-auto text-yellow-500" />
                <h3 className="font-semibold text-gray-700">Grade</h3>
                <p className={`text-3xl font-bold ${color}`}>{grade}</p>
              </div>
            </div>
            
            <div className={`text-xl font-semibold ${color}`}>
              {message}
            </div>
          </CardContent>
        </Card>

        {/* Detailed Results */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-xl text-gray-800">Question Review</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {questions.map((question, index) => {
              const isCorrect = answers[index] === question.correctAnswer;
              const userAnswer = answers[index];
              
              return (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <div className={`mt-1 ${isCorrect ? 'text-green-500' : 'text-red-500'}`}>
                      {isCorrect ? <CheckCircle className="w-5 h-5" /> : <X className="w-5 h-5" />}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800 mb-2">
                        {index + 1}. {question.question}
                      </h4>
                      <div className="space-y-1 text-sm">
                        <p className={`${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                          Your answer: {question.options[userAnswer] || 'Not answered'}
                        </p>
                        {!isCorrect && (
                          <p className="text-green-600">
                            Correct answer: {question.options[question.correctAnswer]}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="text-center">
          <Button
            onClick={handleRetakeExam}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-3 text-lg"
          >
            <RotateCcw className="w-5 h-5 mr-2" />
            Take Exam Again
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Results;
