
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useExam } from '@/contexts/ExamContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, RotateCcw, BarChart3, CheckCircle, XCircle, Home } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const Results = () => {
  const { userName, score, questions, answers, resetExam } = useExam();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  const percentage = Math.round((score / questions.length) * 100);

  const getScoreColor = () => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreMessage = () => {
    if (percentage >= 80) return 'Excellent work! 🎉';
    if (percentage >= 60) return 'Good job! 👍';
    return 'Keep practicing! 💪';
  };

  const saveResults = async () => {
    if (isSaving) return;
    
    setIsSaving(true);
    console.log('Saving results to database...');
    
    try {
      const { data, error } = await supabase
        .from('exam_results')
        .insert({
          user_name: userName,
          user_id: user?.id || null, // Use authenticated user ID if available
          score: score,
          total_questions: questions.length,
          answers: answers
        })
        .select();

      if (error) {
        console.error('Error saving results:', error);
        toast({
          title: "Warning",
          description: "Results couldn't be saved to database, but you can still view them.",
          variant: "destructive",
        });
      } else {
        console.log('Results saved successfully:', data);
        toast({
          title: "Success",
          description: "Your exam results have been saved!",
        });
      }
    } catch (error) {
      console.error('Unexpected error saving results:', error);
      toast({
        title: "Warning",
        description: "Results couldn't be saved to database, but you can still view them.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    // Auto-save results when component mounts
    saveResults();
  }, []);

  const handleRetakeExam = () => {
    resetExam();
    navigate('/');
  };

  const handleViewAnalytics = () => {
    navigate('/analytics');
  };

  const handleGoHome = () => {
    navigate('/');
  };

  if (!userName || score === undefined) {
    navigate('/');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl animate-fade-in border-0 shadow-2xl bg-white/80 backdrop-blur-sm">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-20 h-20 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
            <Trophy className="w-10 h-10 text-white" />
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent">
            Exam Complete!
          </CardTitle>
          <CardDescription className="text-lg text-gray-600">
            Great job, {userName}! Here are your results:
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-8">
          {/* Score Display */}
          <div className="text-center space-y-4">
            <div className={`text-6xl font-bold ${getScoreColor()}`}>
              {score}/{questions.length}
            </div>
            <div className={`text-2xl font-semibold ${getScoreColor()}`}>
              {percentage}%
            </div>
            <p className="text-xl text-gray-700">{getScoreMessage()}</p>
          </div>

          {/* Question Review */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Question Review:</h3>
            <div className="max-h-96 overflow-y-auto space-y-3">
              {questions.map((question, index) => {
                const userAnswer = answers[index];
                const isCorrect = userAnswer === question.correctAnswer;
                
                return (
                  <div key={question.id} className={`p-4 rounded-lg border ${isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                    <div className="flex items-start gap-3">
                      {isCorrect ? (
                        <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-600 mt-1 flex-shrink-0" />
                      )}
                      <div className="flex-1">
                        <p className="font-medium text-gray-800 mb-2">
                          {index + 1}. {question.question}
                        </p>
                        <div className="space-y-1 text-sm">
                          <p className={`${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                            Your answer: {userAnswer !== -1 ? question.options[userAnswer] : 'No answer selected'}
                          </p>
                          {!isCorrect && (
                            <p className="text-green-700">
                              Correct answer: {question.options[question.correctAnswer]}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              onClick={handleRetakeExam}
              className="flex-1 h-12 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 hover:from-purple-700 hover:via-pink-700 hover:to-orange-700 transition-all duration-300 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-105"
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              Retake Exam
            </Button>
            
            <Button 
              onClick={handleViewAnalytics}
              variant="outline"
              className="flex-1 h-12 border-2 border-purple-200 hover:border-purple-400 hover:bg-purple-50 rounded-xl transition-all duration-300 group"
            >
              <BarChart3 className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
              View Analytics
            </Button>

            <Button 
              onClick={handleGoHome}
              variant="outline"
              className="flex-1 h-12 border-2 border-gray-200 hover:border-gray-400 hover:bg-gray-50 rounded-xl transition-all duration-300 group"
            >
              <Home className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
              Home
            </Button>
          </div>

          {isSaving && (
            <div className="text-center text-sm text-gray-500">
              Saving results...
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Results;
