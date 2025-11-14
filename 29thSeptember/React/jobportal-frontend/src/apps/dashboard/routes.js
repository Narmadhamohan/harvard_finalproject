import Dashboard from "./pages/Dashboard";
import DashboardLayout from "../../layout/DashboardLayout";
import ProfileForm from "../profile/pages/ProfileForm";
import JobPostForm from "../jobs/pages/JobPostForm";

import ProtectedRoute from "../../router/ProtectedRoute";

export const dashboardRoutes = [
  {
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: "/index", element: <Dashboard /> },
      { path: "/profile", element: <ProfileForm /> },
      { path: "/post-job", element: <JobPostForm /> },
    ],
  },
];
