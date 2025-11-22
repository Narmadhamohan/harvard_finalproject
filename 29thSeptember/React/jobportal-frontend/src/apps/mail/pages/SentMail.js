import { useEffect, useState } from "react";
import { fetchSent } from "../api/MailApi";
import { AuthProvider } from "../../../context/AuthContext";

export default function SentMail() {
  const token = localStorage.getItem("accessToken");
  const [mails, setMails] = useState([]);

  useEffect(() => {
    fetchSent(token).then(res => setMails(res.data));
  }, [token]);

  return (
    <div>
      <h2>Sent Mail</h2>

      {mails.map(mail => (
        <div key={mail.id} className="card">
          <b>{mail.subject}</b>
          <p>To: {mail.recipient_email}</p>
          <p>{mail.body}</p>
        </div>
      ))}
    </div>
  );
}
