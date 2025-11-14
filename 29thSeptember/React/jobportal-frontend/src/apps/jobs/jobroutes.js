import ViewJobs from "./pages/ViewJobs";
import JobDetail from "./pages/JobDetail";
import { JobsProvider } from "./context/JobsContext";
import { Outlet } from "react-router-dom";

export const jobRoutes = [
  {
    element: (
      <JobsProvider>
        <Outlet />   {/* ✅ THIS RENDERS THE CHILD ROUTES */}
      </JobsProvider>
    ),
    children: [
      { path: "/view-jobs", element: <ViewJobs /> },
      { path: "/jobs/:id", element: <JobDetail /> },
    ],
  },
];
