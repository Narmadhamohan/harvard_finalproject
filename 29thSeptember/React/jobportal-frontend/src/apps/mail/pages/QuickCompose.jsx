import { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../../context/AuthProvider";

export default function QuickCompose({ receiverId, receiverEmail, onSent }) {
  const { user } = useContext(AuthContext);
  const [text, setText] = useState("");
  const API = "http://127.0.0.1:8000/api/mails/";

  const send = async () => {
    if (!text.trim()) return;

    try {
      console.log("          recipient: receiverId text: ",text, " ",receiverId, "receiverEmail",receiverEmail);
      await axios.post(
        API,
        {
          recipient: receiverId,
          recipient_email: receiverEmail,
          subject: "Internal Message",
          body: text,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.accessToken}`,
          },
        }
      );

      setText("");
      if (onSent) onSent();
    } catch (e) {
      console.error("Send failed:", e.response?.data || e);
    }
  };

  return (
    <div className="p-3 border rounded bg-gray-50">
      <textarea
        className="w-full p-2 border rounded"
        placeholder="Type your message…"
        rows={3}
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <button
        className="mt-2 bg-blue-600 text-white px-4 py-1 rounded"
        onClick={send}
      >
        Send
      </button>
    </div>
  );
}
