import { render } from "preact";
import { WidgetApp } from "./WidgetApp.js";

export function initWidget(container: HTMLElement) {
  render(<WidgetApp />, container);
}

if (typeof document !== "undefined") {
  const root = document.getElementById("tricore-widget-container");
  if (root) {
    initWidget(root);
  }
}
