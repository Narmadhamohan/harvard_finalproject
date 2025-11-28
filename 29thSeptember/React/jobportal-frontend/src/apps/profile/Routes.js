import ProfileDetail from "./pages/ProfileDetail";
import ProfileForm from "./pages/ProfileForm";
//import ChangePassword from "./pages/ChangePassword";
//import ViewProfiles from "./pages/viewProfiles";
import ProfileList from "./pages/ProfileList";
import { Outlet } from "react-router-dom";
export const profileRoutes = [
  {
    path: "profiles/profiles-list",
    element: ( <ProfileList /> ),
  },
  {
    path: "profiles/:id",
    element: ( <ProfileDetail /> ),
  }
];

