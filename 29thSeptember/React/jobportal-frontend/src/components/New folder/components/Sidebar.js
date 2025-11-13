import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
  const location = useLocation();
  const active = (path) =>
    location.pathname === path
      ? "bg-blue-600 text-white font-semibold"
      : "text-gray-700 hover:bg-blue-100";

  return (
    <div className="w-60 bg-white shadow-lg h-screen p-5 space-y-4">
      <h2 className="text-lg font-bold text-blue-600 mb-6">Navigation</h2>
      <Link to="/dashboard" className={`block p-2 rounded-lg ${active("/dashboard")}`}>
        Dashboard
      </Link>
      <Link to="/profile" className={`block p-2 rounded-lg ${active("/profile")}`}>
        Profile
      </Link>
      <Link to="/post-job" className={`block p-2 rounded-lg ${active("/post-job")}`}>
        Post Job
      </Link>
    </div>
  );
}
