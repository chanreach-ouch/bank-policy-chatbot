const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

async function request(path, options = {}) {
  const { method = "GET", token, body, formData } = options;
  const headers = {};
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  if (body && !formData) {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: formData || (body ? JSON.stringify(body) : undefined),
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.detail || "Request failed");
  }
  return payload;
}

export const api = {
  createSession(payload) {
    return request("/chat/session", { method: "POST", body: payload });
  },
  sendMessage(payload) {
    return request("/chat/message", { method: "POST", body: payload });
  },
  getWidgetConfig() {
    return request("/widget/config");
  },
  adminLogin(payload) {
    return request("/admin/login", { method: "POST", body: payload });
  },
  adminLogout(token) {
    return request("/admin/logout", { method: "POST", token });
  },
  listDocuments(token, search = "") {
    const query = search ? `?search=${encodeURIComponent(search)}` : "";
    return request(`/admin/documents${query}`, { token });
  },
  uploadDocument(token, payload) {
    const formData = new FormData();
    formData.append("file", payload.file);
    formData.append("category", payload.category || "");
    formData.append("version", payload.version || "1.0");
    formData.append("status_label", payload.status || "draft");
    return request("/admin/documents/upload", { method: "POST", token, formData });
  },
  deleteDocument(token, id) {
    return request(`/admin/documents/${id}`, { method: "DELETE", token });
  },
  reindexDocument(token, id) {
    return request(`/admin/documents/${id}/reindex`, { method: "POST", token });
  },
  toggleDocument(token, id, isActive) {
    return request(`/admin/documents/${id}/toggle`, {
      method: "PATCH",
      token,
      body: { is_active: isActive },
    });
  },
  listChats(token, params = {}) {
    const search = new URLSearchParams();
    if (params.search) search.append("search", params.search);
    if (params.language) search.append("language", params.language);
    if (params.limit) search.append("limit", String(params.limit));
    const query = search.toString() ? `?${search.toString()}` : "";
    return request(`/admin/chats${query}`, { token });
  },
  getAnalytics(token) {
    return request("/admin/analytics", { token });
  },
  getSettings(token) {
    return request("/admin/settings", { token });
  },
  updateSettings(token, settings) {
    return request("/admin/settings", { method: "PATCH", token, body: { settings } });
  },
  listAdminUsers(token) {
    return request("/admin/users", { token });
  },
  createAdminUser(token, payload) {
    return request("/admin/users", { method: "POST", token, body: payload });
  },
  updateAdminUser(token, id, payload) {
    return request(`/admin/users/${id}`, { method: "PATCH", token, body: payload });
  },
};

