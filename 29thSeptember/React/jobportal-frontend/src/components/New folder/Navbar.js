import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { user, handleLogout } = useContext(AuthContext);

  return (
    <div className="flex justify-between items-center bg-blue-700 text-white px-6 py-3 shadow-md">
      <h1 className="text-xl font-semibold">📊 Job Portal Dashboard</h1>
      <div className="flex items-center gap-4">
        <span className="text-sm">👋 {user?.username || "Guest"}</span>
        <button
          onClick={handleLogout}
          className="bg-white text-blue-700 px-3 py-1 rounded-lg hover:bg-gray-200"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
