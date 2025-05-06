import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext"; // Autenticação
import LoginModal from "@/components/LoginModal"; // Importando o Modal de Login
import Index from "./pages/Index";
import GymWorkouts from "./pages/GymWorkouts";
import HomeWorkouts from "./pages/HomeWorkouts"; 
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";
import Layout from "./components/Layout";

const queryClient = new QueryClient();

// Proteção de rota para admins
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) return <p>Carregando...</p>;
  if (!user) return <Navigate to="/" />;
  if (user.role !== "admin") return <p>Acesso negado.</p>;

  return <>{children}</>;
};

const App = () => (
  <AuthProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout><Index /></Layout>} />
            <Route path="/gym" element={<Layout><GymWorkouts /></Layout>} />
            <Route path="/home" element={<Layout><HomeWorkouts /></Layout>} />
            <Route path="/admin" element={<Layout><ProtectedRoute><AdminDashboard /></ProtectedRoute></Layout>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </AuthProvider>
);

export default App;