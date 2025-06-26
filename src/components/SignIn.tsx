
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useExam } from '@/contexts/ExamContext';
import { BookOpen, Code, Trophy, BarChart3, Sparkles } from 'lucide-react';

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
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-purple-300/20 to-pink-300/20 rounded-full animate-pulse"></div>
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-blue-300/20 to-cyan-300/20 rounded-full animate-pulse delay-1000"></div>
      </div>

      <Card className="w-full max-w-md animate-fade-in relative z-10 border-0 shadow-2xl bg-white/80 backdrop-blur-sm hover:shadow-3xl transition-all duration-500 hover:scale-105">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-20 h-20 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg animate-bounce">
            <Code className="w-10 h-10 text-white" />
            <Sparkles className="w-4 h-4 text-yellow-300 absolute -top-1 -right-1" />
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent animate-pulse">
            Python Mastery Exam
          </CardTitle>
          <CardDescription className="text-gray-600 text-lg">
            Test your Python knowledge with 10 challenging questions
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-8">
          <div className="grid grid-cols-3 gap-4 text-center">
            {[
              { icon: BookOpen, label: '10 Questions', color: 'from-blue-500 to-cyan-500' },
              { icon: Code, label: 'Python Focused', color: 'from-purple-500 to-pink-500' },
              { icon: Trophy, label: 'Get Score', color: 'from-yellow-500 to-orange-500' }
            ].map((item, index) => (
              <div key={index} className="space-y-3 group hover:scale-110 transition-transform duration-300">
                <div className={`w-12 h-12 mx-auto bg-gradient-to-r ${item.color} rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow`}>
                  <item.icon className="w-6 h-6 text-white" />
                </div>
                <p className="text-sm text-gray-600 font-medium">{item.label}</p>
              </div>
            ))}
          </div>
          
          <form onSubmit={handleSignIn} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-3">
                Enter your name to begin
              </label>
              <Input
                id="name"
                type="text"
                placeholder="Your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full h-12 border-2 border-purple-200 focus:border-purple-500 focus:ring-purple-500 rounded-xl transition-all duration-300 text-lg"
                required
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full h-12 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 hover:from-purple-700 hover:via-pink-700 hover:to-orange-700 transition-all duration-300 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transform"
              disabled={!name.trim()}
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Start Exam
            </Button>
          </form>
          
          <div className="flex gap-3">
            <Button
              onClick={() => navigate('/analytics')}
              variant="outline"
              className="flex-1 h-12 border-2 border-purple-200 hover:border-purple-400 hover:bg-purple-50 rounded-xl transition-all duration-300 group"
            >
              <BarChart3 className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
              View Analytics
            </Button>
          </div>
          
          <div className="text-center text-sm text-gray-500 bg-gradient-to-r from-purple-100 to-pink-100 p-3 rounded-xl">
            <Sparkles className="w-4 h-4 inline mr-1" />
            Good luck! Take your time and think carefully.
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignIn;
