import { useState } from "react";
import { supabase } from "../lib/supabase";

export default function TaskForm({ user, onTaskAdded }) {
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const cleanTitle = title.trim();

    if (!cleanTitle) {
      return;
    }

    setLoading(true);

    const { data, error } = await supabase
      .from("tasks")
      .insert({
        title: cleanTitle,
        user_id: user.id,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating task:", error);
      alert(error.message);
    } else {
      onTaskAdded(data);
      setTitle("");
    }

    setLoading(false);
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="What needs to be done?"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        disabled={loading}
        maxLength={200}
      />

      <button type="submit" disabled={loading || !title.trim()}>
        {loading ? "Adding..." : "Add Task"}
      </button>
    </form>
  );
}