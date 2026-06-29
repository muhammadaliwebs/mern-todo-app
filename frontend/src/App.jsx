import React from "react";
import Navbar from "./Components/Navbar";
import { Route, Routes } from "react-router-dom";
import List from "./Components/List";
import AddTask from "./Components/AddTask";
import UpdateTask from "./Components/UpdateTask";
import Signup from "./Components/Signup";
import Login from "./Components/Login";
import "./Styles/App.css";
import Protected from "./Components/Protected";

function App() {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={
            <Protected>
              <List />
            </Protected>
          }
        />
        <Route
          path="/add-task"
          element={
            <Protected>
              <AddTask />
            </Protected>
          }
        />
        <Route path="/update-task/:id" element={<UpdateTask />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  );
}

export default App;
