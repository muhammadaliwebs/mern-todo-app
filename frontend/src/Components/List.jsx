import React, { useState } from "react";
import { useEffect } from "react";
import "../Styles/Tasklist.css";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

function List() {
  const [taskList, setTaskList] = useState([]);

  const [selectedTasks, setSelectedTasks] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
    let list = await fetch("http://localhost:3200/tasks-list", {
      credentials: "include",
    });
    list = await list.json();
    console.log(list);
    if (list.success) {
      setTaskList(list.data);
    }
  };
  const deleteTask = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to recover this task!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, Delete it!",
    });

    if (!result.isConfirmed) return;

    let response = await fetch(`http://localhost:3200/delete-task/${id}`, {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    response = await response.json();

    if (response.success) {
      await Swal.fire({
        title: "Deleted!",
        text: "Task deleted successfully.",
        icon: "success",
        confirmButtonText: "OK",
      });

      fetchData();
    } else {
      await Swal.fire({
        title: "Error!",
        text: "Failed to delete task.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };
  const selectAll = (e) => {
    if (e.target.checked) {
      let allTaskIds = taskList.map((task) => task._id);
      setSelectedTasks(allTaskIds);
    } else {
      setSelectedTasks([]);
    }
  };
  const selectSingleTask = (id) => {
    console.log(id);
    if (selectedTasks.includes(id)) {
      let filteredTasks = selectedTasks.filter((taskId) => taskId !== id);
      setSelectedTasks(filteredTasks);
    } else {
      setSelectedTasks([...selectedTasks, id]);
    }
  };
  console.log(selectedTasks);

  const deleteMultiple = async () => {
    const confirm = await Swal.fire({
      title: "Delete Selected Tasks?",
      text: "You won't be able to recover these tasks!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, Delete All!",
      cancelButtonText: "Cancel",
    });

    if (!confirm.isConfirmed) return;

    let result = await fetch(`http://localhost:3200/delete-multiple/`, {
      method: "DELETE",
      body: JSON.stringify(selectedTasks),
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    result = await result.json();

    if (result.success) {
      await Swal.fire({
        title: "Deleted!",
        text: "Selected tasks deleted successfully.",
        icon: "success",
        confirmButtonText: "OK",
      });

      fetchData();
    } else {
      await Swal.fire({
        title: "Error!",
        text: "Failed to delete selected tasks.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <div className="task-list-container">
      <h1>List Page</h1>
      <button onClick={deleteMultiple} className="delete delete-all">
        Delete Selected Tasks
      </button>
      <ul className="task-list">
        <li>
          <input type="checkbox" onChange={selectAll} />
        </li>
        <li>S.No</li>
        <li>Title</li>
        <li>Description</li>
        <li>Action</li>
      </ul>
      {taskList.map((task, index) => (
        <ul key={index} className="task-list-item">
          <li>
            <input
              type="checkbox"
              checked={selectedTasks.includes(task._id)}
              onChange={() => {
                selectSingleTask(task._id);
              }}
            />
          </li>
          <li>{index + 1}</li>
          <li>{task.title}</li>
          <li>{task.description}</li>
          <li className="action-buttons">
            <button
              className="delete"
              onClick={() => {
                deleteTask(task._id);
              }}
            >
              Delete
            </button>
            <Link to={`/update-task/${task._id}`} className="update">
              Update
            </Link>
          </li>
        </ul>
      ))}
    </div>
  );
}

export default List;
