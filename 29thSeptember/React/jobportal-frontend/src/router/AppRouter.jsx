import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "../context/AuthProvider";
import LoginForm from "../components/LoginForm";
import ProtectedRoute from "./ProtectedRoute";
import { dashboardParentRoute } from "../apps/dashboard/routes";
import SignUpPage from "../pages/SignUpPage";
export default function AppRouter() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>

          {/* Public Routes */}
          <Route path="/login" element={<LoginForm />} />
          
          <Route path="/signup" element={<SignUpPage />} />
          {/* Protected Dashboard + Children */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                {dashboardParentRoute.element}
              </ProtectedRoute>
            }
          >
            {dashboardParentRoute.children.map((child, i) => (
              <Route key={i} path={child.path} element={child.element} />
            ))}
          </Route>

        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
