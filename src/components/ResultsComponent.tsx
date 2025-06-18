
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useExam } from '@/contexts/ExamContext';
import { CheckCircle, XCircle, Trophy, RotateCcw } from 'lucide-react';

const ResultsComponent = () => {
  const navigate = useNavigate();
  const { questions, answers, score, isCompleted, resetExam } = useExam();

  useEffect(() => {
    if (!isCompleted) {
      navigate('/');
    }
  }, [isCompleted, navigate]);

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

  if (!isCompleted) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-8">
          <Trophy className="w-16 h-16 mx-auto mb-4 text-yellow-500" />
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Exam Results</h1>
          <p className="text-gray-600">Here's how you performed on the Python Programming Exam</p>
        </div>

        {/* Score Summary */}
        <Card className="mb-8">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Your Score</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className={`text-6xl font-bold mb-4 ${getScoreColor(score, questions.length)}`}>
              {score}/{questions.length}
            </div>
            <div className={`text-2xl mb-4 ${getScoreColor(score, questions.length)}`}>
              {Math.round((score / questions.length) * 100)}%
            </div>
            <p className="text-lg text-gray-600 mb-6">
              {getScoreMessage(score, questions.length)}
            </p>
            <div className="flex gap-4 justify-center">
              <Button onClick={handleRetakeExam} className="bg-blue-600 hover:bg-blue-700">
                <RotateCcw className="w-4 h-4 mr-2" />
                Retake Exam
              </Button>
              <Button variant="outline" onClick={() => navigate('/')}>
                Back to Home
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Results */}
        <Card>
          <CardHeader>
            <CardTitle>Question Review</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {questions.map((question, index) => {
                const userAnswer = answers[index];
                const isCorrect = userAnswer === question.correctAnswer;
                
                return (
                  <div key={question.id} className="border rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      {isCorrect ? (
                        <CheckCircle className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                      ) : (
                        <XCircle className="w-6 h-6 text-red-600 mt-1 flex-shrink-0" />
                      )}
                      <div className="flex-1">
                        <h3 className="font-semibold mb-2">
                          Question {index + 1}: {question.question}
                        </h3>
                        <div className="space-y-1 text-sm">
                          <p>
                            <span className="font-medium">Your answer: </span>
                            <span className={isCorrect ? 'text-green-600' : 'text-red-600'}>
                              {question.options[userAnswer]}
                            </span>
                          </p>
                          {!isCorrect && (
                            <p>
                              <span className="font-medium">Correct answer: </span>
                              <span className="text-green-600">
                                {question.options[question.correctAnswer]}
                              </span>
                            </p>
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
