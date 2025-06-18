
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useExam } from '@/contexts/ExamContext';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

const ExamComponent = () => {
  const navigate = useNavigate();
  const { 
    questions, 
    currentQuestionIndex, 
    answers, 
    isCompleted,
    startExam,
    answerQuestion,
    nextQuestion
  } = useExam();

  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  useEffect(() => {
    startExam();
  }, []);

  useEffect(() => {
    if (isCompleted) {
      navigate('/results');
    }
  }, [isCompleted, navigate]);

  useEffect(() => {
    // Reset selected answer when moving to next question
    setSelectedAnswer(answers[currentQuestionIndex] ?? null);
  }, [currentQuestionIndex, answers]);

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    answerQuestion(answerIndex);
  };

  const handleNext = () => {
    if (selectedAnswer !== null) {
      nextQuestion();
    }
  };

  const currentQuestion = questions[currentQuestionIndex];

  if (!currentQuestion) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
      <div className="container mx-auto max-w-2xl">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-gray-800">Python Programming Exam</h1>
            <span className="text-sm text-gray-600">
              Question {currentQuestionIndex + 1} of {questions.length}
            </span>
          </div>
          
          {/* Progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
            ></div>
          </div>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">{currentQuestion.question}</CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={selectedAnswer?.toString()}
              onValueChange={(value) => handleAnswerSelect(parseInt(value))}
            >
              {currentQuestion.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2 p-2 rounded hover:bg-gray-50">
                  <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`} className="cursor-pointer flex-1">
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>

        <div className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={() => navigate('/')}
          >
            Exit Exam
          </Button>
          
          <Button 
            onClick={handleNext}
            disabled={selectedAnswer === null}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {currentQuestionIndex === questions.length - 1 ? 'Finish Exam' : 'Next Question'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ExamComponent;
