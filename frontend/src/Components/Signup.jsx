import React from "react";
import "../Styles/Addtask.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Swal from "sweetalert2";

function Signup() {
  const [userData, setUserData] = React.useState({
    name: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("login")) {
      navigate("/");
    }
  }, []);

  const handleSignup = async () => {
    let result = await fetch(
      "https://mern-todo-app-production-eb00.up.railway.app/signup",
      {
        method: "POST",
        body: JSON.stringify(userData),
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      },
    );
    result = await result.json();
    if (result.success) {
      await Swal.fire({
        title: "Success!",
        text: "Signed up successfully.",
        icon: "success",
        confirmButtonText: "OK",
      });
      localStorage.setItem("login", userData.email);
      window.dispatchEvent(new Event("local-storage"));
      navigate("/");
    } else {
      await Swal.fire({
        title: "Error!",
        text: "Failed to sign up.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <div className="add-task-container">
      <h1>Sign Up Page</h1>
      <label htmlFor="">Name:</label>
      <input
        type="text"
        placeholder="Enter Name"
        onChange={(e) => setUserData({ ...userData, name: e.target.value })}
      />
      <label htmlFor="">Email:</label>
      <input
        type="email"
        placeholder="Enter Email"
        onChange={(e) => setUserData({ ...userData, email: e.target.value })}
      />
      <label htmlFor="">Password:</label>
      <input
        type="password"
        placeholder="Enter Password"
        onChange={(e) => setUserData({ ...userData, password: e.target.value })}
      />
      <button onClick={handleSignup}>Signup</button>
      <p className="auth-text">
        Already have an account?
        <Link to="/login" className="link">
          Login here
        </Link>
      </p>
    </div>
  );
}

export default Signup;
