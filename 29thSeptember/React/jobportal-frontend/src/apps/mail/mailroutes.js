import Inbox from "./pages/Inbox";
import SentMail from "./pages/SentMail";
import MailDetail from "./pages/MailDetail.js";
import ComposeMail from "./pages/ComposeMail";

export const mailRoutes = [
  {
    path: "/app/mail",
    element: <div />,  // wrapper if needed
    children: [
      { path: "inbox", element: <Inbox /> },
      { path: "sent", element: <SentMail /> },
      { path: "view/:id", element: <MailDetail /> },
      { path: "compose", element: <ComposeMail /> },
    ],
  },
];
