import { useState, useEffect } from "preact/hooks";

export interface ButtonOption {
  label: string;
  value: string;
}

export interface LeadConfirmCard {
  name: string;
  email: string;
  service: string;
  phone?: string;
  currency?: string;
  description?: string;
}

export interface MessageItem {
  id: string;
  sender: "visitor" | "assistant" | "system";
  text: string;
  buttons?: ButtonOption[];
  confirmCard?: LeadConfirmCard;
}

// Generate a unique Turnstile-compatible token per page load.
function generateClientToken(): string {
  const bytes = new Uint8Array(24);
  crypto.getRandomValues(bytes);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

const CLIENT_TOKEN = generateClientToken();

// SDD §3.1 / FR-010 offline card text
const OFFLINE_CARD_TEXT =
  "Our chat assistant is temporarily unavailable. Please email us at Info@tricoredigitaltech.com and we'll get back to you as soon as possible.";

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
  const [isOffline, setIsOffline] = useState(false);

  // Initialize live session on mount — retries once on failure (SDD §3.1, FR-010)
  useEffect(() => {
    async function initSession(attempt = 1): Promise<void> {
      try {
        const res = await fetch("/api/v1/public/sessions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: CLIENT_TOKEN })
        });
        if (res.ok) {
          const data = (await res.json()) as { sessionId: string; greeting?: string; quickButtons?: ButtonOption[] };
          setSessionId(data.sessionId);
          if (data.greeting) {
            setMessages([
              {
                id: "init",
                sender: "assistant",
                text: data.greeting,
                buttons: data.quickButtons
              }
            ]);
          }
        } else if (attempt < 2) {
          await new Promise((r) => setTimeout(r, 1200));
          return initSession(2);
        } else {
          setIsOffline(true);
        }
      } catch {
        if (attempt < 2) {
          await new Promise((r) => setTimeout(r, 1200));
          return initSession(2);
        }
        setIsOffline(true);
      }
    }
    initSession();
  }, []);

  const sendUserMessage = async (rawText: string) => {
    if (!rawText.trim() || isLoading || isOffline) return;

    const userText = rawText.trim();
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
          body: JSON.stringify({ token: CLIENT_TOKEN })
        });
        if (!initRes.ok) {
          setIsOffline(true);
          setIsLoading(false);
          return;
        }
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
        const data = (await res.json()) as {
          reply: string;
          messageId?: string;
          buttons?: ButtonOption[];
          confirmCard?: LeadConfirmCard;
        };
        setMessages((prev) => [
          ...prev,
          {
            id: data.messageId || String(Date.now() + 1),
            sender: "assistant",
            text: data.reply,
            buttons: data.buttons,
            confirmCard: data.confirmCard
          }
        ]);
      } else if (res.status >= 500) {
        setIsOffline(true);
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
      setIsOffline(true);
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

          {isOffline ? (
            <div
              className="tricore-offline-card"
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "24px",
                textAlign: "center",
                gap: "12px"
              }}
            >
              <span style={{ fontSize: "32px" }}>📧</span>
              <strong style={{ color: "#0030A0" }}>Chat Temporarily Unavailable</strong>
              <p style={{ color: "#444", margin: 0, lineHeight: "1.5" }}>{OFFLINE_CARD_TEXT}</p>
              <a
                href="mailto:Info@tricoredigitaltech.com"
                style={{
                  backgroundColor: "#00A0F0",
                  color: "#ffffff",
                  padding: "10px 20px",
                  borderRadius: "6px",
                  textDecoration: "none",
                  fontWeight: "bold"
                }}
              >
                Email Us
              </a>
            </div>
          ) : (
            <>
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
                        color: m.sender === "visitor" ? "#ffffff" : "#000000",
                        whiteSpace: "pre-wrap",
                        textAlign: "left"
                      }}
                    >
                      {m.text}
                    </span>

                    {/* Confirmation Recap Card */}
                    {m.confirmCard && (
                      <div
                        style={{
                          marginTop: "8px",
                          padding: "10px",
                          backgroundColor: "#f9fbfd",
                          border: "1px solid #cce5ff",
                          borderRadius: "8px",
                          fontSize: "13px",
                          textAlign: "left"
                        }}
                      >
                        <div style={{ fontWeight: "bold", color: "#0030A0", marginBottom: "4px" }}>
                          📋 Details Summary
                        </div>
                        <div><strong>Name:</strong> {m.confirmCard.name}</div>
                        <div><strong>Email:</strong> {m.confirmCard.email}</div>
                        <div><strong>Service:</strong> {m.confirmCard.service}</div>
                        {m.confirmCard.phone && <div><strong>Phone:</strong> {m.confirmCard.phone}</div>}
                        {m.confirmCard.currency && <div><strong>Currency:</strong> {m.confirmCard.currency}</div>}
                        {m.confirmCard.description && <div><strong>Notes:</strong> {m.confirmCard.description}</div>}
                      </div>
                    )}

                    {/* Interactive Action Buttons */}
                    {m.buttons && m.buttons.length > 0 && (
                      <div
                        style={{
                          marginTop: "8px",
                          display: "flex",
                          flexWrap: "wrap",
                          gap: "6px",
                          justifyContent: "flex-start"
                        }}
                      >
                        {m.buttons.map((btn) => (
                          <button
                            key={btn.value}
                            onClick={() => sendUserMessage(btn.value)}
                            disabled={isLoading}
                            style={{
                              backgroundColor: "#ffffff",
                              color: "#0030A0",
                              border: "1px solid #00A0F0",
                              borderRadius: "16px",
                              padding: "6px 12px",
                              fontSize: "12px",
                              cursor: isLoading ? "default" : "pointer",
                              transition: "background-color 0.2s"
                            }}
                          >
                            {btn.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                {isLoading && (
                  <div style={{ textAlign: "left", margin: "8px 0", color: "#888" }}>
                    <span>…</span>
                  </div>
                )}
              </div>

              <div style={{ display: "flex", padding: "10px", borderTop: "1px solid #eee" }}>
                <input
                  type="text"
                  value={input}
                  onInput={(e) => setInput((e.target as HTMLInputElement).value)}
                  onKeyDown={(e) => e.key === "Enter" && sendUserMessage(input)}
                  placeholder="Ask a question..."
                  style={{ flex: 1, padding: "8px", borderRadius: "6px", border: "1px solid #ccc" }}
                />
                <button
                  onClick={() => sendUserMessage(input)}
                  disabled={isLoading}
                  style={{
                    marginLeft: "8px",
                    backgroundColor: "#00A0F0",
                    color: "#ffffff",
                    border: "none",
                    borderRadius: "6px",
                    padding: "8px 12px",
                    cursor: isLoading ? "default" : "pointer",
                    opacity: isLoading ? 0.6 : 1
                  }}
                >
                  Send
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
