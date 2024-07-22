import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Home from "./components/Home";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import QuestionGenerator from "./components/QuestionGenerator";
import "./styles.css";

export default function App() {
  const [user, setUser] = useState(null);

  const handleSignIn = (username) => {
    setUser(username);
  };

  const handleSignOut = () => {
    setUser(null);
  };

  return (
    <Router>
      <div className="App">
        <nav className="navbar">
          <div className="navbar-left">
            <Link to="/" className="navbar-brand">ChatMCQ</Link>
          </div>
          <div className="navbar-right">
            {user ? (
              <>
                <span className="navbar-username">{user}</span>
                <Link to="/" className="navbar-link" onClick={handleSignOut}>Sign Out</Link>
              </>
            ) : (
              <>
                <Link to="/signin" className="navbar-link">Sign In</Link>
                <Link to="/signup" className="navbar-link">Sign Up</Link>
              </>
            )}
          </div>
        </nav>
        <Routes>
          <Route exact path="/" element={<Home user={user} />} />
          <Route path="/signin" element={<SignIn onSignIn={handleSignIn} />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/generate" element={<QuestionGenerator />} />
        </Routes>
      </div>
    </Router>
  );
}
