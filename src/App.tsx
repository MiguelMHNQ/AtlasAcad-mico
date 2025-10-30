import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { ThemeProvider } from "next-themes";

// Pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import Terms from "./pages/Terms";
import NotFound from "./pages/NotFound";

// Dashboard pages
import Overview from "./pages/dashboard/Overview";
import Projects from "./pages/dashboard/Projects";
import Education from "./pages/dashboard/Education";
import Experience from "./pages/dashboard/Experience";
import Languages from "./pages/dashboard/Languages";
import Publications from "./pages/dashboard/Publications";
import Certificates from "./pages/dashboard/Certificates";
import Settings from "./pages/dashboard/Settings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/terms" element={<Terms />} />

              {/* Protected dashboard routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Overview />} />
                <Route path="projetos" element={<Projects />} />
                <Route path="formacao" element={<Education />} />
                <Route path="experiencia" element={<Experience />} />
                <Route path="idiomas" element={<Languages />} />
                <Route path="publicacoes" element={<Publications />} />
                <Route path="certificados" element={<Certificates />} />
                <Route path="configuracoes" element={<Settings />} />
              </Route>

              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;