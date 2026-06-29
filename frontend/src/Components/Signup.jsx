import React from "react";
import "../Styles/Addtask.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

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
    let result = await fetch("http://localhost:3200/signup", {
      method: "POST",
      body: JSON.stringify(userData),
      headers: {
        "Content-Type": "application/json",
      },
    });
    result = await result.json();
    if (result.success) {
      alert("Signup Successfull");
      document.cookie = "token=" + result.token;
      localStorage.setItem("login", userData.email);
      window.dispatchEvent(new Event("local-storage"));
      navigate("/");
    } else {
      alert(result.message);
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
