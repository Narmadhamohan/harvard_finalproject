import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext";
// import functionname from /foldername/filename
import { authRoutes } from "../auth/routes";
import { dashboardRoutes } from "../apps/dashboard/routes";
import { jobRoutes } from "../apps/jobs/jobroutes";

export default function AppRouter() {
  const allRoutes = [
    ...authRoutes,
    ...dashboardRoutes,
    ...jobRoutes,
  ];

  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {allRoutes.map((route, index) => {
            if (route.children) {
              return (
                <Route key={index} element={route.element}>
                  {route.children.map((child, i) => (
                    <Route key={i} path={child.path} element={child.element} />
                  ))}
                </Route>
              );
            }
            return <Route key={index} path={route.path} element={route.element} />;
          })}
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
