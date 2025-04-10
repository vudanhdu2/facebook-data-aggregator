import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import UserDetailsPage from "./pages/UserDetailsPage";
import { UserRole } from "./types";
import { Provider } from 'react-redux';
import store from './redux/store';
import { Theme } from "@radix-ui/themes"
import "@radix-ui/themes/styles.css"

const queryClient = new QueryClient();

const App = () => (
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <Theme accentColor="blue" grayColor="mauve" radius="large" scaling="100%">
        <TooltipProvider>
          <AuthProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                <Route path="/" element={
                  <ProtectedRoute>
                    <Index />
                  </ProtectedRoute>
                } />

                <Route path="/upload" element={
                  <ProtectedRoute>
                    <Index />
                  </ProtectedRoute>
                } />

                <Route path="/history" element={
                  <ProtectedRoute>
                    <Index />
                  </ProtectedRoute>
                } />

                <Route path="/users" element={
                  <ProtectedRoute>
                    <Index />
                  </ProtectedRoute>
                } />

                <Route path="/users/profile" element={
                  <ProtectedRoute>
                    <Index />
                  </ProtectedRoute>
                } />

                <Route path="/users/group" element={
                  <ProtectedRoute>
                    <Index />
                  </ProtectedRoute>
                } />

                <Route path="/users/page" element={
                  <ProtectedRoute>
                    <Index />
                  </ProtectedRoute>
                } />

                <Route path="/stats" element={
                  <ProtectedRoute>
                    <Index />
                  </ProtectedRoute>
                } />

                <Route path="/:uid" element={
                  <ProtectedRoute>
                    <UserDetailsPage />
                  </ProtectedRoute>
                } />

                <Route path="/users/:uid" element={
                  <ProtectedRoute>
                    <UserDetailsPage />
                  </ProtectedRoute>
                } />

                <Route path="/admin" element={
                  <ProtectedRoute requiredRole={UserRole.ADMIN}>
                    <Admin />
                  </ProtectedRoute>
                } />

                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </AuthProvider>
        </TooltipProvider>
      </Theme>
    </QueryClientProvider>
  </Provider>

);

export default App;
