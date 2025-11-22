import type { BlockCheckResult } from "../types";

// Prevent multiple initializations
let initialized = false;

export default defineContentScript({
  matches: ["<all_urls>"],
  main() {
    if (initialized) return;
    initialized = true;

    // Only check once when script loads
    checkAndBlockPage();

    // Listen for messages from background
    chrome.runtime.onMessage.addListener((message) => {
      if (message.type === "SHOW_BLOCK_SCREEN") {
        showBlockScreen(message.data);
      }
    });
  },
});

async function checkAndBlockPage() {
  // Don't check internal pages
  if (
    window.location.href.startsWith("chrome://") ||
    window.location.href.startsWith("chrome-extension://")
  ) {
    return;
  }

  try {
    const result: BlockCheckResult = await chrome.runtime.sendMessage({
      type: "CHECK_BLOCKED",
      url: window.location.href,
    });

    if (result.isBlocked && !result.hasActiveGrace) {
      showBlockScreen(result);
    } else if (
      result.isBlocked &&
      result.hasActiveGrace &&
      result.gracePeriod
    ) {
      // Show timer overlay instead of full block
      showTimerOverlay(result.gracePeriod);
    }
  } catch (error) {
    console.error("Error checking blocked status:", error);
  }
}

function showBlockScreen(data: BlockCheckResult) {
  // Check if overlay already exists
  const existing = document.getElementById("website-blocker-overlay");
  if (existing) return; // Don't create duplicate

  // Stop the page from loading further
  if (document.readyState === "loading") {
    window.stop();
  }

  // Create overlay
  const overlay = document.createElement("div");
  overlay.id = "website-blocker-overlay";
  overlay.innerHTML = `
    <style>
      #website-blocker-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        z-index: 2147483647;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      }
      
      .blocker-card {
        background: white;
        border-radius: 20px;
        padding: 48px;
        max-width: 500px;
        width: 90%;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        text-align: center;
      }
      
      .blocker-icon {
        font-size: 64px;
        margin-bottom: 24px;
      }
      
      .blocker-title {
        font-size: 28px;
        font-weight: 700;
        color: #1a202c;
        margin-bottom: 16px;
      }
      
      .blocker-message {
        font-size: 16px;
        color: #4a5568;
        margin-bottom: 32px;
        line-height: 1.6;
      }
      
      .blocker-url {
        background: #f7fafc;
        padding: 12px;
        border-radius: 8px;
        font-family: monospace;
        font-size: 14px;
        color: #2d3748;
        margin-bottom: 32px;
        word-break: break-all;
      }
      
      .blocker-buttons {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }
      
      .blocker-btn {
        padding: 14px 28px;
        border: none;
        border-radius: 10px;
        font-size: 16px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s;
      }
      
      .blocker-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
      
      .blocker-btn-primary {
        background: #667eea;
        color: white;
      }
      
      .blocker-btn-primary:hover:not(:disabled) {
        background: #5568d3;
        transform: translateY(-2px);
      }
      
      .blocker-btn-secondary {
        background: #e2e8f0;
        color: #2d3748;
      }
      
      .blocker-btn-secondary:hover {
        background: #cbd5e0;
      }
      
      .key-input-container {
        margin-top: 24px;
        display: none;
      }
      
      .key-input-container.active {
        display: block;
      }
      
      .blocker-input {
        width: 100%;
        padding: 14px;
        border: 2px solid #e2e8f0;
        border-radius: 10px;
        font-size: 16px;
        margin-bottom: 12px;
        text-align: center;
        text-transform: uppercase;
        letter-spacing: 2px;
        font-weight: 600;
      }
      
      .blocker-input:focus {
        outline: none;
        border-color: #667eea;
      }
      
      .error-message {
        color: #e53e3e;
        font-size: 14px;
        margin-top: 12px;
      }
      
      .grace-info {
        background: #fef5e7;
        border-left: 4px solid #f39c12;
        padding: 16px;
        border-radius: 8px;
        margin-bottom: 24px;
        text-align: left;
      }
      
      .grace-info-title {
        font-weight: 600;
        color: #d68910;
        margin-bottom: 8px;
      }
      
      .grace-key {
        font-family: monospace;
        background: white;
        padding: 8px 12px;
        border-radius: 6px;
        font-size: 18px;
        font-weight: 700;
        color: #667eea;
        letter-spacing: 2px;
        display: inline-block;
        margin-top: 8px;
      }
    </style>
    
    <div class="blocker-card">
      <div class="blocker-icon">🚫</div>
      <h1 class="blocker-title">Site Blocked</h1>
      <p class="blocker-message">
        This website has been blocked. You can request a grace period to access it temporarily.
      </p>
      <div class="blocker-url">${escapeHtml(window.location.href)}</div>
      
      <div id="grace-info-container"></div>
      
      <div class="blocker-buttons">
        <button class="blocker-btn blocker-btn-primary" id="request-grace-btn">
          Request Grace Period
        </button>
        <button class="blocker-btn blocker-btn-secondary" id="enter-key-btn">
          Enter Access Key
        </button>
        <button class="blocker-btn blocker-btn-secondary" id="go-back-btn">
          Go Back
        </button>
      </div>
      
      <div class="key-input-container" id="key-input-container">
        <input 
          type="text" 
          class="blocker-input" 
          id="key-input" 
          placeholder="XXXX-XXXX"
          maxlength="9"
        />
        <button class="blocker-btn blocker-btn-primary" id="verify-key-btn">
          Verify Key
        </button>
        <div class="error-message" id="error-message"></div>
      </div>
    </div>
  `;

  document.body.innerHTML = "";
  document.body.appendChild(overlay);

  // Event listeners
  document
    .getElementById("request-grace-btn")
    ?.addEventListener("click", requestGracePeriod);
  document
    .getElementById("enter-key-btn")
    ?.addEventListener("click", showKeyInput);
  document
    .getElementById("verify-key-btn")
    ?.addEventListener("click", verifyKey);
  document
    .getElementById("go-back-btn")
    ?.addEventListener("click", () => window.history.back());

  // Format key input
  const keyInput = document.getElementById("key-input") as HTMLInputElement;
  keyInput?.addEventListener("input", (e) => {
    const target = e.target as HTMLInputElement;
    let value = target.value.replace(/[^A-Z0-9]/gi, "").toUpperCase();
    if (value.length > 4) {
      value = value.slice(0, 4) + "-" + value.slice(4, 8);
    }
    target.value = value;
  });
}

