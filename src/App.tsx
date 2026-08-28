import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useState } from "react";

import Header from "./components/layout/Header";
import Sidebar from "./components/layout/Sidebar";

import Dashboard from "./pages/Dashboard";
import RiskMapPage from "./pages/RiskMapPage";
import RoutesPage from "./pages/RoutesPage";
import IncidentsPage from "./pages/IncidentsPage";
import ReportsPage from "./pages/ReportsPage";
import SettingsPage from "./pages/SettingsPage";

function ApplicationShell() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
      <div className="min-h-screen bg-slate-950 text-slate-100">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <div className="min-h-screen lg:ml-64">
          <Header onMenuOpen={() => setSidebarOpen(true)} />

          <main className="p-4 sm:p-6 lg:p-8">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/risk-map" element={<RiskMapPage />} />
              <Route path="/routes" element={<RoutesPage />} />
              <Route path="/incidents" element={<IncidentsPage />} />
              <Route path="/reports" element={<ReportsPage />} />
              <Route path="/settings" element={<SettingsPage />} />

              {/* Unknown route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </div>
  );
}
function App() { return <BrowserRouter><ApplicationShell /></BrowserRouter>; }

export default App;
