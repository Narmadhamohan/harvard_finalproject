import React from "react";
import Sidebar from "../../../components/Sidebar";
import "../../../theme.css";

export default function Dashboard() {
  return (
    <div className="dashboard">
     {/* <Sidebar /> */}
      <main className="content">
        <h1>Welcome to Job Portal Dashboard</h1>
        <p>Select a section from the sidebar to continue.</p>
      </main>
    </div>
  );
}

// tod o: andle back in JobDetail.js