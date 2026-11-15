import { useState, useEffect } from "preact/hooks";

export interface MessageItem {
  id: string;
  sender: "visitor" | "assistant" | "system";
  text: string;
}

export function WidgetApp() {
  const [messages, setMessages] = useState<MessageItem[]>([
    {
      id: "init",
      sender: "assistant",
      text: "Hello! Welcome to TriCore Digital Tech. How can I assist your business today?"
    }
  ]);
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize live session on mount
  useEffect(() => {
    async function initSession() {
      try {
        const res = await fetch("/api/v1/public/sessions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: "widget-client-token" })
        });
        if (res.ok) {
          const data = (await res.json()) as { sessionId: string; greeting?: string };
          setSessionId(data.sessionId);
          if (data.greeting) {
            setMessages([
              {
                id: "init",
                sender: "assistant",
                text: data.greeting
              }
            ]);
          }
        }
      } catch (err) {
        console.error("Failed to init session:", err);
      }
    }
    initSession();
  }, []);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userText = input.trim();
    setInput("");
    const visitorMsgId = String(Date.now());
    setMessages((prev) => [...prev, { id: visitorMsgId, sender: "visitor", text: userText }]);
    setIsLoading(true);

    try {
      let activeSessionId = sessionId;
      if (!activeSessionId) {
        const initRes = await fetch("/api/v1/public/sessions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: "widget-client-token" })
        });
        const initData = (await initRes.json()) as { sessionId: string };
        activeSessionId = initData.sessionId;
        setSessionId(activeSessionId);
      }

      const res = await fetch(`/api/v1/public/sessions/${activeSessionId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: userText })
      });

      if (res.ok) {
        const data = (await res.json()) as { reply: string; messageId?: string };
        setMessages((prev) => [
          ...prev,
          {
            id: data.messageId || String(Date.now() + 1),
            sender: "assistant",
            text: data.reply
          }
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: String(Date.now() + 1),
            sender: "system",
            text: "Sorry, we could not deliver your message. Please try again."
          }
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: String(Date.now() + 1),
          sender: "system",
          text: "Connection error. Please check your internet connection."
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="tricore-widget-root">
      {!isOpen ? (
        <button
          className="tricore-launch-btn"
          style={{
            backgroundColor: "#00A0F0",
            color: "#ffffff",
            padding: "12px 20px",
            borderRadius: "24px",
            border: "none",
            cursor: "pointer"
          }}
          onClick={() => setIsOpen(true)}
        >
          Chat with Us
        </button>
      ) : (
        <div
          className="tricore-chat-window"
          style={{
            width: "350px",
            height: "500px",
            backgroundColor: "#ffffff",
            boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
            borderRadius: "12px",
            display: "flex",
            flexDirection: "column"
          }}
        >
          <div
            className="tricore-chat-header"
            style={{
              backgroundColor: "#0030A0",
              color: "#ffffff",
              padding: "12px",
              display: "flex",
              justifyContent: "space-between"
            }}
          >
            <span>TriCore AI Assistant</span>
            <button
              onClick={() => setIsOpen(false)}
              style={{ background: "transparent", border: "none", color: "#fff", cursor: "pointer" }}
            >
              ✕
            </button>
          </div>

          <div className="tricore-chat-messages" style={{ flex: 1, padding: "12px", overflowY: "auto" }}>
            {messages.map((m) => (
              <div
                key={m.id}
                style={{
                  textAlign: m.sender === "visitor" ? "right" : "left",
                  margin: "8px 0"
                }}
              >
                <span
                  style={{
                    display: "inline-block",
                    padding: "8px 12px",
                    borderRadius: "12px",
                    backgroundColor: m.sender === "visitor" ? "#00A0F0" : "#f0f2f5",
                    color: m.sender === "visitor" ? "#ffffff" : "#000000"
                  }}
                >
                  {m.text}
                </span>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", padding: "10px", borderTop: "1px solid #eee" }}>
            <input
              type="text"
              value={input}
              onInput={(e) => setInput((e.target as HTMLInputElement).value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Ask a question..."
              style={{ flex: 1, padding: "8px", borderRadius: "6px", border: "1px solid #ccc" }}
            />
            <button
              onClick={sendMessage}
              style={{
                marginLeft: "8px",
                backgroundColor: "#00A0F0",
                color: "#ffffff",
                border: "none",
                borderRadius: "6px",
                padding: "8px 12px",
                cursor: "pointer"
              }}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
