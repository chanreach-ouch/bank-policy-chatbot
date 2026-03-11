import { useEffect, useState } from "react";

import { api } from "../api/client";
import AdminHeader from "../components/admin/AdminHeader";
import SettingsForm from "../components/admin/SettingsForm";
import { useAuth } from "../context/AuthContext";

export default function SettingsPage() {
  const { token } = useAuth();
  const [settings, setSettings] = useState({});
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    async function load() {
      if (!token) return;
      const response = await api.getSettings(token);
      setSettings(response.settings || {});
    }
    load();
  }, [token]);

  async function handleSave() {
    if (!token) return;
    setSaving(true);
    setNotice("");
    try {
      const response = await api.updateSettings(token, settings);
      setSettings(response.settings || {});
      setNotice("Settings saved.");
    } catch (error) {
      setNotice(error.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-5">
      <AdminHeader title="Settings" subtitle="Configure welcome text, fallback behavior, prompt policy, and widget branding." />
      {notice ? <p className="text-sm text-slate-600">{notice}</p> : null}
      <SettingsForm settings={settings} onChange={setSettings} onSave={handleSave} saving={saving} />
    </div>
  );
}

