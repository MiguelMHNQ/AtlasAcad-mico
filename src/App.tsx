import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { ThemeProvider } from "next-themes";

// Páginas principais
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";

// Páginas do dashboard
import Overview from "./pages/dashboard/Overview";
import Projects from "./pages/dashboard/Projects";
import Education from "./pages/dashboard/Education";
import Experience from "./pages/dashboard/Experience";
import Languages from "./pages/dashboard/Languages";
import Publications from "./pages/dashboard/Publications";
import Certificates from "./pages/dashboard/Certificates";
import Settings from "./pages/dashboard/Settings";
import PublicProfileWrapper from "./pages/PublicProfileWrapper";
import SearchPage from "./pages/Search";

const queryClient = new QueryClient();

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Rotas públicas */}
              <Route path="/profile/:userId" element={<PublicProfileWrapper />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
              
              {/* Rotas de autenticação */}
              <Route path="/*" element={
                <AuthProvider>
                  <Routes>
                    <Route path="/" element={<Navigate to="/login" replace />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    {/* Dashboard protegido */}
                    <Route path="/dashboard" element={
                      <ProtectedRoute>
                        <DashboardLayout />
                      </ProtectedRoute>
                    }>
                      <Route index element={<Overview />} />
                      <Route path="projetos" element={<Projects />} />
                      <Route path="formacao" element={<Education />} />
                      <Route path="experiencia" element={<Experience />} />
                      <Route path="idiomas" element={<Languages />} />
                      <Route path="publicacoes" element={<Publications />} />
                      <Route path="certificados" element={<Certificates />} />
                      <Route path="configuracoes" element={<Settings />} />
                    </Route>

                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </AuthProvider>
              } />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;