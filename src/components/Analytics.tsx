
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, Award, Calendar, ArrowLeft, Brain, Target, Clock } from 'lucide-react';

interface ExamResult {
  id: string;
  user_name: string;
  score: number;
  total_questions: number;
  answers: any[];
  completed_at: string;
}

const Analytics = () => {
  const [results, setResults] = useState<ExamResult[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      const { data, error } = await supabase
        .from('exam_results')
        .select('*')
        .order('completed_at', { ascending: false });

      if (error) throw error;
      setResults(data || []);
    } catch (error) {
      console.error('Error fetching results:', error);
    } finally {
      setLoading(false);
    }
  };

  const stats = {
    totalExams: results.length,
    averageScore: results.length > 0 ? (results.reduce((sum, r) => sum + r.score, 0) / results.length).toFixed(1) : 0,
    topScore: results.length > 0 ? Math.max(...results.map(r => r.score)) : 0,
    uniqueUsers: new Set(results.map(r => r.user_name)).size
  };

  const scoreDistribution = [
    { range: '0-2', count: results.filter(r => r.score >= 0 && r.score <= 2).length, color: '#ef4444' },
    { range: '3-4', count: results.filter(r => r.score >= 3 && r.score <= 4).length, color: '#f97316' },
    { range: '5-6', count: results.filter(r => r.score >= 5 && r.score <= 6).length, color: '#eab308' },
    { range: '7-8', count: results.filter(r => r.score >= 7 && r.score <= 8).length, color: '#22c55e' },
    { range: '9-10', count: results.filter(r => r.score >= 9 && r.score <= 10).length, color: '#16a34a' }
  ];

  const dailyStats = results.reduce((acc, result) => {
    const date = new Date(result.completed_at).toLocaleDateString();
    if (!acc[date]) {
      acc[date] = { date, count: 0, totalScore: 0 };
    }
    acc[date].count++;
    acc[date].totalScore += result.score;
    return acc;
  }, {} as Record<string, { date: string; count: number; totalScore: number }>);

  const chartData = Object.values(dailyStats).map(d => ({
    date: d.date,
    exams: d.count,
    avgScore: (d.totalScore / d.count).toFixed(1)
  }));

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-200 border-t-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 animate-fade-in">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Analytics Dashboard
            </h1>
            <p className="text-gray-600 mt-2">Comprehensive exam performance insights</p>
          </div>
          <Button
            onClick={() => navigate('/')}
            variant="outline"
            className="group hover:scale-105 transition-all duration-300 border-purple-200 hover:border-purple-400 hover:bg-purple-50"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { title: 'Total Exams', value: stats.totalExams, icon: Brain, color: 'from-blue-500 to-cyan-500' },
            { title: 'Average Score', value: `${stats.averageScore}/10`, icon: Target, color: 'from-green-500 to-emerald-500' },
            { title: 'Top Score', value: `${stats.topScore}/10`, icon: Award, color: 'from-yellow-500 to-orange-500' },
            { title: 'Unique Users', value: stats.uniqueUsers, icon: Users, color: 'from-purple-500 to-pink-500' }
          ].map((stat, index) => (
            <Card key={index} className="group hover:scale-105 transition-all duration-300 hover:shadow-xl animate-fade-in border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-full bg-gradient-to-r ${stat.color} group-hover:scale-110 transition-transform`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Score Distribution */}
          <Card className="animate-fade-in border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-800">
                <TrendingUp className="w-5 h-5 text-purple-600" />
                Score Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={scoreDistribution}
                    dataKey="count"
                    nameKey="range"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({ range, count }) => count > 0 ? `${range}: ${count}` : ''}
                  >
                    {scoreDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Daily Performance */}
          <Card className="animate-fade-in border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-800">
                <Calendar className="w-5 h-5 text-blue-600" />
                Daily Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="date" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip 
                    contentStyle={{ 
                      background: 'white', 
                      border: 'none', 
                      borderRadius: '8px', 
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' 
                    }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="avgScore" 
                    stroke="#8b5cf6" 
                    strokeWidth={3}
                    dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 6 }}
                    activeDot={{ r: 8, stroke: '#8b5cf6', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Recent Results */}
        <Card className="animate-fade-in border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-800">
              <Clock className="w-5 h-5 text-green-600" />
              Recent Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {results.slice(0, 10).map((result, index) => (
                <div
                  key={result.id}
                  className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white rounded-lg border hover:shadow-md transition-all duration-300 hover:scale-[1.02]"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                      {result.user_name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{result.user_name}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(result.completed_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Progress 
                      value={(result.score / result.total_questions) * 100} 
                      className="w-24 h-2"
                    />
                    <Badge 
                      variant={result.score >= 8 ? 'default' : result.score >= 6 ? 'secondary' : 'destructive'}
                      className="text-sm font-bold px-3 py-1"
                    >
                      {result.score}/{result.total_questions}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
