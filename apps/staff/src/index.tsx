import React from "react";
import { createRoot } from "react-dom/client";
import { StaffApp } from "./StaffApp.js";

export function initStaffApp(container: HTMLElement) {
  const root = createRoot(container);
  root.render(React.createElement(StaffApp, null));
}

if (typeof document !== "undefined") {
  const root = document.getElementById("tricore-staff-root");
  if (root) {
    initStaffApp(root);
  }
}
