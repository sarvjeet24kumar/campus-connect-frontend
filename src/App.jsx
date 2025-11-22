import { Navigate, Route, Routes } from "react-router-dom";

import SiteHeader from "./components/SiteHeader.jsx";
import SiteFooter from "./components/SiteFooter.jsx";

import HomePage from "./pages/HomePage.jsx";
import StudentDashboard from "./pages/StudentDashboard.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import { AdminRoute, PublicRoute, StudentRoute } from "./routes/ProtectedRoute.jsx";
const App = () => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col">
      <SiteHeader />
      <main className="flex-1 mx-auto max-w-6xl w-full px-4 py-6">
        <Routes>
          <Route
            path="/"
            element={
              <PublicRoute restricted>
                <HomePage />
              </PublicRoute>
            }
          />
          <Route
            path="/student"
            element={
              <StudentRoute>
                <StudentDashboard />
              </StudentRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <SiteFooter />
    </div>
  );
};

export default App;
