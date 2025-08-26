import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Reports from "./pages/Reports";
import DefaultLayout from "./components/DefaultLayout";
import { FiltersProvider } from './contexts/FiltersContext';
import { MenuProvider } from './contexts/MenuContext';
import Section from './components/Section';
import Icon from './components/Icon';
function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <Section className='flex w-screen h-screen items-center justify-center'>
        <Icon className='text-4xl text-blue-500' icon='fas fa-spinner fa-spin'/>
      </Section>
    )
  }

  return (
    <Routes>
      <Route 
        path="/login" 
        element={user ? <Navigate to="/" replace /> : <Login />} 
      />

      <Route 
        path="/" 
        element={!user ? <Navigate to="/login" replace /> : <DefaultLayout />}
      >
        <Route index element={<Dashboard />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="reports" element={<Reports />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MenuProvider>
        <FiltersProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </FiltersProvider>
      </MenuProvider>
    </AuthProvider>
  );
}
