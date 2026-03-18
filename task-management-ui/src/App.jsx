import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import GradientBackground from "./components/GradientBackground";
import Login from "./components/Login";
import Register from "./components/Register";
import TaskList from "./components/TaskList";
import CreateTaskForm from "./components/CreateTaskForm";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token"),
  );

  const handleLogin = () => setIsAuthenticated(true);
  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
  };

  return (
    <BrowserRouter>
      <GradientBackground />
      <div className="relative z-10">
        <Routes>
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/tasks"
            element={
              isAuthenticated ? (
                <>
                  <TaskList onLogout={handleLogout} />
                  <CreateTaskForm
                    onTaskCreated={() => window.location.reload()}
                  />
                </>
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="*"
            element={<Navigate to={isAuthenticated ? "/tasks" : "/login"} />}
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
