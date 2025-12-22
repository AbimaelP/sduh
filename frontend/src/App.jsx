import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Reports from "./pages/Reports";
import DefaultLayout from "./components/DefaultLayout";
import { FiltersProvider } from './contexts/FiltersContext';
import { MenuProvider } from './contexts/MenuContext';
import Applications from './pages/Applications';
import GovCallback from './pages/GovCallback';
import Loading from './components/Loading';
import AcessoCidadao from './pages/AcessoCidadao';
import CyberArkCallback from './pages/CyberArkCallback';
import MinhaAreaCallback from './pages/MinhaAreaCallback';
import ReportsLooker from "./pages/ReportsLooker";
import { DataProvider } from "./contexts/DataContext";

function AppRoutes() {
  const { user, loading } = useAuth();
  const location = useLocation();

  const isCallback =
    location.pathname.startsWith("/minha-area/callback") ||
    location.pathname.startsWith("/callback") ||
    location.pathname.startsWith("/cyberark/callback");

  if (loading && !isCallback) {
    return <Loading />;
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={user ? <Navigate to="/" replace /> : <Login />}
      />

      {/* ✅ Callbacks liberados mesmo com loading */}
      <Route path="/callback/*" element={<GovCallback />} />
      <Route path="/cyberark/callback/*" element={<CyberArkCallback />} />
      <Route path="/minha-area/callback/*" element={<MinhaAreaCallback />} />

      <Route path="/acesso-cidadao" element={<AcessoCidadao />} />

      {user && user.role !== "municipio_user" && user.role !== "sduh_user" ? (
        <Route
          path="/"
          element={!user ? <Navigate to="/login" replace /> : <DefaultLayout />}
        >
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          {user.role === "sduh_mgr" ? (
            <Route path="reports" element={<ReportsLooker />} />
          ) : (
            <Route path="reports" element={<Reports />} />
          )}
          <Route path="applications" element={<Applications />} />
        </Route>
      ) : (
        <Route
          path="/"
          element={!user ? <Navigate to="/login" replace /> : <DefaultLayout />}
        >
          <Route index element={<Applications />} />
          <Route path="applications" element={<Applications />} />

          {user && user.role === "municipio_user" ? (
            <Route path="reports" element={<ReportsLooker />} />
          ) : (
            <Route path="reports" element={<Reports />} />
          )}
        </Route>
      )}
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MenuProvider>
        <DataProvider>
          <FiltersProvider>
            <BrowserRouter>
              <AppRoutes />
            </BrowserRouter>
          </FiltersProvider>
        </DataProvider>
      </MenuProvider>
    </AuthProvider>
  );
}
