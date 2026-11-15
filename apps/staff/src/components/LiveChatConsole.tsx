import React, { useState } from "react";

export interface HandoverItem {
  id: string;
  visitorName: string;
  requestedAt: number;
  status: "pending" | "accepted";
}

export function LiveChatConsole() {
  const [handovers, setHandovers] = useState<HandoverItem[]>([
    { id: "ho-1", visitorName: "Hamza Khan", requestedAt: Date.now() - 30000, status: "pending" }
  ]);
  const [activeHandover, setActiveHandover] = useState<HandoverItem | null>(null);
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>([
    { sender: "visitor", text: "Hello, I need custom AI chatbot development." }
  ]);
  const [replyText, setReplyText] = useState("");

  const acceptHandover = (ho: HandoverItem) => {
    setActiveHandover(ho);
    setHandovers((prev) => prev.map((h) => (h.id === ho.id ? { ...h, status: "accepted" } : h)));
  };

  const sendReply = () => {
    if (!replyText.trim()) return;
    setMessages((prev) => [...prev, { sender: "staff", text: replyText.trim() }]);
    setReplyText("");
  };

  return (
    <div style={{ display: "flex", gap: "20px", height: "500px" }}>
      {/* Handover Queue */}
      <div style={{ width: "300px", borderRight: "1px solid #e2e8f0", paddingRight: "16px" }}>
        <h3>Waiting Handover Queue</h3>
        {handovers.length === 0 ? (
          <div>No waiting visitors.</div>
        ) : (
          handovers.map((h) => (
            <div
              key={h.id}
              style={{
                padding: "12px",
                borderRadius: "8px",
                backgroundColor: h.status === "pending" ? "#fef3c7" : "#e0f2fe",
                marginBottom: "8px"
              }}
            >
              <div style={{ fontWeight: "bold" }}>{h.visitorName}</div>
              <div style={{ fontSize: "0.8rem", color: "#64748b" }}>Status: {h.status}</div>
              {h.status === "pending" && (
                <button
                  onClick={() => acceptHandover(h)}
                  style={{
                    marginTop: "8px",
                    backgroundColor: "#00A0F0",
                    color: "#fff",
                    border: "none",
                    padding: "6px 12px",
                    borderRadius: "4px",
                    cursor: "pointer"
                  }}
                >
                  Accept Chat
                </button>
              )}
            </div>
          ))
        )}
      </div>

      {/* Active Conversation Console */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <h3>{activeHandover ? `Chat with ${activeHandover.visitorName}` : "Select a visitor to chat"}</h3>
        <div style={{ flex: 1, border: "1px solid #cbd5e1", borderRadius: "8px", padding: "12px", overflowY: "auto" }}>
          {messages.map((m, idx) => (
            <div key={idx} style={{ textAlign: m.sender === "staff" ? "right" : "left", margin: "6px 0" }}>
              <span
                style={{
                  display: "inline-block",
                  padding: "8px 12px",
                  borderRadius: "12px",
                  backgroundColor: m.sender === "staff" ? "#0030a0" : "#f1f5f9",
                  color: m.sender === "staff" ? "#ffffff" : "#000000"
                }}
              >
                {m.text}
              </span>
            </div>
          ))}
        </div>

        {activeHandover && (
          <div style={{ display: "flex", marginTop: "12px" }}>
            <input
              type="text"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendReply()}
              placeholder="Type your reply..."
              style={{ flex: 1, padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
            />
            <button
              onClick={sendReply}
              style={{
                marginLeft: "8px",
                backgroundColor: "#00A0F0",
                color: "#ffffff",
                border: "none",
                borderRadius: "4px",
                padding: "8px 16px",
                cursor: "pointer"
              }}
            >
              Reply
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
