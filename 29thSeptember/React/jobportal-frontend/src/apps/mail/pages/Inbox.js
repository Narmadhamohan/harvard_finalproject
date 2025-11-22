import { useEffect, useState } from "react";
import { fetchInbox } from "../api/MailApi";
import { AuthProvider } from "../../../context/AuthContext";

export default function Inbox() {
  const token = localStorage.getItem("accessToken");
  const [mails, setMails] = useState([]);

  useEffect(() => {
    fetchInbox(token).then(res => setMails(res.data));
  }, [token]);

  return (
    <div>
      <h2>Inbox</h2>

      {mails.map(mail => (
        <div key={mail.id} className="card">
          <b>{mail.subject}</b>
          <p>From: {mail.sender_email}</p>
          <p>{mail.body}</p>
        </div>
      ))}
    </div>
  );
}
