import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import HomePage from "./pages/HomePage";
import InstructionsPage from "./pages/InstructionsPage";
import UploadPage from "./pages/UploadPage";
import PreviewPage from "./pages/PreviewPage";
import PaymentPage from "./pages/PaymentPage";
import ResultsPage from "./pages/ResultsPage";
import TestUploadPage from "./pages/TestUploadPage";
import TestResultsPage from "./pages/TestResultsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="system" storageKey="insta-analyzer-theme">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/instructions" element={<InstructionsPage />} />
            <Route path="/upload" element={<UploadPage />} />
            <Route path="/preview" element={<PreviewPage />} />
            <Route path="/payment" element={<PaymentPage />} />
            <Route path="/results" element={<ResultsPage />} />
            <Route path="/test-upload" element={<TestUploadPage />} />
            <Route path="/test-results" element={<TestResultsPage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;