import React from "react";
import { NavLink } from "react-router-dom";
import "../Styles/Navbar.css";
import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const [login, setLogin] = useState(localStorage.getItem("login"));

  const navigate = useNavigate();
  const logout = () => {
    console.log("Logout");
    localStorage.removeItem("login");
    setLogin(null);
    setTimeout(() => {
      navigate("/login");
    }, 0);
  };

  useEffect(() => {
    const handleStorageChange = () => {
      setLogin(localStorage.getItem("login"));
    };
    window.addEventListener("local-storage", handleStorageChange);
    return () => {
      window.removeEventListener("local-storage", handleStorageChange);
    };
  }, []);

  return (
    <nav className="navbar">
      <div className="logo">To-Do App</div>
      <ul className="nav-links">
        {login ? (
          <>
            <li>
              <NavLink to="/">List</NavLink>
            </li>
            <li>
              <NavLink to="/add-task">Add-Task</NavLink>
            </li>
            <li>
              <NavLink to="/logout" onClick={logout}>
                Logout
              </NavLink>
            </li>
          </>
        ) : null}
      </ul>
    </nav>
  );
}

export default Navbar;
