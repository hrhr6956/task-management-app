import { useState } from "react";
import { motion } from "framer-motion";
import { login } from "../api";
import { useNavigate } from "react-router-dom";
import Loading from "./Loading";

export default function Login({ onLogin }) {
  const [form, setForm] = useState({ usernameOrEmail: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await login(form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      onLogin();
      setTimeout(() => {
        setLoading(false);
        navigate("/tasks");
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
      setLoading(false);
    }
  };

  return (
    <>
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <Loading size={120} />
        </div>
      )}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen flex items-center justify-center p-4"
      >
        <div className="glass-card rounded-2xl p-8 w-full max-w-md">
          <h2 className="text-3xl font-bold text-primary mb-6">Welcome Back</h2>
          {error && <p className="text-secondary mb-4">{error}</p>}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-text-light mb-2">
                Username or Email
              </label>
              <input
                type="text"
                value={form.usernameOrEmail}
                onChange={(e) =>
                  setForm({ ...form, usernameOrEmail: e.target.value })
                }
                className="w-full p-3 bg-dark-surface rounded-lg border border-primary border-opacity-30 focus:outline-none focus:ring-2 focus:ring-primary text-white"
                required
              />
            </div>
            <div className="mb-6">
              <label className="block text-text-light mb-2">Password</label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full p-3 bg-dark-surface rounded-lg border border-primary border-opacity-30 focus:outline-none focus:ring-2 focus:ring-primary text-white"
                required
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-primary to-primary-dark text-dark-bg font-semibold py-3 rounded-lg shadow-glow hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Logging in..." : "Login"}
            </motion.button>
          </form>
          <p className="mt-4 text-center text-text-light">
            Don't have an account?{" "}
            <a href="/register" className="text-primary hover:underline">
              Create one
            </a>
          </p>
        </div>
      </motion.div>
    </>
  );
}
