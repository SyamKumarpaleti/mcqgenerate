import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SignIn({ onSignIn }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignIn = async () => {
    if (username && password) {
      try {
        const response = await fetch("http://localhost:8080/signin", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (response.ok) {
          onSignIn(username);
          navigate("/");
        } else {
          alert(data.error);
        }
      } catch (error) {
        alert("An error occurred during sign-in.");
      }
    } else {
      alert("Please enter your username and password.");
    }
  };

  return (
    <div className="SignIn">
      <h2>Sign In</h2>
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
      <button onClick={handleSignIn}>Sign In</button>
    </div>
  );
}
