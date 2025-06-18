
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useExam } from '@/contexts/ExamContext';
import { CheckCircle, XCircle, Trophy, RotateCcw, User, BarChart3, Home, Sparkles } from 'lucide-react';

const ResultsComponent = () => {
  const navigate = useNavigate();
  const { questions, answers, score, isCompleted, user, resetExam, saveResults } = useExam();

  useEffect(() => {
    if (!isCompleted) {
      navigate('/');
    } else {
      saveResults();
    }
  }, [isCompleted, navigate, saveResults]);

  const handleRetakeExam = () => {
    resetExam();
    navigate('/exam');
  };

  const getScoreColor = (score: number, total: number) => {
    const percentage = (score / total) * 100;
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreMessage = (score: number, total: number) => {
    const percentage = (score / total) * 100;
    if (percentage >= 90) return 'Excellent! You have mastered Python fundamentals!';
    if (percentage >= 80) return 'Great job! You have a solid understanding of Python.';
    if (percentage >= 70) return 'Good work! Keep practicing to improve further.';
    if (percentage >= 60) return 'Not bad! Review the concepts and try again.';
    return 'Keep studying! Python mastery takes practice.';
  };

  const getGradeBadge = (score: number, total: number) => {
    const percentage = (score / total) * 100;
    if (percentage >= 90) return { grade: 'A+', color: 'from-green-400 to-emerald-500' };
    if (percentage >= 80) return { grade: 'A', color: 'from-green-400 to-green-500' };
    if (percentage >= 70) return { grade: 'B', color: 'from-blue-400 to-blue-500' };
    if (percentage >= 60) return { grade: 'C', color: 'from-yellow-400 to-yellow-500' };
    return { grade: 'F', color: 'from-red-400 to-red-500' };
  };

  if (!isCompleted) {
    return <div>Loading...</div>;
  }

  const gradeBadge = getGradeBadge(score, questions.length);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-400/10 to-cyan-400/10 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto max-w-5xl p-4 relative z-10">
        {/* Enhanced User Info Header */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 mb-8 border-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">{user?.name}</h2>
                <p className="text-gray-600 flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Exam completed successfully</span>
                </p>
              </div>
            </div>
            <div className={`px-6 py-3 rounded-2xl bg-gradient-to-r ${gradeBadge.color} text-white font-bold text-xl shadow-lg`}>
              Grade: {gradeBadge.grade}
            </div>
          </div>
        </div>

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl mb-6 shadow-lg animate-bounce">
            <Trophy className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-3 animate-fade-in">
            Exam Results
          </h1>
          <p className="text-gray-600 text-lg">Here's how you performed on the Python Programming Exam</p>
        </div>

        {/* Enhanced Score Summary */}
        <Card className="mb-8 shadow-2xl bg-white/90 backdrop-blur-sm border-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5"></div>
          <CardHeader className="text-center bg-gradient-to-r from-blue-50 to-purple-50 relative z-10">
            <CardTitle className="text-2xl font-bold flex items-center justify-center space-x-2">
              <Sparkles className="w-6 h-6 text-purple-600" />
              <span>Your Score</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center p-8 relative z-10">
            <div className={`text-7xl font-bold mb-4 bg-gradient-to-r ${gradeBadge.color} bg-clip-text text-transparent animate-pulse`}>
              {score}/{questions.length}
            </div>
            <div className={`text-3xl mb-6 ${getScoreColor(score, questions.length)} font-semibold`}>
              {Math.round((score / questions.length) * 100)}%
            </div>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              {getScoreMessage(score, questions.length)}
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Button onClick={handleRetakeExam} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <RotateCcw className="w-5 h-5 mr-2" />
                Retake Exam
              </Button>
              <Button variant="outline" onClick={() => navigate('/analytics')} className="bg-white/80 backdrop-blur-sm border-gray-200 hover:bg-green-50 hover:border-green-300 hover:text-green-600 px-6 py-3 rounded-xl shadow-lg transition-all duration-300">
                <BarChart3 className="w-5 h-5 mr-2" />
                View Analytics
              </Button>
              <Button variant="outline" onClick={() => navigate('/')} className="bg-white/80 backdrop-blur-sm border-gray-200 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 px-6 py-3 rounded-xl shadow-lg transition-all duration-300">
                <Home className="w-5 h-5 mr-2" />
                Exit to Home
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Detailed Results */}
        <Card className="shadow-2xl bg-white/90 backdrop-blur-sm border-0">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
            <CardTitle className="text-xl font-bold text-gray-800">Question Review</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              {questions.map((question, index) => {
                const userAnswer = answers[index];
                const isCorrect = userAnswer === question.correctAnswer;
                
                return (
                  <div key={question.id} className={`border-2 rounded-2xl p-6 transition-all duration-300 ${
                    isCorrect ? 'border-green-200 bg-gradient-to-r from-green-50 to-emerald-50' : 'border-red-200 bg-gradient-to-r from-red-50 to-pink-50'
                  }`}>
                    <div className="flex items-start gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        isCorrect ? 'bg-gradient-to-br from-green-400 to-emerald-500' : 'bg-gradient-to-br from-red-400 to-pink-500'
                      }`}>
                        {isCorrect ? (
                          <CheckCircle className="w-6 h-6 text-white" />
                        ) : (
                          <XCircle className="w-6 h-6 text-white" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold mb-3 text-gray-800 text-lg">
                          Question {index + 1}: {question.question}
                        </h3>
                        <div className="space-y-3">
                          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4">
                            <span className="font-semibold text-gray-700">Your answer: </span>
                            <span className={`font-semibold ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                              {String.fromCharCode(65 + userAnswer)} - {question.options[userAnswer]}
                            </span>
                          </div>
                          {!isCorrect && (
                            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4">
                              <span className="font-semibold text-gray-700">Correct answer: </span>
                              <span className="text-green-600 font-semibold">
                                {String.fromCharCode(65 + question.correctAnswer)} - {question.options[question.correctAnswer]}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ResultsComponent;
