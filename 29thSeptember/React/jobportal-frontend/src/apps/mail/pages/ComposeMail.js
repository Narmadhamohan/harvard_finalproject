import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { sendMail } from "../api/MailApi";
import { AuthProvider } from "../../../context/AuthContext";

export default function ComposeMail() {
  const { email } = useParams();
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const { token } = AuthProvider();
  const navigate = useNavigate();

  const handleSend = async () => {
    await sendMail(
      {
        recipient_email: email,
        subject,
        body,
      },
      token
    );
    navigate("/mail/sent");
  };

  return (
    <div>
      <h2>Compose Mail</h2>

      <p>To: {email}</p>

      <input
        placeholder="Subject"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
      />

      <textarea
        placeholder="Body"
        value={body}
        onChange={(e) => setBody(e.target.value)}
      />

      <button onClick={handleSend}>Send</button>
    </div>
  );
}
