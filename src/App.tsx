
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ExamProvider } from "./contexts/ExamContext";
import Index from "./pages/Index";
import FriendsMeet from "./pages/FriendsMeet";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ExamProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/friends-meet" element={<FriendsMeet />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </ExamProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
