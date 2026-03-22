import { useEffect, useRef, useState } from "react";
import { SignatureConfig, DEFAULT_CONFIG } from "./types";
import { loadFromUrl, syncToUrl } from "./utils/urlState";
import { Form } from "./components/Form";
import { Preview } from "./components/Preview";
import { TemplateBar } from "./components/TemplateBar";
import { ColorPanel } from "./components/ColorPanel";
import { ToastContainer } from "./components/Toast";

type Tab = "fields" | "style";

export function App() {
  const [config, setConfig] = useState<SignatureConfig>(() => loadFromUrl() ?? DEFAULT_CONFIG);
  const [tab, setTab] = useState<Tab>("fields");
  const syncTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function update(partial: Partial<SignatureConfig>) {
    setConfig((prev) => ({ ...prev, ...partial }));
  }

  // Debounced URL sync
  useEffect(() => {
    if (syncTimer.current) clearTimeout(syncTimer.current);
    syncTimer.current = setTimeout(() => syncToUrl(config), 400);
    return () => { if (syncTimer.current) clearTimeout(syncTimer.current); };
  }, [config]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">✍️</span>
          <div>
            <h1 className="text-lg font-bold text-gray-900 leading-none">Sigcraft</h1>
            <p className="text-xs text-gray-400 mt-0.5">Email signature generator</p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-xs text-gray-400">
          <span>No account · No data stored · Shareable by URL</span>
          <a
            href="https://github.com/heathriel/sigcraft"
            className="text-gray-400 hover:text-gray-600 transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub ↗
          </a>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 flex flex-col lg:flex-row gap-0 overflow-hidden">
        {/* Left panel — form */}
        <div className="w-full lg:w-[420px] flex-shrink-0 border-r border-gray-200 bg-white flex flex-col overflow-hidden">
          {/* Template picker */}
          <div className="px-6 py-4 border-b border-gray-100">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">Template</p>
            <TemplateBar selected={config.template} onChange={(t) => update({ template: t })} />
          </div>

          {/* Tab bar */}
          <div className="flex border-b border-gray-100">
            {(["fields", "style"] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
                  tab === t
                    ? "border-b-2 border-indigo-500 text-indigo-600"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                {t === "fields" ? "Your Info" : "Style & Logo"}
              </button>
            ))}
          </div>

          {/* Form / Style panel */}
          <div className="flex-1 overflow-y-auto px-6 py-5">
            {tab === "fields" ? (
              <Form config={config} onChange={update} />
            ) : (
              <ColorPanel config={config} onChange={update} />
            )}
          </div>

          {/* Outlook toggle at bottom */}
          <div className="px-6 py-4 border-t border-gray-100">
            <label className="flex items-center gap-3 cursor-pointer">
              <div
                onClick={() => update({ outlookMode: !config.outlookMode })}
                className={`relative w-10 h-5 rounded-full transition-colors ${
                  config.outlookMode ? "bg-orange-400" : "bg-gray-200"
                }`}
              >
                <div
                  className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                    config.outlookMode ? "translate-x-5" : ""
                  }`}
                />
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700">Outlook compatibility mode</span>
                <p className="text-xs text-gray-400">Strips styles Outlook doesn't support</p>
              </div>
            </label>
          </div>
        </div>

        {/* Right panel — preview */}
        <div className="flex-1 p-6 overflow-y-auto">
          <Preview
            config={config}
            onToggleOutlook={() => update({ outlookMode: !config.outlookMode })}
          />
        </div>
      </main>

      <ToastContainer />
    </div>
  );
}
