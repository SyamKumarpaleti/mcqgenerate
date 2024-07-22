import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SignUp() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignUp = async () => {
    if (username && password) {
      try {
        const response = await fetch("http://localhost:8080/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (response.ok) {
          alert("Sign-up successful. Please sign in.");
          navigate("/signin");
        } else {
          alert(data.error);
        }
      } catch (error) {
        alert("An error occurred during sign-up.");
      }
    } else {
      alert("Please enter your username and password.");
    }
  };

  return (
    <div className="SignUp">
      <h2>Sign Up</h2>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button onClick={handleSignUp}>Sign Up</button>
    </div>
  );
}
