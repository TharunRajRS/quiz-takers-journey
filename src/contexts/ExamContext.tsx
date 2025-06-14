import React, { createContext, useContext, useState, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
}

interface ExamContextType {
  userName: string;
  setUserName: (name: string) => void;
  currentQuestion: number;
  setCurrentQuestion: (index: number) => void;
  answers: number[];
  setAnswer: (questionIndex: number, answerIndex: number) => void;
  score: number;
  calculateScore: () => void;
  resetExam: () => void;
  questions: Question[];
  saveExamResult: () => Promise<void>;
}

const questions: Question[] = [
  {
    id: 1,
    question: "What is the correct way to create a list in Python?",
    options: ["list = {1, 2, 3}", "list = [1, 2, 3]", "list = (1, 2, 3)", "list = <1, 2, 3>"],
    correctAnswer: 1
  },
  {
    id: 2,
    question: "Which of the following is used to define a function in Python?",
    options: ["function", "def", "define", "func"],
    correctAnswer: 1
  },
  {
    id: 3,
    question: "What does the 'len()' function do?",
    options: ["Returns the length of an object", "Creates a new variable", "Deletes an object", "Converts to string"],
    correctAnswer: 0
  },
  {
    id: 4,
    question: "Which operator is used for exponentiation in Python?",
    options: ["^", "**", "exp", "pow"],
    correctAnswer: 1
  },
  {
    id: 5,
    question: "What is the output of print(2 + 3 * 4)?",
    options: ["20", "14", "11", "9"],
    correctAnswer: 1
  },
  {
    id: 6,
    question: "Which of these is NOT a Python data type?",
    options: ["int", "float", "string", "char"],
    correctAnswer: 3
  },
  {
    id: 7,
    question: "How do you create a comment in Python?",
    options: ["// comment", "/* comment */", "# comment", "<!-- comment -->"],
    correctAnswer: 2
  },
  {
    id: 8,
    question: "What is the correct way to import a module in Python?",
    options: ["include module", "import module", "require module", "using module"],
    correctAnswer: 1
  },
  {
    id: 9,
    question: "Which method is used to add an element to the end of a list?",
    options: ["add()", "append()", "insert()", "push()"],
    correctAnswer: 1
  },
  {
    id: 10,
    question: "What is the result of bool('')?",
    options: ["True", "False", "None", "Error"],
    correctAnswer: 1
  }
];

const ExamContext = createContext<ExamContextType | undefined>(undefined);

export const ExamProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userName, setUserName] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>(new Array(10).fill(-1));
  const [score, setScore] = useState(0);

  const setAnswer = (questionIndex: number, answerIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[questionIndex] = answerIndex;
    setAnswers(newAnswers);
  };

  const calculateScore = () => {
    let correctAnswers = 0;
    questions.forEach((question, index) => {
      if (answers[index] === question.correctAnswer) {
        correctAnswers++;
      }
    });
    setScore(correctAnswers);
  };

  const saveExamResult = async () => {
    try {
      const { error } = await supabase
        .from('exam_results')
        .insert({
          user_id: 'demo-user', // Using demo user ID since we don't have real auth
          user_name: userName,
          score: score,
          total_questions: questions.length,
          answers: answers
        });

      if (error) {
        console.error('Error saving exam result:', error);
      } else {
        console.log('Exam result saved successfully');
      }
    } catch (error) {
      console.error('Error saving exam result:', error);
    }
  };

  const resetExam = () => {
    setCurrentQuestion(0);
    setAnswers(new Array(10).fill(-1));
    setScore(0);
  };

  return (
    <ExamContext.Provider value={{
      userName,
      setUserName,
      currentQuestion,
      setCurrentQuestion,
      answers,
      setAnswer,
      score,
      calculateScore,
      resetExam,
      questions,
      saveExamResult
    }}>
      {children}
    </ExamContext.Provider>
  );
};

export const useExam = () => {
  const context = useContext(ExamContext);
  if (context === undefined) {
    throw new Error('useExam must be used within an ExamProvider');
  }
  return context;
};
