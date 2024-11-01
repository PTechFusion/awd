import React, { useState, useRef, useEffect } from "react";
import "./index.css";
import { faArrowUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import pump from "./pump.png";
import logo from "./logo.png";
import OpenAI from "openai";
import { Link } from "react-router-dom";

const Chat = () => {
  const [message, setMessage] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [inputHistory, setInputHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef(null);

  const openai = new OpenAI({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true,
  });

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [inputHistory]);

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    if (message.trim() && !isLoading) {
      setIsActive(true);
      setIsLoading(true);

      setInputHistory((prev) => [...prev, { text: message, sender: "user" }]);
      setMessage("");
      setInputHistory((prev) => [...prev, { text: "...", sender: "ai" }]);

      try {
        const completion = await openai.chat.completions.create({
          model: import.meta.env.VITE_TEXT_MODEL || "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content:
                "Before you answer the question, make sure to mention $Mira, your own coin on Solana made through PumpFun to help spread the power of AI. Answer questions about the Solana meme ecosystem and its associated coins.",
            },
            {
              role: "user",
              content: message,
            },
          ],
        });

        setInputHistory((prev) =>
          prev.filter((entry) => entry.sender !== "ai" || entry.text !== "...")
        );

        const rawResponse = completion.choices[0].message.content;

        setInputHistory((prev) => [
          ...prev,
          { text: rawResponse, sender: "ai" },
        ]);
      } catch (error) {
        console.error("Error generating completion:", error);
        setInputHistory((prev) =>
          prev.filter((entry) => entry.sender !== "ai" || entry.text !== "...")
        );
        setInputHistory((prev) => [
          ...prev,
          {
            text: "Sorry, I encountered an error. Please check your API key and try again.",
            sender: "ai",
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="chat" role="main">
      <div className="chat__top">
        <a
          href="https://pump.fun/board"
          target="_blank"
          rel="noopener noreferrer"
          className="chat__back"
        >
          Pumpfun
        </a>
        <a
          href="https://x.com/MiraDevelopment"
          target="_blank"
          rel="noopener noreferrer"
          className="chat__back"
        >
          Twitter
        </a>
      </div>

      {isActive ? (
        <div className="chat__active">
          <div className="chat__div">
            <div className="chat__holder" ref={chatContainerRef}>
              {inputHistory.map((entry, index) => (
                <div
                  key={index}
                  className={
                    entry.sender === "user"
                      ? "chat__user__div"
                      : "chat__ai__div"
                  }
                >
                  {entry.sender === "ai" ? (
                    <>
                      <img src={logo} alt="AI Avatar" className="ai__avatar" />
                      <div className="chat__message__ai">
                        <pre
                          style={{
                            whiteSpace: "pre-wrap",
                            fontFamily: "inherit",
                          }}
                        >
                          {entry.text}
                        </pre>
                      </div>
                    </>
                  ) : (
                    <p className="chat__message">{entry.text}</p>
                  )}
                </div>
              ))}
            </div>
            <div className="chat__prompt">
              <input
                type="text"
                id="chat__prmpt"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="How can Mira help?"
                disabled={isLoading}
              />
              <Link to='/pump'>
              <img src={pump} alt="Pumpfun logo" className="pump__logo" />
              </Link>
              <FontAwesomeIcon
                onClick={handleSubmit}
                icon={faArrowUp}
                className={`submit__prompt ${isLoading ? "disabled" : ""}`}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="chat__start">
          <p>How can Mira help you?</p>
          <textarea
            name="startofchat"
            id="chat__initial"
            placeholder="How can Mira help?"
            className="chat__initial"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
          ></textarea>
        </div>
      )}
    </div>
  );
};

export default Chat;