async function requestGracePeriod() {
  const btn = document.getElementById("request-grace-btn") as HTMLButtonElement;
  const graceInfoContainer = document.getElementById("grace-info-container");
  const buttonsContainer = document.querySelector(
    ".blocker-buttons",
  ) as HTMLElement;

  btn.disabled = true;
  btn.textContent = "Requesting...";

  try {
    const response = await chrome.runtime.sendMessage({
      type: "REQUEST_GRACE_PERIOD",
      url: window.location.href,
    });

    if (response.success) {
      const duration = Math.ceil(response.gracePeriod.duration / 1000);
      const minutes = Math.floor(duration / 60);
      const seconds = duration % 60;
      const timeStr = minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;

      if (graceInfoContainer) {
        graceInfoContainer.innerHTML = `
          <div class="grace-info">
            <div class="grace-info-title">✓ Grace Period Granted!</div>
            <p style="margin: 8px 0; color: #6c757d; font-size: 14px;">
              Duration: ${timeStr}<br>
              <strong>Save this key - you'll need it!</strong>
            </p>
            <div class="grace-key">${response.gracePeriod.key}</div>
            <p style="margin-top: 12px; font-size: 13px; color: #6c757d;">
              Click the button below to unlock the site with this key.
            </p>
          </div>
        `;
      }

      // Replace buttons with unlock option
      if (buttonsContainer) {
        buttonsContainer.innerHTML = `
          <button class="blocker-btn blocker-btn-primary" id="unlock-now-btn">
            Unlock Site Now
          </button>
          <button class="blocker-btn blocker-btn-secondary" id="go-back-btn-2">
            Go Back
          </button>
        `;

        document
          .getElementById("unlock-now-btn")
          ?.addEventListener("click", () => {
            window.location.reload();
          });

        document
          .getElementById("go-back-btn-2")
          ?.addEventListener("click", () => {
            window.history.back();
          });
      }
    } else {
      const errorDiv = document.getElementById("error-message");
      if (errorDiv) {
        errorDiv.textContent =
          response.error || "Failed to request grace period";
      }
      btn.disabled = false;
      btn.textContent = "Request Grace Period";
    }
  } catch (error) {
    console.error("Error requesting grace period:", error);
    btn.disabled = false;
    btn.textContent = "Request Grace Period";
  }
}

