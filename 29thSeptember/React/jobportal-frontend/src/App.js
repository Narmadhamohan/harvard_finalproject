import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import LoginForm from "./components/LoginForm";
import ProfileForm from "./components/ProfileForm";
import JobPostForm from "./components/JobPostForm";
import Dashboard from "./pages/Dashboard";

import ViewJobs from "./pages/ViewJobs"; // 👈 இந்த line சேர்க்கவும்
import JobDetail from "./pages/JobDetail"; // 👈 இந்த line சேர்க்கவும்

import DashboardLayout from "./layout/DashboardLayout";

// ✅ Protected route: only accessible if JWT exists
function ProtectedRoute({ children }) {
  const token = localStorage.getItem("accessToken");
  return token ? children : <Navigate to="/" />;
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* ✅ Login route */}
          <Route path="/" element={<LoginForm />} />

			  {/* ✅ Protected routes (only if logged in) 
          <Route 
			     path="/dashboard" */}

              <Route
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
			<Route path="/index"
            element={
                <Dashboard />
            }
          />

          <Route
            path="/profile"
            element={
           
                <ProfileForm />
            
            }
          />

          <Route
            path="/post-job"
            element={
             
                <JobPostForm />
             
            }
          />
		 <Route path="/view-jobs" element={
                <ViewJobs />
              
			  } 
               

		  /> {/* 👈 இதை சேர்க்கவும் */}
   </Route>
        <Route path="/jobs/:id" element={<JobDetail />} />


        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
