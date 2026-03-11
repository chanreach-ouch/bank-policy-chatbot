(function () {
  var scriptTag = document.currentScript;
  var apiBase = (scriptTag && scriptTag.dataset.apiBase) || "http://localhost:8000/api";
  var position = (scriptTag && scriptTag.dataset.position) || "right";
  var root = document.createElement("div");
  root.className = "bpw-root " + (position === "left" ? "bpw-left" : "bpw-right");

  var panel = document.createElement("div");
  panel.className = "bpw-panel bpw-hidden";
  panel.innerHTML =
    '<div class="bpw-header">' +
    '<div><p class="bpw-title">Bank Policy Assistant</p><p class="bpw-subtitle">Khmer & English support</p></div>' +
    '<button class="bpw-close" type="button">✕</button>' +
    "</div>" +
    '<div class="bpw-body"></div>' +
    '<div class="bpw-actions"></div>' +
    '<div class="bpw-input-wrap">' +
    '<div class="bpw-row">' +
    '<input class="bpw-input" placeholder="Ask about loan, KYC, deposit..." />' +
    '<button class="bpw-send" type="button">Send</button>' +
    "</div>" +
    '<div class="bpw-footnote">Answers are based on available official policy documents.</div>' +
    "</div>";

  var button = document.createElement("button");
  button.className = "bpw-button";
  button.type = "button";
  button.textContent = "AI";

  root.appendChild(panel);
  root.appendChild(button);
  document.body.appendChild(root);

  var state = {
    sessionToken: null,
    primaryColor: "#059669",
    quickActions: ["Loan policy", "Account opening", "KYC requirements", "Card policy"],
    welcome: "Hello. Ask me about bank policy.",
  };

  function setThemeColor() {
    button.style.backgroundColor = state.primaryColor;
    panel.querySelector(".bpw-send").style.backgroundColor = state.primaryColor;
    panel.querySelectorAll(".bpw-message.user").forEach(function (el) {
      el.style.backgroundColor = state.primaryColor;
    });
  }

  function appendMessage(role, text) {
    var body = panel.querySelector(".bpw-body");
    var item = document.createElement("div");
    item.className = "bpw-message " + (role === "user" ? "user" : "bot");
    item.textContent = text;
    if (role === "user") {
      item.style.backgroundColor = state.primaryColor;
    }
    body.appendChild(item);
    body.scrollTop = body.scrollHeight;
  }

  function renderQuickActions() {
    var actions = panel.querySelector(".bpw-actions");
    actions.innerHTML = "";
    state.quickActions.slice(0, 4).forEach(function (label) {
      var chip = document.createElement("button");
      chip.type = "button";
      chip.className = "bpw-chip";
      chip.textContent = label;
      chip.addEventListener("click", function () {
        sendMessage(label);
      });
      actions.appendChild(chip);
    });
  }

  async function initConfig() {
    try {
      var configRes = await fetch(apiBase + "/widget/config");
      var configData = await configRes.json();
      state.primaryColor = configData.widget_primary_color || state.primaryColor;
      state.quickActions = configData.quick_actions || state.quickActions;
      state.welcome = configData.welcome_message_en || state.welcome;
      if (configData.bot_display_name) {
        panel.querySelector(".bpw-title").textContent = configData.bot_display_name;
      }
      setThemeColor();
      renderQuickActions();
    } catch (e) {}
  }

  async function initSession() {
    try {
      var sessionRes = await fetch(apiBase + "/chat/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ channel: "embed_widget", language_hint: "en" }),
      });
      var sessionData = await sessionRes.json();
      state.sessionToken = sessionData.session_token;
      appendMessage("bot", sessionData.welcome_message || state.welcome);
    } catch (e) {
      appendMessage("bot", state.welcome);
    }
  }

  async function sendMessage(text) {
    var content = (text || "").trim();
    if (!content) return;
    appendMessage("user", content);
    panel.querySelector(".bpw-input").value = "";

    try {
      var chatRes = await fetch(apiBase + "/chat/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_token: state.sessionToken,
          message: content,
          channel: "embed_widget",
        }),
      });
      var chatData = await chatRes.json();
      if (chatData.session_token) state.sessionToken = chatData.session_token;
      appendMessage("bot", chatData.answer || "No answer returned.");
    } catch (e) {
      appendMessage("bot", "I could not process your request right now. Please try again.");
    }
  }

  panel.querySelector(".bpw-close").addEventListener("click", function () {
    panel.classList.add("bpw-hidden");
  });
  button.addEventListener("click", function () {
    panel.classList.toggle("bpw-hidden");
  });
  panel.querySelector(".bpw-send").addEventListener("click", function () {
    sendMessage(panel.querySelector(".bpw-input").value);
  });
  panel.querySelector(".bpw-input").addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      sendMessage(event.target.value);
    }
  });

  initConfig().then(initSession);
})();

