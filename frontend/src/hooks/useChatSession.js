import { useEffect, useState } from "react";

import { api } from "../api/client";

function detectLanguageHint() {
  if (typeof navigator === "undefined") return "en";
  return navigator.language?.toLowerCase().startsWith("km") ? "km" : "en";
}

export function useChatSession() {
  const [sessionToken, setSessionToken] = useState(null);
  const [config, setConfig] = useState(null);
  const [languageHint] = useState(detectLanguageHint);

  useEffect(() => {
    let mounted = true;
    async function init() {
      try {
        const widgetConfig = await api.getWidgetConfig();
        const session = await api.createSession({ channel: "web_widget", language_hint: languageHint });
        if (!mounted) return;
        setConfig(widgetConfig);
        setSessionToken(session.session_token);
      } catch (error) {
        if (!mounted) return;
        setConfig(null);
      }
    }
    init();
    return () => {
      mounted = false;
    };
  }, [languageHint]);

  return { sessionToken, setSessionToken, config, languageHint };
}
