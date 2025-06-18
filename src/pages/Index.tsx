
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Code, BarChart3 } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4 animate-fade-in">
            Python Programming Exam
          </h1>
          <p className="text-gray-600 text-lg">Test your Python knowledge with 10 challenging questions</p>
        </div>

        <div className="flex justify-center gap-6 flex-wrap">
          <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 max-w-md">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Code className="w-8 h-8 text-blue-600" />
              </div>
              <CardTitle className="text-2xl">Start Exam</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600 mb-6">
                Challenge yourself with 10 Python programming questions covering basic to intermediate concepts.
              </p>
              <Link to="/exam">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 transition-colors">
                  Begin Exam
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 max-w-md">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <BarChart3 className="w-8 h-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl">Analytics</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600 mb-6">
                View detailed analytics and statistics of all exam attempts and performance metrics.
              </p>
              <Link to="/analytics">
                <Button variant="outline" className="w-full border-green-600 text-green-600 hover:bg-green-50">
                  View Analytics
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
