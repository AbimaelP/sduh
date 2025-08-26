import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext"; // ajuste o caminho
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Maps from "./components/Maps";
import Reports from "./pages/Reports";
import DefaultLayout from "./components/DefaultLayout";
import { FiltersProvider } from './contexts/FiltersContext';
import { MenuProvider } from './contexts/MenuContext';

export default function App() {
  return (
    <AuthProvider>
      <MenuProvider>
        <FiltersProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />

              <Route path="/" element={<DefaultLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="reports" element={<Reports />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </FiltersProvider>
      </MenuProvider>
    </AuthProvider>
  );
}
