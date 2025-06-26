
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useExam } from '@/contexts/ExamContext';
import { supabase } from '@/integrations/supabase/client';
import { Trophy, Award, Target, RotateCcw, CheckCircle, X, BarChart3, Home, Sparkles, Zap } from 'lucide-react';

const Results = () => {
  const { userName, score, questions, answers, resetExam } = useExam();
  const navigate = useNavigate();

  const percentage = (score / questions.length) * 100;
  
  const getGrade = () => {
    if (percentage >= 90) return { grade: 'A+', color: 'from-green-500 to-emerald-500', message: 'Outstanding! 🌟' };
    if (percentage >= 80) return { grade: 'A', color: 'from-green-400 to-green-600', message: 'Excellent! 🎉' };
    if (percentage >= 70) return { grade: 'B', color: 'from-blue-400 to-blue-600', message: 'Good Job! 👏' };
    if (percentage >= 60) return { grade: 'C', color: 'from-yellow-400 to-yellow-600', message: 'Fair 👍' };
    return { grade: 'F', color: 'from-red-400 to-red-600', message: 'Keep Learning! 💪' };
  };

  const { grade, color, message } = getGrade();

  useEffect(() => {
    if (userName && score >= 0) {
      saveResultToAnalytics();
    }
  }, [userName, score]);

  const saveResultToAnalytics = async () => {
    try {
      const { error } = await supabase
        .from('exam_results')
        .insert({
          user_name: userName,
          score: score,
          total_questions: questions.length,
          answers: answers
        });

      if (error) {
        console.error('Error saving results:', error);
      }
    } catch (error) {
      console.error('Error saving results:', error);
    }
  };

  const handleRetakeExam = () => {
    resetExam();
    navigate('/');
  };

  if (!userName) {
    navigate('/');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50 p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-br from-purple-300/10 to-pink-300/10 rounded-full animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-gradient-to-tl from-blue-300/10 to-cyan-300/10 rounded-full animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Results Header */}
        <Card className="mb-8 animate-fade-in border-0 shadow-2xl bg-white/80 backdrop-blur-sm hover:shadow-3xl transition-all duration-500">
          <CardHeader className="text-center pb-8">
            <div className="mx-auto w-24 h-24 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 rounded-full flex items-center justify-center mb-6 shadow-xl animate-bounce">
              <Trophy className="w-12 h-12 text-white" />
              <Sparkles className="w-6 h-6 text-yellow-200 absolute -top-2 -right-2 animate-spin" />
            </div>
            <CardTitle className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent mb-4">
              Exam Complete!
            </CardTitle>
            <p className="text-xl text-gray-600">Congratulations, <span className="font-bold text-purple-600">{userName}</span>! 🎉</p>
          </CardHeader>
          
          <CardContent className="text-center space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { icon: Award, title: 'Your Score', value: `${score} / ${questions.length}`, color: 'from-blue-500 to-cyan-500' },
                { icon: Target, title: 'Percentage', value: `${percentage.toFixed(1)}%`, color: 'from-purple-500 to-pink-500' },
                { icon: Trophy, title: 'Grade', value: grade, color: color }
              ].map((stat, index) => (
                <div key={index} className="group hover:scale-110 transition-all duration-300">
                  <div className={`w-16 h-16 mx-auto bg-gradient-to-r ${stat.color} rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:shadow-xl`}>
                    <stat.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-700 mb-2">{stat.title}</h3>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
              ))}
            </div>
            
            <div className={`text-2xl font-bold bg-gradient-to-r ${color} bg-clip-text text-transparent animate-pulse`}>
              {message}
            </div>
          </CardContent>
        </Card>

        {/* Detailed Results */}
        <Card className="mb-8 border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl text-gray-800 flex items-center gap-2">
              <Zap className="w-6 h-6 text-yellow-500" />
              Question Review
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {questions.map((question, index) => {
              const isCorrect = answers[index] === question.correctAnswer;
              const userAnswer = answers[index];
              
              return (
                <div key={index} className="border-2 border-gray-100 rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:scale-[1.02] bg-white/50">
                  <div className="flex items-start space-x-4">
                    <div className={`mt-1 p-2 rounded-full ${isCorrect ? 'bg-green-100' : 'bg-red-100'} transition-all duration-300`}>
                      {isCorrect ? 
                        <CheckCircle className="w-6 h-6 text-green-600" /> : 
                        <X className="w-6 h-6 text-red-600" />
                      }
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800 mb-3 text-lg">
                        {index + 1}. {question.question}
                      </h4>
                      <div className="space-y-2">
                        <div className={`p-3 rounded-lg ${isCorrect ? 'bg-green-50 border-l-4 border-green-500' : 'bg-red-50 border-l-4 border-red-500'}`}>
                          <p className={`font-medium ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                            Your answer: {question.options[userAnswer] || 'Not answered'}
                          </p>
                        </div>
                        {!isCorrect && (
                          <div className="p-3 bg-green-50 border-l-4 border-green-500 rounded-lg">
                            <p className="text-green-700 font-medium">
                              Correct answer: {question.options[question.correctAnswer]}
                            </p>
                          </div>
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
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={handleRetakeExam}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
          >
            <RotateCcw className="w-5 h-5 mr-2" />
            Take Exam Again
          </Button>
          
          <Button
            onClick={() => navigate('/analytics')}
            variant="outline"
            className="border-2 border-purple-200 hover:border-purple-400 hover:bg-purple-50 px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-300 hover:scale-105"
          >
            <BarChart3 className="w-5 h-5 mr-2" />
            View Analytics
          </Button>
          
          <Button
            onClick={() => navigate('/')}
            variant="outline"
            className="border-2 border-gray-200 hover:border-gray-400 hover:bg-gray-50 px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-300 hover:scale-105"
          >
            <Home className="w-5 h-5 mr-2" />
            Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Results;
