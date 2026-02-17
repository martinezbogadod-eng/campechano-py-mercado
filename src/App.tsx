import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { LanguageProvider } from "@/hooks/useLanguage";
import { useNeedsOnboarding } from "@/hooks/useUserRoles";
import { useAuth } from "@/hooks/useAuth";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import NewListing from "./pages/NewListing";
import MyListings from "./pages/MyListings";
import Messages from "./pages/Messages";
import AdminPanel from "./pages/AdminPanel";
import Profile from "./pages/Profile";
import ListingPage from "./pages/ListingPage";
import RoleOnboarding from "./pages/RoleOnboarding";
import Terms from "./pages/Terms";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Component to handle onboarding redirect
function OnboardingGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const { needsOnboarding, isLoading } = useNeedsOnboarding();

  if (loading || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  // If user is logged in and needs onboarding, redirect
  if (user && needsOnboarding) {
    return <Navigate to="/onboarding" replace />;
  }

  return <>{children}</>;
}

// Wrapper for protected routes that also check onboarding
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return <OnboardingGuard>{children}</OnboardingGuard>;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<OnboardingGuard><Index /></OnboardingGuard>} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/onboarding" element={<RoleOnboarding />} />
      <Route path="/publicar" element={<ProtectedRoute><NewListing /></ProtectedRoute>} />
      <Route path="/mis-anuncios" element={<ProtectedRoute><MyListings /></ProtectedRoute>} />
      <Route path="/mensajes" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
      <Route path="/perfil" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/admin" element={<ProtectedRoute><AdminPanel /></ProtectedRoute>} />
      <Route path="/anuncio/:id" element={<OnboardingGuard><ListingPage /></OnboardingGuard>} />
      <Route path="/terminos" element={<Terms />} />
      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <LanguageProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </TooltipProvider>
      </LanguageProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
