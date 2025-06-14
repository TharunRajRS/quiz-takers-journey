
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, Users, Trophy, Target, Calendar } from 'lucide-react';

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
        // Transform the data to match our ExamResult interface
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
    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B';
    if (percentage >= 60) return 'C';
    return 'F';
  };

  const statistics = getStatistics();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-lg">Loading analytics...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-6">
          <Button
            variant="outline"
            onClick={() => navigate('/')}
            className="flex items-center space-x-2 mr-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Button>
          <h1 className="text-3xl font-bold text-gray-800">Exam Analytics</h1>
        </div>

        {/* Statistics Cards */}
        {statistics && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6 text-center">
                <Users className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                <h3 className="text-2xl font-bold text-gray-800">{statistics.totalUsers}</h3>
                <p className="text-gray-600">Total Users</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <Target className="w-8 h-8 mx-auto mb-2 text-green-500" />
                <h3 className="text-2xl font-bold text-gray-800">{statistics.averageScore}</h3>
                <p className="text-gray-600">Average Score</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <Trophy className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
                <h3 className="text-2xl font-bold text-gray-800">{statistics.highestScore}</h3>
                <p className="text-gray-600">Highest Score</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <Calendar className="w-8 h-8 mx-auto mb-2 text-purple-500" />
                <h3 className="text-2xl font-bold text-gray-800">{statistics.passRate}%</h3>
                <p className="text-gray-600">Pass Rate</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Results Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-gray-800">All Exam Results</CardTitle>
          </CardHeader>
          <CardContent>
            {examResults.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No exam results found.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3 font-semibold">Name</th>
                      <th className="text-left p-3 font-semibold">Score</th>
                      <th className="text-left p-3 font-semibold">Percentage</th>
                      <th className="text-left p-3 font-semibold">Grade</th>
                      <th className="text-left p-3 font-semibold">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {examResults.map((result) => {
                      const percentage = (result.score / result.total_questions) * 100;
                      const grade = getGrade(result.score, result.total_questions);
                      const date = new Date(result.completed_at).toLocaleDateString();
                      
                      return (
                        <tr key={result.id} className="border-b hover:bg-gray-50">
                          <td className="p-3 font-medium">{result.user_name}</td>
                          <td className="p-3">{result.score}/{result.total_questions}</td>
                          <td className="p-3">{percentage.toFixed(1)}%</td>
                          <td className="p-3">
                            <span className={`px-2 py-1 rounded text-sm font-semibold ${
                              grade === 'A+' || grade === 'A' ? 'bg-green-100 text-green-800' :
                              grade === 'B' ? 'bg-blue-100 text-blue-800' :
                              grade === 'C' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {grade}
                            </span>
                          </td>
                          <td className="p-3 text-gray-600">{date}</td>
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
