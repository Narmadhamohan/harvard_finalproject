import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../../context/AuthProvider";
import axiosClient from "../../../api/axiosClient";

export default function MessagesPage() {
  const { user } = useContext(AuthContext);
  const [allMessages, setAllMessages] = useState([]);
  const [chatUsers, setChatUsers] = useState([]);
  const [activeChatUser, setActiveChatUser] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [messageText, setMessageText] = useState("");

  const token = user?.accessToken;
  const API_BASE = "http://127.0.0.1:8000/api/mails";

const normalize = (msg) => ({
  id: msg.id,

  sender: {
    id: msg.sender?.id ?? msg.sender,
    username: msg.sender?.username ?? null,
    email: msg.sender?.email ?? null,
  },

  recipient: {
    id: msg.recipient?.id ?? msg.recipient ?? null,
    username: msg.recipient?.username ?? null,
    email: msg.recipient?.email ?? null,
  },

  content: msg.content || msg.body,
  timestamp: msg.timestamp,
});



  // --------------- LOAD ALL MESSAGES (inbox + sent) ----------------
  useEffect(() => {
    const load = async () => {
      try {
        const inboxRes = await axios.get(`${API_BASE}/?box=inbox`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const sentRes = await axios.get(`${API_BASE}/?box=sent`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const combinedInitial = [...inboxRes.data, ...sentRes.data];
        const combined = combinedInitial.map(normalize);
        setAllMessages(combined.map(normalize));

        // ---- Extract unique chat users ----
        const userMap = {};

        combined.forEach((msg) => {
          console.log("use id",user);

          console.log("unique check msg",msg);
          const partner =
            msg.sender.id === user.id ? msg.recipient : msg.sender;

          userMap[partner.id] = partner; // unique by ID
          console.log("is unique id? ",partner);
        });

        setChatUsers(Object.values(userMap));
      } catch (error) {
        console.error("Loading messages failed:", error);
      }
    };

    load();
  }, []);

  // --------------- OPEN CHAT ----------------
  const openChat = (targetUser) => {
    setActiveChatUser(targetUser);

    const conversation = allMessages.filter(
      (msg) =>
        msg.sender.id === targetUser.id ||
        msg.recipient.id === targetUser.id
    );

    const sorted = conversation.sort(
      (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
    );

    setChatMessages(sorted);
  };

  // --------------- SEND MESSAGE ----------------
  const sendMessage = async () => {
    if (!messageText.trim() || !activeChatUser) return;

    try {
      const res = await axiosClient.post(
        `${API_BASE}/`,
        {
          recipient: activeChatUser.id,
          recipient_email: activeChatUser.email,
          subject: "Internal Message",
          body: messageText,
        },
      );

      // Update UI
     const newMessage = normalize(res.data);
    newMessage.content = messageText;


      setChatMessages((prev) => [...prev, newMessage]);
      setAllMessages((prev) => [...prev, newMessage]);
      setMessageText("");
    } catch (error) {
      console.error("Send failed:", error.response?.data || error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div className="flex h-[80vh] bg-white rounded shadow-lg overflow-hidden">

      {/* LEFT PANE — Only chat users */}
      <div className="w-1/3 border-r overflow-y-auto bg-gray-100">
        <h2 className="p-3 font-semibold bg-blue-800 text-white">
          Chats
        </h2>

        {chatUsers.length === 0 && (
          <p className="px-3 py-5 text-gray-600 text-sm">
            No chat users yet
          </p>
        )}

        {chatUsers.map((partner) => (
          <div
            className="p-3 cursor-pointer hover:bg-gray-200 border-b"
            onClick={() => openChat(partner)}
          >
            <p className="font-semibold">{partner.username}</p>
          </div>
        ))}
      </div>

      {/* RIGHT PANE — Chat Window */}
      <div className="flex-1 flex flex-col">
        {!activeChatUser ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            Select a user to start chat
          </div>
        ) : (
          <>
            <div className="p-3 bg-blue-700 text-white font-semibold">
              Chat with {activeChatUser.username}
            </div>

            <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
              {chatMessages.map((msg) => {
                console.log("map msg: ",msg);
                return (
                <div
                  key={msg.id}
                  className={`mb-3 max-w-md p-2 rounded-lg ${
                    msg.sender.id === user.id
                      ? "bg-blue-200 ml-auto"
                      : "bg-gray-200"
                  }`}
                >
                  <p>{msg.content}</p>
                </div>
                );
})}
            </div>

            <div className="p-3 flex">
              <input
                type="text"
                placeholder="Type a message..."
                className="flex-1 border p-2 rounded"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                onKeyDown={handleKeyPress}
              />
              <button
                onClick={sendMessage}
                className="ml-2 bg-blue-600 text-white px-4 rounded"
              >
                Send
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
