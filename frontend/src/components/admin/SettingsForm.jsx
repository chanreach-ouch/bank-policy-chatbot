export default function SettingsForm({ settings, onChange, onSave, saving }) {
  const update = (key, value) => onChange({ ...settings, [key]: value });

  return (
    <form
      className="space-y-6"
      onSubmit={(event) => {
        event.preventDefault();
        onSave();
      }}
    >
      <section className="rounded-3xl border border-slate-200 bg-white p-5">
        <h3 className="text-lg font-semibold text-slate-900">Assistant Messaging</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
          <label className="space-y-2">
            <span className="text-sm text-slate-600">Bot Display Name</span>
            <input
              value={settings.bot_display_name || ""}
              onChange={(event) => update("bot_display_name", event.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5"
            />
          </label>
          <label className="space-y-2">
            <span className="text-sm text-slate-600">Widget Primary Color</span>
            <input
              value={settings.widget_primary_color || ""}
              onChange={(event) => update("widget_primary_color", event.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5"
            />
          </label>
          <label className="space-y-2 lg:col-span-2">
            <span className="text-sm text-slate-600">Welcome Message (English)</span>
            <textarea
              rows={3}
              value={settings.welcome_message_en || ""}
              onChange={(event) => update("welcome_message_en", event.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5"
            />
          </label>
          <label className="space-y-2 lg:col-span-2">
            <span className="text-sm text-slate-600">Welcome Message (Khmer)</span>
            <textarea
              rows={3}
              value={settings.welcome_message_km || ""}
              onChange={(event) => update("welcome_message_km", event.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5"
            />
          </label>
          <label className="space-y-2 lg:col-span-2">
            <span className="text-sm text-slate-600">Fallback Message (English)</span>
            <textarea
              rows={3}
              value={settings.fallback_message_en || ""}
              onChange={(event) => update("fallback_message_en", event.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5"
            />
          </label>
          <label className="space-y-2 lg:col-span-2">
            <span className="text-sm text-slate-600">Fallback Message (Khmer)</span>
            <textarea
              rows={3}
              value={settings.fallback_message_km || ""}
              onChange={(event) => update("fallback_message_km", event.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5"
            />
          </label>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-5">
        <h3 className="text-lg font-semibold text-slate-900">Behavior Configuration</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
          <label className="space-y-2">
            <span className="text-sm text-slate-600">Widget Position</span>
            <select
              value={settings.widget_position || "right"}
              onChange={(event) => update("widget_position", event.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5"
            >
              <option value="right">Bottom Right</option>
              <option value="left">Bottom Left</option>
            </select>
          </label>
          <label className="space-y-2">
            <span className="text-sm text-slate-600">Language Preference</span>
            <select
              value={settings.response_language_preference || "match_user"}
              onChange={(event) => update("response_language_preference", event.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5"
            >
              <option value="match_user">Match User Language</option>
              <option value="english_only">English Only</option>
              <option value="khmer_only">Khmer Only</option>
            </select>
          </label>
          <label className="inline-flex items-center gap-3 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={settings.bilingual_enabled === "true"}
              onChange={(event) => update("bilingual_enabled", event.target.checked ? "true" : "false")}
            />
            Enable bilingual mode
          </label>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-5">
        <h3 className="text-lg font-semibold text-slate-900">System Prompt</h3>
        <textarea
          rows={10}
          value={settings.system_prompt || ""}
          onChange={(event) => update("system_prompt", event.target.value)}
          className="w-full rounded-xl border border-slate-200 px-3 py-2.5 mt-3"
        />
      </section>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={saving}
          className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-semibold disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save Settings"}
        </button>
      </div>
    </form>
  );
}

