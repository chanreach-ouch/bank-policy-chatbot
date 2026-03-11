import { UploadCloud } from "lucide-react";
import { useRef } from "react";

export default function UploadDropzone({ onFileSelected, uploading }) {
  const inputRef = useRef(null);

  return (
    <div className="rounded-3xl border-2 border-dashed border-slate-300 bg-slate-50 p-6 text-center">
      <div className="w-14 h-14 rounded-2xl bg-emerald-100 mx-auto flex items-center justify-center">
        <UploadCloud className="w-6 h-6 text-emerald-700" />
      </div>
      <h3 className="text-lg font-semibold text-slate-900 mt-4">Upload Policy Files</h3>
      <p className="text-sm text-slate-500 mt-2">
        PDF, DOC, DOCX, JSON, TXT supported. Maximum file size depends on backend settings.
      </p>
      <div className="mt-5 flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="px-4 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-semibold disabled:opacity-60"
        >
          {uploading ? "Uploading..." : "Choose File"}
        </button>
        <span className="text-xs text-slate-400">or drag and drop (click upload for MVP)</span>
      </div>
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) onFileSelected(file);
          event.target.value = "";
        }}
      />
    </div>
  );
}