function showKeyInput() {
  const container = document.getElementById("key-input-container");
  const errorDiv = document.getElementById("error-message");
  if (container) {
    container.classList.add("active");
  }
  if (errorDiv) {
    errorDiv.textContent = "";
  }
  document.getElementById("key-input")?.focus();
}

async function verifyKey() {
  const input = document.getElementById("key-input") as HTMLInputElement;
  const errorDiv = document.getElementById("error-message");
  const key = input.value.trim();

  if (!key || key.length < 8) {
    if (errorDiv) errorDiv.textContent = "Please enter a valid key";
    return;
  }

  const btn = document.getElementById("verify-key-btn") as HTMLButtonElement;
  btn.disabled = true;
  btn.textContent = "Verifying...";

  try {
    const response = await chrome.runtime.sendMessage({
      type: "VERIFY_KEY",
      key: key,
    });

    if (response.success) {
      if (errorDiv) {
        errorDiv.style.color = "#48bb78";
        errorDiv.textContent = "✓ Key verified! Reloading...";
      }
      // Reload the page to show the unlocked site with timer
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } else {
      if (errorDiv) {
        errorDiv.style.color = "#e53e3e";
        errorDiv.textContent = response.error || "Invalid or expired key";
      }
      btn.disabled = false;
      btn.textContent = "Verify Key";
    }
  } catch (error) {
    console.error("Error verifying key:", error);
    if (errorDiv) {
      errorDiv.style.color = "#e53e3e";
      errorDiv.textContent = "Error verifying key";
    }
    btn.disabled = false;
    btn.textContent = "Verify Key";
  }
}

function escapeHtml(text: string): string {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

function showTimerOverlay(gracePeriod: any) {
  // Remove existing timer if any
  const existing = document.getElementById("grace-timer-overlay");
  if (existing) existing.remove();

  const overlay = document.createElement("div");
  overlay.id = "grace-timer-overlay";
  overlay.innerHTML = `
    <style>
      #grace-timer-overlay {
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 16px 24px;
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        z-index: 2147483647;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        min-width: 200px;
        animation: slideIn 0.3s ease-out;
      }
      
      @keyframes slideIn {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
      
      .timer-title {
        font-size: 12px;
        text-transform: uppercase;
        letter-spacing: 1px;
        opacity: 0.9;
        margin-bottom: 8px;
      }
      
      .timer-display {
        font-size: 24px;
        font-weight: 700;
        font-variant-numeric: tabular-nums;
      }
      
      .timer-key {
        font-size: 11px;
        margin-top: 8px;
        opacity: 0.8;
        font-family: monospace;
      }
    </style>
    
    <div class="timer-title">⏱️ Grace Period Active</div>
    <div class="timer-display" id="timer-countdown">--:--</div>
    <div class="timer-key">Key: ${gracePeriod.key}</div>
  `;

  document.body.appendChild(overlay);

  // Update countdown every second
  const updateTimer = () => {
    const remaining = Math.max(0, gracePeriod.expiresAt - Date.now());
    const totalSeconds = Math.floor(remaining / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    const display = document.getElementById("timer-countdown");
    if (display) {
      display.textContent = `${minutes}:${String(seconds).padStart(2, "0")}`;
    }

    if (remaining <= 0) {
      // Grace period expired, reload to show block screen
      window.location.reload();
    }
  };

  updateTimer();
  const interval = setInterval(updateTimer, 1000);

  // Store interval ID so it can be cleared if needed
  (overlay as any).__timerInterval = interval;
}
