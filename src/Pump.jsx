import React, { useState, useRef, useEffect } from "react";
import logo from "./logo.png";
import "./index.css";
import { VersionedTransaction, Connection, Keypair } from "@solana/web3.js";
import bs58 from "bs58";

const RPC_ENDPOINT =
  "https://powerful-palpable-fire.solana-mainnet.quiknode.pro/d9ad1922b3d9b7f55a5d406db49a3bf97f19e2d0";
const web3Connection = new Connection(RPC_ENDPOINT, "confirmed");

const Pump = () => {
  const [inputHistory, setInputHistory] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState({
    ticker: "",
    name: "",
    description: "",
  });
  const [confirming, setConfirming] = useState(false);
  const chatContainerRef = useRef(null);

  const questions = [
    "What's the ticker?",
    "What's the name?",
    "What's the description?",
  ];

  useEffect(() => {
    setInputHistory([{ text: questions[0], sender: "ai" }]);
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [inputHistory]);

  const handleResponse = async (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      const userResponse = e.target.value.trim();

      if (confirming) {
        if (userResponse.toLowerCase() === "yes") {
          setInputHistory((prev) => [
            ...prev,
            { text: "Coin creation has begun!", sender: "ai" },
          ]);
          await sendLocalCreateTx();
          setConfirming(false);
        } else {
          setInputHistory((prev) => [
            ...prev,
            { text: "Confirmation canceled.", sender: "ai" },
          ]);
          setConfirming(false);
        }
        e.target.value = "";
        return;
      }

      if (userResponse && currentQuestionIndex < questions.length) {
        const questionKey = ["ticker", "name", "description"][
          currentQuestionIndex
        ];

        setResponses((prevResponses) => ({
          ...prevResponses,
          [questionKey]: userResponse,
        }));

        setInputHistory((prev) => [
          ...prev,
          { text: userResponse, sender: "user" },
        ]);

        e.target.value = "";
        if (currentQuestionIndex < questions.length - 1) {
          setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
          setInputHistory((prev) => [
            ...prev,
            { text: questions[currentQuestionIndex + 1], sender: "ai" },
          ]);
        } else {
          const finalResponses = {
            ...responses,
            [questionKey]: userResponse,
          };
          setInputHistory((prev) => [
            ...prev,
            {
              text: `Thank you! Here are your responses:\nTicker: ${finalResponses.ticker}\nName: ${finalResponses.name}\nDescription: ${finalResponses.description}`,
              sender: "ai",
            },
            {
              text: "Would you like to confirm the creation of the coin? If so, respond 'Yes'.",
              sender: "ai",
            },
          ]);
          setConfirming(true);
        }
      }
    }
  };

  const sendLocalCreateTx = async () => {
    try {
      const privateKey =
        "3Ctrr8LrvCxQpf2ttMjBZHZVJqHyghdsHsp49tbJvH1uznnEt6Jr9ZYR8yiXbPz4NDZRzyToxWJ6GM9gqwkzKLXB";
      if (!privateKey) {
        throw new Error("Private key not set in environment variables");
      }
      const signerKeyPair = Keypair.fromSecretKey(bs58.decode(privateKey));

      const mintKeypair = Keypair.generate();

      const formData = new FormData();
      formData.append("name", responses.name);
      formData.append("symbol", responses.ticker);
      formData.append("description", responses.description);
      formData.append("twitter", "");
      formData.append("telegram", "");
      formData.append("website", "");
      formData.append("showName", "true");

      const metadataResponse = await fetch("https://pump.fun/api/ipfs", {
        method: "POST",
        body: formData,
      });
      const metadataResponseJSON = await metadataResponse.json();

      const response = await fetch(`https://pumpportal.fun/api/trade-local`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          publicKey: signerKeyPair.publicKey.toBase58(),
          action: "create",
          tokenMetadata: {
            name: metadataResponseJSON.metadata.name,
            symbol: metadataResponseJSON.metadata.symbol,
            uri: metadataResponseJSON.metadataUri,
          },
          mint: mintKeypair.publicKey.toBase58(),
          denominatedInSol: "true",
          amount: 0,
          slippage: 10,
          priorityFee: 0.0005,
          pool: "pump",
        }),
      });

      if (response.status === 200) {
        const data = await response.arrayBuffer();
        const tx = VersionedTransaction.deserialize(new Uint8Array(data));
        tx.sign([mintKeypair, signerKeyPair]);
        const signature = await web3Connection.sendTransaction(tx);
        console.log("Transaction: https://solscan.io/tx/" + signature);
        setInputHistory((prev) => [
          ...prev,
          {
            text:
              "Token created successfully! Check it out here: https://solscan.io/tx/" +
              signature,
            sender: "ai",
          },
        ]);
      } else {
        console.log(response.statusText);
        setInputHistory((prev) => [
          ...prev,
          {
            text: "Error creating token: " + response.statusText,
            sender: "ai",
          },
        ]);
      }
    } catch (error) {
      console.error("Error sending transaction:", error);
      setInputHistory((prev) => [
        ...prev,
        {
          text: "An error occurred while creating the token. Please try again.",
          sender: "ai",
        },
      ]);
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

      <div className="chat__active">
        <div className="chat__div">
          <div className="chat__holder" ref={chatContainerRef}>
            {inputHistory.map((entry, index) => (
              <div
                key={index}
                className={
                  entry.sender === "user" ? "chat__user__div" : "chat__ai__div"
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
              onKeyDown={handleResponse}
              placeholder="Type your response here..."
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pump;
