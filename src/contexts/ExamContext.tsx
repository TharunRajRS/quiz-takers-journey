
import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
}

interface ExamContextType {
  questions: Question[];
  currentQuestionIndex: number;
  answers: number[];
  score: number;
  isCompleted: boolean;
  startExam: () => void;
  answerQuestion: (answerIndex: number) => void;
  nextQuestion: () => void;
  resetExam: () => void;
}

const ExamContext = createContext<ExamContextType | undefined>(undefined);

const pythonQuestions: Question[] = [
  {
    id: 1,
    question: "What is the output of print(2 ** 3)?",
    options: ["6", "8", "9", "23"],
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
    question: "What does the len() function do?",
    options: ["Returns the length of an object", "Creates a new list", "Sorts a list", "Removes an item"],
    correctAnswer: 0
  },
  {
    id: 4,
    question: "Which data type is mutable in Python?",
    options: ["tuple", "string", "list", "int"],
    correctAnswer: 2
  },
  {
    id: 5,
    question: "What is the correct way to create a dictionary?",
    options: ["{key: value}", "dict(key=value)", "{'key': 'value'}", "All of the above"],
    correctAnswer: 3
  },
  {
    id: 6,
    question: "Which operator is used for floor division in Python?",
    options: ["/", "//", "%", "**"],
    correctAnswer: 1
  },
  {
    id: 7,
    question: "What does the range(5) function produce?",
    options: ["[1, 2, 3, 4, 5]", "[0, 1, 2, 3, 4]", "[0, 1, 2, 3, 4, 5]", "5"],
    correctAnswer: 1
  },
  {
    id: 8,
    question: "Which method is used to add an element to the end of a list?",
    options: ["add()", "append()", "insert()", "extend()"],
    correctAnswer: 1
  },
  {
    id: 9,
    question: "What is the output of bool(0)?",
    options: ["True", "False", "0", "Error"],
    correctAnswer: 1
  },
  {
    id: 10,
    question: "Which keyword is used to handle exceptions in Python?",
    options: ["catch", "except", "handle", "error"],
    correctAnswer: 1
  }
];

export const ExamProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [questions] = useState<Question[]>(pythonQuestions);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const startExam = () => {
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setScore(0);
    setIsCompleted(false);
  };

  const answerQuestion = (answerIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = answerIndex;
    setAnswers(newAnswers);
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Calculate final score
      let finalScore = 0;
      answers.forEach((answer, index) => {
        if (answer === questions[index].correctAnswer) {
          finalScore++;
        }
      });
      setScore(finalScore);
      setIsCompleted(true);
    }
  };

  const resetExam = () => {
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setScore(0);
    setIsCompleted(false);
  };

  return (
    <ExamContext.Provider value={{
      questions,
      currentQuestionIndex,
      answers,
      score,
      isCompleted,
      startExam,
      answerQuestion,
      nextQuestion,
      resetExam
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
