import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";

{/* below side bar is not incorporated in indexpath's dashboard.
  We just removed recently */}

export default function Sidebar() {
  const { logout } = useContext(AuthContext);

  return (
    <aside className="w-64 h-screen bg-gray-900 text-white p-5">
      <h2 className="text-xl font-semibold mb-6">Job Portal</h2>
      <ul className="space-y-3">
        <li>
          <Link to="/index" className="hover:text-blue-300">Dashboard</Link>
        </li>
        <li>
          <Link to="/profile" className="hover:text-blue-300">Profile</Link>
        </li>
        <li>
          <Link to="/post-job" className="hover:text-blue-300">Post Job</Link>
        </li>
        <li>
          <Link to="/view-jobs" className="hover:text-blue-300">View Jobs</Link>
        </li>
        <li>
          <Link to="/messages" className="hover:text-blue-300">Messages</Link>
        </li>
      </ul>

      <button
        onClick={logout}
        className="mt-10 bg-red-500 hover:bg-red-600 w-full py-2 rounded-lg"
      >
        Logout
      </button>
    </aside>
  );
}
