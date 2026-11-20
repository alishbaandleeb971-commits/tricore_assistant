(function () {
  if (window.__TRICORE_WIDGET_LOADED__) return;
  window.__TRICORE_WIDGET_LOADED__ = true;

  const scriptTag = document.currentScript || (function () {
    const scripts = document.getElementsByTagName("script");
    return scripts[scripts.length - 1];
  })();

  const baseUrl = scriptTag ? new URL(scriptTag.src).origin : "https://tricoredigitaltech.com";

  // Create floating container
  const container = document.createElement("div");
  container.id = "tricore-assistant-embed-root";
  container.style.position = "fixed";
  container.style.bottom = "20px";
  container.style.right = "20px";
  container.style.zIndex = "2147483647";
  document.body.appendChild(container);

  // Create isolated iframe
  const iframe = document.createElement("iframe");
  iframe.src = `${baseUrl}/widget-frame.html`;
  iframe.style.border = "none";
  iframe.style.width = "70px";
  iframe.style.height = "70px";
  iframe.style.transition = "all 0.3s ease";
  container.appendChild(iframe);

  // Listen for open/close messages from iframe
  window.addEventListener("message", function (event) {
    if (event.data && event.data.type === "tricore_widget_resize") {
      if (event.data.isOpen) {
        iframe.style.width = "380px";
        iframe.style.height = "560px";
      } else {
        iframe.style.width = "70px";
        iframe.style.height = "70px";
      }
    }
  });
})();
