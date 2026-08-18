import { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";

import Auth from "./components/Auth";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";

import "./App.css";

export default function App() {
  const [session, setSession] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      setSession(session);
      setLoading(false);
    };

    getSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (session?.user) {
      loadTasks();
    } else {
      setTasks([]);
    }
  }, [session]);

  const loadTasks = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      console.error("Error loading tasks:", error);
    } else {
      setTasks(data || []);
    }

    setLoading(false);
  };

  const handleTaskAdded = (task) => {
    setTasks((current) => [task, ...current]);
  };

  const handleTaskUpdated = (updatedTask) => {
    setTasks((current) =>
      current.map((task) =>
        task.id === updatedTask.id
          ? updatedTask
          : task
      )
    );
  };

  const handleTaskDeleted = (taskId) => {
    setTasks((current) =>
      current.filter((task) => task.id !== taskId)
    );
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Logout error:", error);
    }
  };

  if (loading && !session) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!session) {
    return <Auth />;
  }

  const user = session.user;

  const completedCount = tasks.filter(
    (task) => task.completed
  ).length;

  const pendingCount = tasks.length - completedCount;

  return (
    <div className="app">
      <header className="navbar">
        <div className="brand">
          <div className="brand-icon">✓</div>
          <span>Task Manager</span>
        </div>

        <div className="user-area">
          {user.user_metadata?.avatar_url && (
            <img
              src={user.user_metadata.avatar_url}
              alt="Profile"
              className="avatar"
            />
          )}

          <div className="user-info">
            <span className="user-name">
              {user.user_metadata?.full_name ||
                user.email}
            </span>

            <span className="user-email">
              {user.email}
            </span>
          </div>

          <button
            className="logout-button"
            onClick={handleLogout}
          >
            Sign out
          </button>
        </div>
      </header>

      <main className="container">
        <section className="welcome">
          <div>
            <h1>My Tasks</h1>
            <p>
              Keep track of what you need to accomplish.
            </p>
          </div>

          <div className="stats">
            <div className="stat">
              <strong>{pendingCount}</strong>
              <span>Pending</span>
            </div>

            <div className="stat">
              <strong>{completedCount}</strong>
              <span>Completed</span>
            </div>
          </div>
        </section>

        <TaskForm
          user={user}
          onTaskAdded={handleTaskAdded}
        />

        {loading ? (
          <div className="task-loading">
            Loading tasks...
          </div>
        ) : (
          <TaskList
            tasks={tasks}
            onTaskUpdated={handleTaskUpdated}
            onTaskDeleted={handleTaskDeleted}
          />
        )}
      </main>
    </div>
  );
}