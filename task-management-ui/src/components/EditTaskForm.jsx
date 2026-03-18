import { useState } from "react";
import { motion } from "framer-motion";
import { updateTask } from "../api";
import Loading from "./Loading";

export default function EditTaskForm({ task, onTaskUpdated, onClose }) {
  const [form, setForm] = useState({
    title: task.title,
    description: task.description || "",
    dueDate: task.dueDate ? task.dueDate.slice(0, 16) : "",
    isCompleted: task.isCompleted,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await updateTask(task.id, form);
      onTaskUpdated(res.data);
      onClose();
    } catch (err) {
      const message = err.response?.data?.message || "Update failed";
      const details = err.response?.data?.details;
      setError(details ? `${message}: ${details}` : message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="glass-card rounded-2xl p-8 w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold text-primary mb-4">Edit Task</h2>
        {error && <p className="text-secondary mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-text-light mb-2">Title *</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full p-3 bg-dark-surface rounded-lg border border-primary border-opacity-30 focus:outline-none focus:ring-2 focus:ring-primary text-white"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-text-light mb-2">Description</label>
            <textarea
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              className="w-full p-3 bg-dark-surface rounded-lg border border-primary border-opacity-30 focus:outline-none focus:ring-2 focus:ring-primary text-white"
              rows="3"
            />
          </div>
          <div className="mb-4">
            <label className="block text-text-light mb-2">Due Date</label>
            <input
              type="datetime-local"
              value={form.dueDate}
              onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
              className="w-full p-3 bg-dark-surface rounded-lg border border-primary border-opacity-30 focus:outline-none focus:ring-2 focus:ring-primary text-white"
            />
          </div>
          <div className="mb-6 flex items-center">
            <input
              type="checkbox"
              checked={form.isCompleted}
              onChange={(e) =>
                setForm({ ...form, isCompleted: e.target.checked })
              }
              className="w-5 h-5 accent-primary mr-2"
            />
            <label className="text-text-light">Completed</label>
          </div>
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
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
              {loading ? "Saving..." : "Save Changes"}
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
  );
}
