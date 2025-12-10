import React, { useState } from "react";
import { sendMail } from "../api/MailApi";

function ComposeMail({ receiverId, receiverName, onSent }) {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const token = localStorage.getItem("accessToken");

  const handleSend = async () => {
    if (!subject || !message) {
      alert("Please enter subject and message.");
      return;
    }

    try {
      const data = {
        receiver: receiverId,
        subject,
        message,
      };

      await sendMail(data, token);

      alert("Message sent successfully!");

      setSubject("");
      setMessage("");

      if (onSent) onSent();  // Hide the form after sending
    } catch (error) {
      console.log(error);
      alert("Error sending message.");
    }
  };

  return (
    <div className="p-4 border rounded bg-gray-50">
      <h3 className="font-semibold mb-3">Send Message to {receiverName}</h3>

      <input
        type="text"
        className="border p-2 w-full mb-2"
        placeholder="Subject"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
      />

      <textarea
        className="border p-2 w-full mb-2"
        rows="4"
        placeholder="Write your message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      ></textarea>

      <button
        onClick={handleSend}
        className="px-4 py-2 bg-green-600 text-white rounded"
      >
        Send
      </button>
    </div>
  );
}

export default ComposeMail;
