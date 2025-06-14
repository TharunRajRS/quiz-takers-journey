
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Users } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Friends Meet</h1>
          <p className="text-gray-600 text-lg">Plan the perfect meetup with your friends</p>
        </div>

        <div className="flex justify-center">
          <Card className="hover:shadow-lg transition-shadow max-w-md">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <Users className="w-8 h-8 text-purple-600" />
              </div>
              <CardTitle className="text-2xl">Start Planning</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600 mb-6">
                Share preferences with your friends and get smart suggestions for dates, times, and locations.
              </p>
              <Link to="/friends-meet">
                <Button className="w-full bg-purple-600 hover:bg-purple-700">
                  Get Started
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
