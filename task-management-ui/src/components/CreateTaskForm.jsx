import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createTask } from "../api";
import Loading from "./Loading";

export default function CreateTaskForm({ onTaskCreated }) {
  const [form, setForm] = useState({ title: "", description: "", dueDate: "" });
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await createTask(form);
      onTaskCreated(res.data);
      setForm({ title: "", description: "", dueDate: "" });
      setShow(false);
    } catch (err) {
      const message = err.response?.data?.message || "Failed to create task";
      const details = err.response?.data?.details;
      setError(details ? `${message}: ${details}` : message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShow(true)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-primary to-primary-dark text-white p-4 rounded-full shadow-glow z-40"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4v16m8-8H4"
          />
        </svg>
      </motion.button>

      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setShow(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="glass-card rounded-2xl p-8 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-bold text-primary mb-4">New Task</h2>
              {error && <p className="text-secondary mb-4">{error}</p>}
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-text-light mb-2">Title *</label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) =>
                      setForm({ ...form, title: e.target.value })
                    }
                    className="w-full p-3 bg-dark-surface rounded-lg border border-primary border-opacity-30 focus:outline-none focus:ring-2 focus:ring-primary text-white"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-text-light mb-2">
                    Description
                  </label>
                  <textarea
                    value={form.description}
                    onChange={(e) =>
                      setForm({ ...form, description: e.target.value })
                    }
                    className="w-full p-3 bg-dark-surface rounded-lg border border-primary border-opacity-30 focus:outline-none focus:ring-2 focus:ring-primary text-white"
                    rows="3"
                  />
                </div>
                <div className="mb-6">
                  <label className="block text-text-light mb-2">Due Date</label>
                  <input
                    type="datetime-local"
                    value={form.dueDate}
                    onChange={(e) =>
                      setForm({ ...form, dueDate: e.target.value })
                    }
                    className="w-full p-3 bg-dark-surface rounded-lg border border-primary border-opacity-30 focus:outline-none focus:ring-2 focus:ring-primary text-white"
                  />
                </div>
                <div className="flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={() => setShow(false)}
                    className="px-4 py-2 text-text-light hover:text-white"
                  >
                    Cancel
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={loading}
                    className="bg-gradient-to-r from-primary to-primary-dark text-dark-bg font-semibold px-6 py-2 rounded-lg shadow-glow disabled:opacity-50"
                  >
                    {loading ? "Creating..." : "Create"}
                  </motion.button>
                </div>
              </form>
              {loading && (
                <div className="mt-4">
                  <Loading size={60} />
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
