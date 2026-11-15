import { h, render } from "preact";

export function Widget() {
  return h("div", { class: "tricore-widget-container" }, "TriCore AI Assistant");
}

export function initWidget(container: HTMLElement) {
  render(h(Widget, null), container);
}
