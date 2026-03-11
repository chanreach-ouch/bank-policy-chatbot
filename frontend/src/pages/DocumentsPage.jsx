import { useEffect, useState } from "react";

import { api } from "../api/client";
import AdminHeader from "../components/admin/AdminHeader";
import DocumentTable from "../components/admin/DocumentTable";
import UploadDropzone from "../components/admin/UploadDropzone";
import { useAuth } from "../context/AuthContext";

export default function DocumentsPage() {
  const { token } = useAuth();
  const [documents, setDocuments] = useState([]);
  const [search, setSearch] = useState("");
  const [uploading, setUploading] = useState(false);
  const [notice, setNotice] = useState("");
  const [uploadMeta, setUploadMeta] = useState({
    category: "General",
    version: "1.0",
    status: "draft",
  });

  async function loadDocuments(nextSearch = "") {
    if (!token) return;
    const rows = await api.listDocuments(token, nextSearch);
    setDocuments(rows);
  }

  useEffect(() => {
    loadDocuments();
  }, [token]);

  async function handleUpload(file) {
    if (!token) return;
    setUploading(true);
    setNotice("");
    try {
      await api.uploadDocument(token, { file, ...uploadMeta });
      setNotice("Document uploaded and indexed.");
      await loadDocuments(search);
    } catch (error) {
      setNotice(error.message);
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(id) {
    if (!token) return;
    await api.deleteDocument(token, id);
    await loadDocuments(search);
  }

  async function handleReindex(id) {
    if (!token) return;
    setNotice("Re-indexing document...");
    try {
      await api.reindexDocument(token, id);
      setNotice("Re-index completed.");
      await loadDocuments(search);
    } catch (error) {
      setNotice(error.message);
    }
  }

  async function handleToggle(id, isActive) {
    if (!token) return;
    await api.toggleDocument(token, id, isActive);
    await loadDocuments(search);
  }

  return (
    <div className="space-y-5">
      <AdminHeader
        title="Document Management"
        subtitle="Upload policy files, track indexing status, and control retrieval activation."
      />

      <section className="rounded-3xl border border-slate-200 bg-white p-5 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <label className="space-y-2">
            <span className="text-xs text-slate-500">Category</span>
            <input
              className="w-full rounded-xl border border-slate-200 px-3 py-2"
              value={uploadMeta.category}
              onChange={(event) => setUploadMeta((prev) => ({ ...prev, category: event.target.value }))}
            />
          </label>
          <label className="space-y-2">
            <span className="text-xs text-slate-500">Version</span>
            <input
              className="w-full rounded-xl border border-slate-200 px-3 py-2"
              value={uploadMeta.version}
              onChange={(event) => setUploadMeta((prev) => ({ ...prev, version: event.target.value }))}
            />
          </label>
          <label className="space-y-2">
            <span className="text-xs text-slate-500">Status</span>
            <select
              className="w-full rounded-xl border border-slate-200 px-3 py-2"
              value={uploadMeta.status}
              onChange={(event) => setUploadMeta((prev) => ({ ...prev, status: event.target.value }))}
            >
              <option value="draft">Draft</option>
              <option value="active">Active</option>
              <option value="archived">Archived</option>
            </select>
          </label>
          <label className="space-y-2">
            <span className="text-xs text-slate-500">Search documents</span>
            <div className="flex gap-2">
              <input
                className="w-full rounded-xl border border-slate-200 px-3 py-2"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
              <button
                type="button"
                onClick={() => loadDocuments(search)}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white text-sm"
              >
                Search
              </button>
            </div>
          </label>
        </div>

        <UploadDropzone onFileSelected={handleUpload} uploading={uploading} />
        {notice ? <p className="text-sm text-slate-600">{notice}</p> : null}
      </section>

      <DocumentTable documents={documents} onDelete={handleDelete} onReindex={handleReindex} onToggle={handleToggle} />
    </div>
  );
}

