import React from "react";
import "../Styles/Addtask.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Swal from "sweetalert2";

function Login() {
  const [userData, setUserData] = React.useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("login")) {
      navigate("/");
    }
  }, []);

  const handleLogin = async () => {
    let result = await fetch(
      "https://mern-todo-app-production-eb00.up.railway.app/login",
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
        text: "Logged in successfully.",
        icon: "success",
        confirmButtonText: "OK",
      });
      localStorage.setItem("login", userData.email);
      window.dispatchEvent(new Event("local-storage"));
      navigate("/");
    } else {
      await Swal.fire({
        title: "Error!",
        text: "Invalid email or password.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };
  return (
    <div className="add-task-container">
      <h1>Login Page</h1>
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
      <button onClick={handleLogin}>Login</button>
      <p className="auth-text">
        Don’t have an account?
        <Link to="/signup" className="link">
          Sign Up here
        </Link>
      </p>
    </div>
  );
}

export default Login;
