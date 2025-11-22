import ViewJobs from "./pages/ViewJobs";
import JobDetail from "./pages/JobDetail";
import { JobsProvider } from "./context/JobsContext";

export const jobRoutes = [
  {
    path: "view-jobs",        // NOT "/view-jobs"
    element: (
      <JobsProvider>
        <ViewJobs />
      </JobsProvider>
    ),
  },
  {
    path: "jobs/:id",         // NOT "/jobs/:id"
    element: (
      <JobsProvider>
        <JobDetail />
      </JobsProvider>
    ),
  },
];
