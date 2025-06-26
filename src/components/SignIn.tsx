
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useExam } from '@/contexts/ExamContext';
import { BookOpen, Code, Trophy } from 'lucide-react';

const SignIn = () => {
  const [name, setName] = useState('');
  const { setUserName } = useExam();
  const navigate = useNavigate();

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      setUserName(name.trim());
      navigate('/exam');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md animate-fade-in">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
            <Code className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Python Mastery Exam
          </CardTitle>
          <CardDescription className="text-gray-600">
            Test your Python knowledge with 10 challenging questions
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="space-y-2">
              <BookOpen className="w-6 h-6 mx-auto text-blue-500" />
              <p className="text-sm text-gray-600">10 Questions</p>
            </div>
            <div className="space-y-2">
              <Code className="w-6 h-6 mx-auto text-indigo-500" />
              <p className="text-sm text-gray-600">Python Focused</p>
            </div>
            <div className="space-y-2">
              <Trophy className="w-6 h-6 mx-auto text-yellow-500" />
              <p className="text-sm text-gray-600">Get Score</p>
            </div>
          </div>
          
          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Enter your name to begin
              </label>
              <Input
                id="name"
                type="text"
                placeholder="Your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full"
                required
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 transition-all duration-200"
              disabled={!name.trim()}
            >
              Start Exam
            </Button>
          </form>
          
          <div className="text-center text-sm text-gray-500">
            Good luck! Take your time and think carefully.
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignIn;
