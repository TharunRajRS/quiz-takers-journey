
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Code } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Python Programming Exam</h1>
          <p className="text-gray-600 text-lg">Test your Python knowledge with 10 challenging questions</p>
        </div>

        <div className="flex justify-center">
          <Card className="hover:shadow-lg transition-shadow max-w-md">
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
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  Begin Exam
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
