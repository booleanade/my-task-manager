import { supabase } from "../lib/supabase";

export default function TaskList({ tasks, onTaskUpdated, onTaskDeleted }) {
  const toggleTask = async (task) => {
    const { data, error } = await supabase
      .from("tasks")
      .update({
        completed: !task.completed,
      })
      .eq("id", task.id)
      .select()
      .single();

    if (error) {
      console.error("Error updating task:", error);
      alert(error.message);
      return;
    }

    onTaskUpdated(data);
  };

  const deleteTask = async (taskId) => {
    const { error } = await supabase
      .from("tasks")
      .delete()
      .eq("id", taskId);

    if (error) {
      console.error("Error deleting task:", error);
      alert(error.message);
      return;
    }

    onTaskDeleted(taskId);
  };

  if (tasks.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">✓</div>
        <h3>No tasks yet</h3>
        <p>Add your first task to get started.</p>
      </div>
    );
  }

  return (
    <div className="task-list">
      {tasks.map((task) => (
        <div
          className={`task-item ${
            task.completed ? "completed" : ""
          }`}
          key={task.id}
        >
          <button
            className="check-button"
            onClick={() => toggleTask(task)}
            aria-label={
              task.completed
                ? "Mark task as incomplete"
                : "Mark task as complete"
            }
          >
            {task.completed ? "✓" : ""}
          </button>

          <span className="task-title">
            {task.title}
          </span>

          <button
            className="delete-button"
            onClick={() => deleteTask(task.id)}
            aria-label="Delete task"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}