import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthProvider";
import {Link} from "react-router-dom";

export default function LoginForm() {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    await login(email, password);
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="max-w-sm w-full p-6 bg-white shadow-lg rounded-xl">
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
          Login
        </h2>
        <form onSubmit={onSubmit}>
          <input
            type="email"
            className="w-full border p-2 mb-3 rounded"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            className="w-full border p-2 mb-3 rounded"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
          >
            Login
          </button>
           <p className="text-center mt-4">
    Don't have an account? <Link to="/signup"><u>Sign Up</u></Link>
  </p>
        </form>
      </div>
    </div>
  );
}
