
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, Users, Trophy, Target, Calendar, TrendingUp, Award, BookOpen } from 'lucide-react';

interface ExamResult {
  id: string;
  user_name: string;
  score: number;
  total_questions: number;
  completed_at: string;
  answers: number[];
}

const Analytics = () => {
  const [examResults, setExamResults] = useState<ExamResult[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchExamResults();
  }, []);

  const fetchExamResults = async () => {
    try {
      const { data, error } = await supabase
        .from('exam_results')
        .select('*')
        .order('completed_at', { ascending: false });

      if (error) {
        console.error('Error fetching exam results:', error);
      } else {
        const transformedData = (data || []).map(result => ({
          ...result,
          answers: Array.isArray(result.answers) ? result.answers as number[] : [],
          completed_at: result.completed_at || new Date().toISOString()
        }));
        setExamResults(transformedData);
      }
    } catch (error) {
      console.error('Error fetching exam results:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatistics = () => {
    if (examResults.length === 0) return null;

    const totalUsers = examResults.length;
    const averageScore = examResults.reduce((sum, result) => sum + result.score, 0) / totalUsers;
    const highestScore = Math.max(...examResults.map(result => result.score));
    const passRate = (examResults.filter(result => (result.score / result.total_questions) * 100 >= 60).length / totalUsers) * 100;

    return {
      totalUsers,
      averageScore: averageScore.toFixed(1),
      highestScore,
      passRate: passRate.toFixed(1)
    };
  };

  const getGrade = (score: number, totalQuestions: number) => {
    const percentage = (score / totalQuestions) * 100;
    if (percentage >= 90) return { grade: 'A+', color: 'from-green-400 to-emerald-500' };
    if (percentage >= 80) return { grade: 'A', color: 'from-green-400 to-green-500' };
    if (percentage >= 70) return { grade: 'B', color: 'from-blue-400 to-blue-500' };
    if (percentage >= 60) return { grade: 'C', color: 'from-yellow-400 to-yellow-500' };
    return { grade: 'F', color: 'from-red-400 to-red-500' };
  };

  const statistics = getStatistics();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading analytics...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-400/10 to-cyan-400/10 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto p-4 relative z-10">
        {/* Enhanced Header */}
        <div className="flex items-center mb-8">
          <Button
            variant="outline"
            onClick={() => navigate('/results')}
            className="flex items-center space-x-2 mr-6 bg-white/80 backdrop-blur-sm border-gray-200 hover:bg-blue-50 hover:border-blue-300 px-4 py-2 rounded-xl shadow-lg transition-all duration-300"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Results</span>
          </Button>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 via-blue-600 to-purple-600 bg-clip-text text-transparent">
              Exam Analytics
            </h1>
            <p className="text-gray-600 mt-1">Comprehensive insights and performance metrics</p>
          </div>
        </div>

        {/* Enhanced Statistics Cards */}
        {statistics && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-gray-800 mb-1">{statistics.totalUsers}</h3>
                <p className="text-gray-600 font-medium">Total Users</p>
              </CardContent>
            </Card>
            
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-gray-800 mb-1">{statistics.averageScore}</h3>
                <p className="text-gray-600 font-medium">Average Score</p>
              </CardContent>
            </Card>
            
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-gray-800 mb-1">{statistics.highestScore}</h3>
                <p className="text-gray-600 font-medium">Highest Score</p>
              </CardContent>
            </Card>
            
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-gray-800 mb-1">{statistics.passRate}%</h3>
                <p className="text-gray-600 font-medium">Pass Rate</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Enhanced Results Table */}
        <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-2xl">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
            <CardTitle className="text-2xl text-gray-800 flex items-center space-x-2">
              <BookOpen className="w-6 h-6 text-blue-600" />
              <span>All Exam Results</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {examResults.length === 0 ? (
              <div className="text-center py-12">
                <Award className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-500 text-lg">No exam results found.</p>
                <p className="text-gray-400">Complete an exam to see analytics here.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-gray-100">
                      <th className="text-left p-4 font-bold text-gray-700">Name</th>
                      <th className="text-left p-4 font-bold text-gray-700">Score</th>
                      <th className="text-left p-4 font-bold text-gray-700">Percentage</th>
                      <th className="text-left p-4 font-bold text-gray-700">Grade</th>
                      <th className="text-left p-4 font-bold text-gray-700">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {examResults.map((result, index) => {
                      const percentage = (result.score / result.total_questions) * 100;
                      const gradeInfo = getGrade(result.score, result.total_questions);
                      const date = new Date(result.completed_at).toLocaleDateString();
                      
                      return (
                        <tr key={result.id} className={`border-b border-gray-100 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-200 ${
                          index % 2 === 0 ? 'bg-gray-50/50' : 'bg-white'
                        }`}>
                          <td className="p-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-600 rounded-lg flex items-center justify-center">
                                <span className="text-white text-sm font-bold">{result.user_name.charAt(0).toUpperCase()}</span>
                              </div>
                              <span className="font-semibold text-gray-800">{result.user_name}</span>
                            </div>
                          </td>
                          <td className="p-4 font-semibold text-gray-700">{result.score}/{result.total_questions}</td>
                          <td className="p-4">
                            <span className={`font-semibold ${
                              percentage >= 80 ? 'text-green-600' :
                              percentage >= 60 ? 'text-yellow-600' :
                              'text-red-600'
                            }`}>
                              {percentage.toFixed(1)}%
                            </span>
                          </td>
                          <td className="p-4">
                            <span className={`px-3 py-1 rounded-xl text-sm font-bold text-white bg-gradient-to-r ${gradeInfo.color} shadow-md`}>
                              {gradeInfo.grade}
                            </span>
                          </td>
                          <td className="p-4 text-gray-600 font-medium">{date}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
