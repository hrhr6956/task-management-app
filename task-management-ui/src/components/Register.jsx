import { useState } from "react";
import { motion } from "framer-motion";
import { register } from "../api";
import { useNavigate } from "react-router-dom";
import Loading from "./Loading";

export default function Register() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      await register(form);
      // showing-off the animation for 2 sec
      setTimeout(() => {
        setLoading(false);
        navigate("/login");
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
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
          <h2 className="text-3xl font-bold text-primary mb-6">
            Create Account
          </h2>
          {error && <p className="text-secondary mb-4">{error}</p>}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-text-light mb-2">Username</label>
              <input
                type="text"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                className="w-full p-3 bg-dark-surface rounded-lg border border-primary border-opacity-30 focus:outline-none focus:ring-2 focus:ring-primary text-white"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-text-light mb-2">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full p-3 bg-dark-surface rounded-lg border border-primary border-opacity-30 focus:outline-none focus:ring-2 focus:ring-primary text-white"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-text-light mb-2">Password</label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full p-3 bg-dark-surface rounded-lg border border-primary border-opacity-30 focus:outline-none focus:ring-2 focus:ring-primary text-white"
                required
              />
            </div>
            <div className="mb-6">
              <label className="block text-text-light mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                value={form.confirmPassword}
                onChange={(e) =>
                  setForm({ ...form, confirmPassword: e.target.value })
                }
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
              {loading ? "Creating account..." : "Register"}
            </motion.button>
          </form>
          <p className="mt-4 text-center text-text-light">
            Already have an account?{" "}
            <a href="/login" className="text-primary hover:underline">
              Login
            </a>
          </p>
        </div>
      </motion.div>
    </>
  );
}
