import React from "react";
import { createRoot } from "react-dom/client";

export function App() {
  return React.createElement("div", { className: "staff-app" }, "TriCore Staff Portal");
}

export function initStaffApp(container: HTMLElement) {
  const root = createRoot(container);
  root.render(React.createElement(App, null));
}
