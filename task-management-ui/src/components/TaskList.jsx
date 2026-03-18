import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TaskCard from "./TaskCard";
import { getTasks, updateTask, deleteTask } from "../api";
// import { useNavigate } from "react-router-dom";

export default function TaskList({ onLogout }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  // const navigate = useNavigate();

  // Pagination state
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  // eslint-disable-next-line no-unused-vars
  const [totalCount, setTotalCount] = useState(0);

  // Filter state
  const [filter, setFilter] = useState({
    isCompleted: "",
    dueDateFrom: "",
    dueDateTo: "",
    sortBy: "dueDate",
    sortOrder: "asc",
    expired: false, // new
  });

  // Filter popover visibility
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
    fetchTasks({ reset: true }); // initial load with reset
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pageSize = 10;

  const fetchTasks = async ({ reset = false } = {}) => {
    setLoading(true);
    const nextPage = reset ? 1 : page + 1;
    try {
      const params = {
        ...filter,
        pageNumber: nextPage,
        pageSize,
      };
      if (!filter.expired) {
        delete params.expired; // don't send false value
      }

      const res = await getTasks(params);

      if (reset || nextPage === 1) {
        setTasks(res.data.items);
      } else {
        setTasks((prev) => [...prev, ...res.data.items]);
      }

      setTotalCount(res.data.totalCount);
      const more =
        res.data.items.length === pageSize &&
        res.data.totalCount > nextPage * pageSize;
      setHasMore(more);

      if (!reset) {
        setPage((prev) => prev + 1);
      } else {
        setPage(1);
      }
    } catch {
      //console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (id, completed) => {
    try {
      await updateTask(id, { isCompleted: completed });
      setTasks(
        tasks.map((t) => (t.id === id ? { ...t, isCompleted: completed } : t)),
      );
    } catch {
      // console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTask(id);
      setTasks(tasks.filter((t) => t.id !== id));
    } catch {
      // console.error(err);
    }
  };

  const handleUpdate = (updatedTask) => {
    setTasks(tasks.map((t) => (t.id === updatedTask.id ? updatedTask : t)));
  };

  const handleLogoutClick = () => {
    localStorage.removeItem("user");
    onLogout();
  };

  const handleApplyFilters = () => {
    fetchTasks({ reset: true });
    setShowFilters(false);
  };

  const handleResetFilters = () => {
    setFilter({
      isCompleted: "",
      dueDateFrom: "",
      dueDateTo: "",
      sortBy: "dueDate",
      sortOrder: "asc",
      expired: false,
    });
    fetchTasks({ reset: true });
    setShowFilters(false);
  };

  if (loading && tasks.length === 0)
    return <div className="text-center text-primary mt-20">Loading...</div>;

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        {/* User card */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-4 glass-card rounded-xl p-3"
        >
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-primary-dark flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-dark-bg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
          <div>
            <p className="text-text-light text-sm">Welcome back,</p>
            <p className="text-primary font-semibold">
              {user?.username || "User"}
            </p>
          </div>
        </motion.div>

        <div className="flex items-center gap-3">
          {/* Filter button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowFilters(!showFilters)}
            className="bg-dark-surface text-primary p-3 rounded-lg shadow-glow hover:shadow-lg transition-all relative"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
              />
            </svg>
          </motion.button>

          {/* Logout button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogoutClick}
            className="bg-secondary text-white px-4 py-2 rounded-lg shadow-glow hover:shadow-lg transition-all flex items-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            Logout
          </motion.button>
        </div>
      </div>

      {/* Filter popover */}
      {showFilters && (
        <>
          <div
            className="fixed inset-0 z-20"
            onClick={() => setShowFilters(false)}
          />
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="relative z-30 mb-6"
          >
            <div className="absolute right-0 mt-2 w-96 glass-card rounded-xl p-6 shadow-2xl border border-primary border-opacity-20">
              <h3 className="text-lg font-semibold text-primary mb-4">
                Filter Tasks
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-text-light mb-2">Status</label>
                  <select
                    value={filter.isCompleted}
                    onChange={(e) =>
                      setFilter({ ...filter, isCompleted: e.target.value })
                    }
                    className="w-full bg-dark-surface rounded-lg p-3 text-white border border-primary border-opacity-30 focus:ring-2 focus:ring-primary"
                  >
                    <option value="">All Tasks</option>
                    <option value="true">Completed</option>
                    <option value="false">Pending</option>
                  </select>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-text-light">
                    <input
                      type="checkbox"
                      checked={filter.expired}
                      onChange={(e) =>
                        setFilter({ ...filter, expired: e.target.checked })
                      }
                      className="w-4 h-4 accent-primary"
                    />
                    Show Expired Only
                  </label>
                </div>

                <div>
                  <label className="block text-text-light mb-2">
                    Due Date From
                  </label>
                  <input
                    type="date"
                    value={filter.dueDateFrom}
                    onChange={(e) =>
                      setFilter({ ...filter, dueDateFrom: e.target.value })
                    }
                    className="w-full bg-dark-surface rounded-lg p-3 text-white border border-primary border-opacity-30 focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-text-light mb-2">
                    Due Date To
                  </label>
                  <input
                    type="date"
                    value={filter.dueDateTo}
                    onChange={(e) =>
                      setFilter({ ...filter, dueDateTo: e.target.value })
                    }
                    className="w-full bg-dark-surface rounded-lg p-3 text-white border border-primary border-opacity-30 focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-text-light mb-2">
                      Sort By
                    </label>
                    <select
                      value={filter.sortBy}
                      onChange={(e) =>
                        setFilter({ ...filter, sortBy: e.target.value })
                      }
                      className="w-full bg-dark-surface rounded-lg p-3 text-white border border-primary border-opacity-30 focus:ring-2 focus:ring-primary"
                    >
                      <option value="dueDate">Due Date</option>
                      <option value="createdAt">Created Date</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-text-light mb-2">Order</label>
                    <select
                      value={filter.sortOrder}
                      onChange={(e) =>
                        setFilter({ ...filter, sortOrder: e.target.value })
                      }
                      className="w-full bg-dark-surface rounded-lg p-3 text-white border border-primary border-opacity-30 focus:ring-2 focus:ring-primary"
                    >
                      <option value="asc">Ascending</option>
                      <option value="desc">Descending</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-4">
                  <button
                    onClick={handleResetFilters}
                    className="px-4 py-2 text-text-light hover:text-white"
                  >
                    Reset
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleApplyFilters}
                    className="bg-gradient-to-r from-primary to-primary-dark text-dark-bg font-semibold px-6 py-2 rounded-lg shadow-glow"
                  >
                    Apply Filters
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}

      <h1 className="text-4xl font-bold text-primary mb-8">My Tasks</h1>

      <AnimatePresence>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.map((task) => {
            const isExpired =
              task.dueDate &&
              new Date(task.dueDate) < new Date() &&
              !task.isCompleted;
            return (
              <TaskCard
                key={task.id}
                task={task}
                isExpired={isExpired}
                onToggle={handleToggle}
                onDelete={handleDelete}
                onUpdate={handleUpdate}
              />
            );
          })}
        </div>
        {hasMore && (
          <div className="flex justify-center mt-8">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => fetchTasks({ reset: false })}
              className="bg-primary text-dark-bg px-6 py-2 rounded-lg shadow-glow"
            >
              Load More
            </motion.button>
          </div>
        )}
      </AnimatePresence>
      {tasks.length === 0 && !loading && (
        <p className="text-center text-text-light mt-10">
          No tasks yet. Click the + button to create one.
        </p>
      )}
    </div>
  );
}
