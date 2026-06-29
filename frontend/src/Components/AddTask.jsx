import React from "react";
import { useState } from "react";
import "../Styles/Addtask.css";
import { useNavigate } from "react-router-dom";

function AddTask() {
  const [taskData, setTaskData] = useState();
  const navigate = useNavigate();
  const handleAddTask = async () => {
    console.log(taskData);

    let result = await fetch("http://localhost:3200/add-task", {
      method: "POST",
      body: JSON.stringify(taskData),
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });
    result = await result.json();
    if (result.success) {
      alert("Task Added Successfully");
      navigate("/");
    } else {
      alert("Failed to add task");
    }
  };
  return (
    <div className="add-task-container">
      <h1>Add Task Page</h1>
      <label htmlFor="">Task Title:</label>
      <input
        type="text"
        placeholder="Enter Task Title"
        onChange={(e) => setTaskData({ ...taskData, title: e.target.value })}
      />
      <label htmlFor="">Task Description:</label>
      <textarea
        placeholder="Enter Task Description"
        onChange={(e) =>
          setTaskData({ ...taskData, description: e.target.value })
        }
      ></textarea>
      <button onClick={handleAddTask}>Add Task</button>
    </div>
  );
}

export default AddTask;
