import ViewJobs from "./pages/ViewJobs";
import LookingToHire from "./pages/LookingToHire";
import JobDetail from "./pages/JobDetail";
import { JobsProvider } from "./context/JobsContext";
import MyApplications from "./pages/MyApplications";
import AppliedJobDetails from "./pages/AppliedJobDetails";
import PostJob from "./pages/PostJob";
import ManageJobs from "./pages/ManageJobs";
import SelectApplicant from "./pages/SelectApplicant";
import PostedJobDetail from "./pages/PostedJobDetail"
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
    {
    path: "posted-jobs/:id",         // NOT "/jobs/:id"
    element: (
      <JobsProvider>
        <PostedJobDetail />
      </JobsProvider>
    ),
  },
  {
    path: "/my-applications",
     element: (<MyApplications />)
  },
    {
    path: "/my-applications/:jobId",
     element: (<AppliedJobDetails />)
  },
    {
    path: "/looking-to-hire",
    element : (<LookingToHire></LookingToHire>)
  },
  {
    path: "/post-job",
    element : (<PostJob></PostJob>)
  },
    {
    path: "/manage-jobs",
    element : (<ManageJobs></ManageJobs>)
  },
  {
    path: "/select-applicant/:jobId",
    element: (<SelectApplicant></SelectApplicant>),
  }
];
