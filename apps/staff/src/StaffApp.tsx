import React, { useState } from "react";

export type StaffScreen = "dashboard" | "leads" | "knowledge" | "liveChat" | "reviews";

export function StaffApp() {
  const [currentScreen, setCurrentScreen] = useState<StaffScreen>("dashboard");
  const [user] = useState({
    email: "admin@tricoredigitaltech.com",
    role: "admin"
  });

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "sans-serif" }}>
      {/* Sidebar Navigation */}
      <aside
        style={{
          width: "240px",
          backgroundColor: "#001a40",
          color: "#ffffff",
          display: "flex",
          flexDirection: "column"
        }}
      >
        <div style={{ padding: "20px", borderBottom: "1px solid #002866" }}>
          <h2 style={{ margin: 0, fontSize: "1.1rem" }}>TriCore Staff Hub</h2>
          <div style={{ fontSize: "0.8rem", color: "#8ab4f8", marginTop: "4px" }}>
            {user.email} ({user.role})
          </div>
        </div>

        <nav style={{ flex: 1, padding: "12px 0" }}>
          {[
            { id: "dashboard", label: "📊 Performance Dashboard" },
            { id: "leads", label: "👥 Leads Management" },
            { id: "knowledge", label: "📚 Knowledge Base" },
            { id: "liveChat", label: "💬 Live Handover Console" },
            { id: "reviews", label: "📝 Weekly Reviews" }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentScreen(item.id as StaffScreen)}
              style={{
                width: "100%",
                padding: "12px 20px",
                textAlign: "left",
                backgroundColor: currentScreen === item.id ? "#0030a0" : "transparent",
                color: "#ffffff",
                border: "none",
                cursor: "pointer",
                fontSize: "0.95rem"
              }}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main style={{ flex: 1, backgroundColor: "#f8fafc", padding: "24px", overflowY: "auto" }}>
        <header style={{ marginBottom: "24px", borderBottom: "1px solid #e2e8f0", paddingBottom: "12px" }}>
          <h1 style={{ margin: 0, textTransform: "capitalize" }}>{currentScreen}</h1>
        </header>

        <section id="screen-content">
          {currentScreen === "dashboard" && <div>8-Metric Performance Dashboard overview.</div>}
          {currentScreen === "leads" && <div>Leads table and CSV export.</div>}
          {currentScreen === "knowledge" && <div>Knowledge entry drafting and release control.</div>}
          {currentScreen === "liveChat" && <div>Real-time visitor handover queue.</div>}
          {currentScreen === "reviews" && <div>Weekly 20-chat quality audit.</div>}
        </section>
      </main>
    </div>
  );
}
