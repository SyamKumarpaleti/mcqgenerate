// src/components/Home.js
import React from "react";
import { Link } from "react-router-dom";
import QuestionGenerator from "./QuestionGenerator";

export default function Home({ user }) {
  return (
    <div className="Home">
     
      {user ? (
        <div>
          <h2>Hello, {user}!</h2>
          <QuestionGenerator />
        </div>
      ) : (
        <p>Please sign in to generate questions.</p>
      )}
     
    </div>
  );
}
