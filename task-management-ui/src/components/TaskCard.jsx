import { useState } from "react";
import { motion } from "framer-motion";
import EditTaskForm from "./EditTaskForm";

export default function TaskCard({
  task,
  isExpired,
  onToggle,
  onDelete,
  onUpdate,
}) {
  const [showEdit, setShowEdit] = useState(false);

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        whileHover={{ scale: 1.02 }}
        className={`glass-card rounded-xl p-5 hover:shadow-glow transition-all ${
          isExpired ? "border border-secondary" : ""
        }`}
      >
        <div className="flex justify-between items-start">
          <h3
            className={`text-xl font-semibold ${
              task.isCompleted
                ? "line-through text-gray-500"
                : isExpired
                  ? "text-secondary"
                  : "text-primary"
            }`}
          >
            {task.title}
          </h3>
          <div className="flex items-center gap-3">
            {isExpired && (
              <span className="text-secondary text-xs bg-secondary bg-opacity-20 px-2 py-1 rounded">
                Expired
              </span>
            )}
            <input
              type="checkbox"
              checked={task.isCompleted}
              onChange={() => onToggle(task.id, !task.isCompleted)}
              className="w-5 h-5 accent-primary"
            />
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowEdit(true)}
              className="text-primary hover:text-primary-dark"
            >
              ✎
            </motion.button>
          </div>
        </div>
        {task.description && (
          <p className="text-text-light mt-2">{task.description}</p>
        )}
        <div className="flex justify-between items-center mt-4">
          <span
            className={`text-sm ${isExpired ? "text-secondary" : "text-primary-dark"}`}
          >
            {task.dueDate
              ? new Date(task.dueDate).toLocaleDateString()
              : "No due date"}
          </span>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onDelete(task.id)}
            className="text-secondary hover:text-red-400 transition-colors"
          >
            Delete
          </motion.button>
        </div>
      </motion.div>

      {showEdit && (
        <EditTaskForm
          task={task}
          onTaskUpdated={onUpdate}
          onClose={() => setShowEdit(false)}
        />
      )}
    </>
  );
}
