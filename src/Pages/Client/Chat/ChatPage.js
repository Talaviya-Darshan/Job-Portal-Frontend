// src/pages/Chat/ChatPage.jsx

import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { io } from "socket.io-client";

export default function ChatPage({ closeModal }) {
  const apiUrl = process.env.REACT_APP_API_URL;
  const socketUrl = "http://localhost:3000";
  const meId = localStorage.getItem("id");
  const [peerName] = useState("Super Admin");
  const superAdminId = "6905d8d7bcb853ba392fd458";
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [socket, setSocket] = useState(null);
  const msgBoxRef = useRef(null);

  // ✅ Connect socket
  useEffect(() => {
    const s = io(socketUrl, { transports: ["websocket", "polling"] });
    setSocket(s);
    return () => s.disconnect();
  }, []);

  // ✅ Join room
  useEffect(() => {
    if (socket && meId) {
      socket.emit("join", { userId: meId });
    }
  }, [socket, meId]);

  // ✅ Load chat history
  useEffect(() => {
    if (!meId) return;

    axios
      .get(`${apiUrl}chat/${meId}/${superAdminId}`)
      .then((res) => setMessages(res.data))
      .catch(() => {});
  }, [meId]);

  // ✅ Receive Socket Messages
  useEffect(() => {
    if (!socket) return;

    socket.on("receiveMessage", (msg) => {
      if (
        (msg.senderId === meId && msg.receiverId === superAdminId) ||
        (msg.senderId === superAdminId && msg.receiverId === meId)
      ) {
        setMessages((prev) => [...prev, msg]);
      }
    });

    return () => socket.off("receiveMessage");
  }, [socket, meId]);

  // ✅ Auto Scroll
  useEffect(() => {
    if (msgBoxRef.current) {
      msgBoxRef.current.scrollTop = msgBoxRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = () => {
    if (!text.trim()) return;

    socket.emit("sendMessage", {
      senderId: meId,
      receiverId: superAdminId,
      message: text,
    });

    setText("");
  };

  return (
    <div className="modal-dialog modal-xl">
      <div className="modal-content">
        {/* Header */}
        <div className="modal-header">
          <h5 className="modal-title">{peerName}</h5>
          <button className="close" onClick={closeModal}>
            <span>&times;</span>
          </button>
        </div>

        {/* Body */}
        <div className="modal-body">
          <div className="card direct-chat direct-chat-primary">
            <div className="card-header">
              <h3 className="card-title">Direct Chat</h3>
              <div className="card-tools">
                <button
                  type="button"
                  className="btn btn-tool"
                  onClick={closeModal}
                >
                  {" "}
                  <i className="fas fa-times" />
                </button>
              </div>
            </div>

            <div className="card-body">
              <div className="direct-chat-messages">
                {/* LEFT MESSAGE */}
                <div className="direct-chat-msg">
                  <div className="direct-chat-infos clearfix">
                    <span className="direct-chat-name float-left">
                      Alexander Pierce
                    </span>
                  </div>
                  <img
                    className="direct-chat-img"
                    src="https://cdn-icons-png.freepik.com/512/16800/16800177.png"
                    alt="d"
                  />
                  <div className="direct-chat-text">
                    Is this template really for free? That's unbelievable!
                  </div>
                </div>

                {/* RIGHT MESSAGE */}
                <div className="direct-chat-msg right">
                  <div className="direct-chat-infos clearfix">
                    <span className="direct-chat-name float-right">
                      Sarah Bullock
                    </span>
                  </div>
                  <img
                    className="direct-chat-img"
                    src="https://cdn-icons-png.freepik.com/512/16800/16800177.png"
                    alt="ss"
                  />
                  <div className="direct-chat-text">You better believe it!</div>
                </div>
              </div>
            </div>

            <div className="card-footer">
              <form action="#" method="post">
                <div className="input-group">
                  <input
                    type="text"
                    name="message"
                    placeholder="Type Message ..."
                    className="form-control"
                  />
                  <span className="input-group-append">
                    <button type="button" className="btn btn-primary">
                      Send
                    </button>
                  </span>
                </div>
              </form>
            </div>
          </div>

          <div className="d-flex border rounded" style={{ height: "50vh" }}>
            <div className="d-flex flex-column flex-grow-1">
              {/* Chat box */}
              <div
                ref={msgBoxRef}
                className="flex-grow-1 p-3 overflow-auto bg-white"
              >
                {messages.map((m, i) => {
                  const isMine = m.senderId === meId;
                  return (
                    <div
                      key={i}
                      className={`mb-2 d-flex ${
                        isMine ? "justify-content-end" : "justify-content-start"
                      }`}
                    >
                      <span
                        className={` px-3 rounded   ${
                          isMine ? "bg-primary text-white" : "bg-secondary"
                        }`}
                      >
                        {m.message}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Input */}
              <div className="d-flex p-2 border-top bg-light">
                <input
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  className="form-control"
                  placeholder="Type message..."
                />
                <button className="btn btn-dark ms-2" onClick={sendMessage}>
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
