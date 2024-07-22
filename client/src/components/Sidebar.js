// src/components/Sidebar.js
import React from "react";

function truncateText(text, maxWords) {
  const words = text.split(" ");
  if (words.length > maxWords) {
    return words.slice(0, maxWords).join(" ") + " ...";
  }
  return text;
}

export default function Sidebar({ history, onSelect }) {
  return (
    <div className="Sidebar">
      <h3>Previous Searches</h3>
      <ul>
        {history.map((item, index) => (
          <li key={index} onClick={() => onSelect(item)}>
            <p>{truncateText(item.prompt, 5)}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
