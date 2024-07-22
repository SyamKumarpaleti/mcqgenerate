import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComments } from "@fortawesome/free-solid-svg-icons";
import Sidebar from "./Sidebar";


export default function QuestionGenerator() {
  const [prompt, setPrompt] = useState("");
  const [questions, setQuestions] = useState("");
  const [error, setError] = useState("");
  const [history, setHistory] = useState([]);

  const handleGenerateQuestions = async () => {
    try {
      const response = await fetch("http://localhost:8080/generate_questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();

      if (response.ok) {
        setQuestions(data.questions);
        setError("");
        setHistory([...history, { prompt, questions: data.questions }]);
      } else {
        setError(data.error);
        setQuestions("");
      }
    } catch (error) {
      setError("An error occurred while generating questions.");
      setQuestions("");
    }
  };

  const handleSelectHistoryItem = (item) => {
    setPrompt(item.prompt);
    setQuestions(item.questions);
    setError("");
  };

  const handleNewChat = () => {
    setPrompt("");
    setQuestions("");
    setError("");
  };

  return (
    <div className="QuestionGeneratorWrapper">
      <Sidebar history={history} onSelect={handleSelectHistoryItem} />
      <div className="QuestionGenerator">
        <div className="Header">
          <h2>ChatMCQ</h2>
          <button onClick={handleNewChat} className="NewChatButton">
            <FontAwesomeIcon icon={faComments} />
          </button>
        </div>
        <div className="textareaContainer">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter your prompt here"
          />
          <button onClick={handleGenerateQuestions} className="generateButton">
            Generate
          </button>
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}
        {questions && (
          <div>
            <h3>Generated Questions</h3>
            <pre>{questions}</pre>
          </div>
        )}
      </div>
    </div>
  );
}
