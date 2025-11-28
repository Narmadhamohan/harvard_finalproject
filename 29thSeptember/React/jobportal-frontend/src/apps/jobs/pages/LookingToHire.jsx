import { useNavigate } from "react-router-dom";

export default function LookingToHire() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-full space-y-6">
      <h2 className="text-3xl font-bold">Looking to Hire?</h2>

      <button
        className="bg-green-600 text-white px-6 py-3 rounded-lg text-xl shadow"
        onClick={() => navigate("/post-job")}
      >
        ➕ Post a Job
      </button>

      <button
        className="bg-blue-600 text-white px-6 py-3 rounded-lg"
        onClick={() => navigate("/manage-jobs")}
      >
        📄 View Posted Jobs
      </button>
    </div>
  );
}
