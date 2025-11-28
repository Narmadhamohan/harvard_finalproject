import { Outlet, Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function DashboardLayout() {
  const { user, handleLogout } = useContext(AuthContext);


  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-800 text-white flex flex-col p-4 space-y-4">
        <h2 className="text-2xl font-bold mb-4">Job Portal</h2>
        <nav className="flex flex-col space-y-3">
          <Link to="/dashboard" className="hover:text-yellow-300">Dashboard</Link>
          <Link to="/view-jobs" className="hover:text-yellow-300">View Jobs</Link>
          <Link to="/profiles/profiles-list" className="hover:text-yellow-300"> Connect to Experts</Link>
           <Link to="/view-Message" className="hover:text-yellow-300">Message</Link>
          <Link to="/home" className="hover:text-yellow-300">Home</Link>
          {/* Draw new links as like outline */}
          <Link to="/my-applications" className="hover:text-yellow-300">
            My Applications
          </Link>
          <Link to="/looking-to-hire" className="hover:text-yellow-100">
            Looking to Hire
          </Link>
        </nav>
        <button
          onClick={handleLogout}
          className="mt-auto bg-red-500 hover:bg-red-600 text-white py-2 rounded"
        >
          Logout
        </button>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <header className="bg-white shadow p-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-700">Welcome, {user?.username}</h1>
           {/* NEW TOP NAV MESSAGE LINK   */}
          <Link to="/view-message" className="text-blue-700 font-semibold">
            Messages
          </Link>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6">
          <Outlet /> {/* 👈 renders Dashboard, ViewJobs, Home, etc. */}
        </main>
      </div>
    </div>
  );
}
