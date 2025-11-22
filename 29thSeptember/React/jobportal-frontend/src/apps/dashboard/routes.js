import DashboardLayout from "../../layout/DashboardLayout";
import { jobRoutes } from "../jobs/jobroutes";
import { mailRoutes } from "../mail/mailroutes";
import { profileRoutes } from "../profile/Routes";
import { dashboardRoutes } from "./dashboardroute";

export const dashboardParentRoute = {
  path: "/",
  element: <DashboardLayout />,
  children: [
    
    ...jobRoutes,
    ...mailRoutes,
    ...profileRoutes,
    ...dashboardRoutes,
  ]
};
