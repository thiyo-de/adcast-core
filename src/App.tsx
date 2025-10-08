import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import VideoPage from "./pages/VideoPage";
import CategoryPage from "./pages/CategoryPage";
import TagPage from "./pages/TagPage";
import SearchPage from "./pages/SearchPage";
import Terms from "./pages/Terms";
import Admin from "./pages/Admin";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/video/:slug" element={<VideoPage />} />
          <Route path="/category/:category" element={<CategoryPage />} />
          <Route path="/tag/:tag" element={<TagPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Terms />} />
          <Route path="/admin" element={<Admin />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
