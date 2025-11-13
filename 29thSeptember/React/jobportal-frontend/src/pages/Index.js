import Sidebar from "../components/Sidebar";

export default function Index() {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-semibold mb-4 text-gray-800">
          Welcome to Job Portal Dashboard
        </h1>
        <p className="text-gray-600">
          You are successfully logged in using JWT authentication.
        </p>
      </main>
    </div>
  );
}
