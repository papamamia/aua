// Put common UX fixes here. This runs before the first layout.

runOnStartup(async (runtime) => {
  // Подписываемся до старта проекта (до первого layout).
  runtime.addEventListener("beforeprojectstart", () => {
    installCommonFixes();
  });
});

function installCommonFixes() {
  // Защита от повторной установки (на перезагрузках/рестартах)
  if (window.__cgFixesInstalled) return;
  window.__cgFixesInstalled = true;

  // --- Disable unwanted page scroll (wheel/touch) ---
  const prevent = (e) => e.preventDefault();
  window.addEventListener("wheel", prevent, { passive: false });
  window.addEventListener("touchmove", prevent, { passive: false });

  // --- Disable unwanted key events & spacebar scrolling ---
  const blockKeys = new Set([
    "ArrowUp","ArrowDown","ArrowLeft","ArrowRight",
    " ","Spacebar", // пробел — новое и старое имя
    "PageUp","PageDown","Home","End"
  ]);
  window.addEventListener("keydown", (e) => {
    if (blockKeys.has(e.key)) e.preventDefault();
  }, { capture: true });

  // --- Samsung WebView visibility fix ---
  document.addEventListener("visibilitychange", () => {
    const app = window?.application;
    if (!app?.publishEvent) return;
    if (document.visibilityState === "hidden") {
      app.publishEvent("OnWebDocumentPause", "True");
    } else if (document.visibilityState === "visible") {
      app.publishEvent("OnWebDocumentPause", "False");
    }
  });

  // --- Disable context menu outside canvas ---
  document.addEventListener("contextmenu", (e) => e.preventDefault());

  // Небольшой CSS-хелп (не обязателен, но полезен)
  try {
    const style = document.createElement("style");
    style.textContent = `
      html, body { height: 100%; overflow: hidden; overscroll-behavior: none; }
    `;
    document.head.appendChild(style);
  } catch {}
}
