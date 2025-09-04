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
import Applications from './pages/Applications';
import GovCallback from './pages/GovCallback';
import Loading from './components/Loading';
import AcessoCidadao from './pages/AcessoCidadao';

function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <Loading />
    )
  }

 return (
  <Routes>
    <Route 
      path="/login" 
      element={user ? <Navigate to="/" replace /> : <Login />} 
    />

    <Route 
      path="/callback" 
      element={<GovCallback />} 
    />

    <Route 
      path="/acesso-cidadao" 
      element={<AcessoCidadao />} 
    />

    {user && user.role != 'municipal' ? 
    <Route 
      path="/" 
      element={!user ? <Navigate to="/login" replace /> : <DefaultLayout />}
    >
      <Route index element={<Dashboard />} />
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="reports" element={<Reports />} />
      <Route path="applications" element={<Applications />} />
    </Route>
    :
    <Route 
      path="/" 
      element={!user ? <Navigate to="/login" replace /> : <DefaultLayout />}
    >
      <Route index element={<Applications />} />
      <Route path="applications" element={<Applications />} />
      <Route path="reports" element={<Reports />} />
    </Route>
    }
  </Routes>
)

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
