"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "./supabase-client";

interface Task {
  id: number;
  title: string;
  description: string;
  created_at: string;
}

export default function TaskManager() {
  const [newTask, setNewTask] = useState({ title: "", description: "" });
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newDescription, setNewDescription] = useState("");

  const fetchTasks = async () => {
    const { error, data } = await supabase
      .from("tasks")
      .select("*")
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error reading task: ", error.message);
      return;
    }

    if (data) {
      setTasks(data);
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const { error } = await supabase.from("tasks").insert(newTask).single();

    if (error) {
      console.error("Error adding task: ", error.message);
      return;
    }

    setNewTask({ title: "", description: "" });
    await fetchTasks(); // Refresh the task list
  };

  const deleteTask = async (id: number) => {
    const { error } = await supabase.from("tasks").delete().eq("id", id);

    if (error) {
      console.error("Error deleting task: ", error.message);
      return;
    }

    await fetchTasks(); // Refresh the task list
  };

  const updateTask = async (id: number) => {
    const { error } = await supabase
      .from("tasks")
      .update({ description: newDescription })
      .eq("id", id);

    if (error) {
      console.error("Error updating task: ", error.message);
      return;
    }

    setNewDescription(""); // Clear the input
    await fetchTasks(); // Refresh the task list
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  console.log(tasks);

  return (
    <div className="min-h-screen bg-[#2a2d32] flex items-center justify-center p-8">
      <div className="w-full max-w-md space-y-8">
        <div className="space-y-6">
          <h1 className="text-2xl font-medium text-white text-center">
            Task Manager CRUD
          </h1>

          <div className="space-y-4">
            <Input
              placeholder="Task Title"
              onChange={(e) =>
                setNewTask((prev) => ({ ...prev, title: e.target.value }))
              }
              className="bg-transparent border-[#4a4d52] text-white placeholder:text-gray-500"
            />

            <Textarea
              placeholder="Task Description"
              onChange={(e) =>
                setNewTask((prev) => ({ ...prev, description: e.target.value }))
              }
              className="bg-transparent border-[#4a4d52] text-white placeholder:text-gray-500 min-h-[80px] resize-none"
            />

            <div className="flex justify-center">
              <Button
                onClick={handleSubmit}
                className="hover:bg-[#3a3d42] text-white border-0 bg-foreground w-6/12"
              >
                Add
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {tasks.map((task, key) => (
            <div
              key={task.id}
              className="border border-[#4a4d52] rounded-lg p-6 space-y-4"
            >
              <div className="space-y-2">
                <h2 className="text-lg font-medium text-white text-center">
                  {task.title}
                </h2>
                {task.description && (
                  <p className="text-blue-400 text-sm text-center">
                    {task.description}
                  </p>
                )}
              </div>

              <div className="flex gap-4 justify-center">
                <Textarea
                  placeholder="Updated description..."
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="text-white text-center"
                />
                <Button
                  onClick={() => updateTask(task.id)}
                  variant="ghost"
                  className="text-white hover:bg-[#3a3d42] bg-foreground"
                >
                  Edit
                </Button>
                <Button
                  onClick={() => deleteTask(task.id)}
                  variant="ghost"
                  className="text-white hover:bg-[#3a3d42] bg-foreground"
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
