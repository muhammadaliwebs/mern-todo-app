import React, { useEffect } from "react";
import { useState } from "react";
import "../Styles/Updatetask.css";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

function UpdateTask() {
  const [taskData, setTaskData] = useState();

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    getTask(id);
  }, []);

  const getTask = async (id) => {
    let task = await fetch(
      `https://mern-todo-app-production-eb00.up.railway.app/tasks/${id}`,
      {
        credentials: "include",
      },
    );
    task = await task.json();
    if (task.success) {
      setTaskData(task.data);
    }
  };
  const updateTask = async (id) => {
    let result = await fetch(
      `https://mern-todo-app-production-eb00.up.railway.app/update-task`,
      {
        method: "PUT",
        body: JSON.stringify({ ...taskData, id }),
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      },
    );
    result = await result.json();
    if (result) {
      await Swal.fire({
        title: "Success!",
        text: "Task updated successfully.",
        icon: "success",
        confirmButtonText: "OK",
      });
      navigate("/");
    } else {
      await Swal.fire({
        title: "Error!",
        text: "Failed to update task.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
    console.log("function called", taskData);
  };
  return (
    <div className="update-task-container">
      <h1>Update Task Page</h1>
      <label htmlFor="">Task Title:</label>
      <input
        type="text"
        value={taskData?.title}
        placeholder="Enter Task Title"
        onChange={(e) => setTaskData({ ...taskData, title: e.target.value })}
      />
      <label htmlFor="">Task Description:</label>
      <textarea
        placeholder="Enter Task Description"
        value={taskData?.description}
        onChange={(e) =>
          setTaskData({ ...taskData, description: e.target.value })
        }
      ></textarea>
      <button className="update-btn" onClick={() => updateTask(id)}>
        Update Task
      </button>
    </div>
  );
}

export default UpdateTask;
