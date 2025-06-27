
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ExamProvider } from "@/contexts/ExamContext";
import { AuthProvider } from "@/contexts/AuthContext";
import SignIn from "@/components/SignIn";
import Auth from "@/components/Auth";
import Exam from "@/components/Exam";
import Results from "@/components/Results";
import NotFound from "./pages/NotFound";
import Analytics from "@/components/Analytics";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <ExamProvider>
            <Routes>
              <Route path="/" element={<SignIn />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/exam" element={<Exam />} />
              <Route path="/results" element={<Results />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </ExamProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
