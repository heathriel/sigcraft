import { useRef } from "react";
import { SignatureConfig } from "../types";
import { renderTemplate } from "../templates";
import { copySignatureHtml, copyHtmlSource } from "../utils/clipboard";
import { buildShareUrl } from "../utils/urlState";
import { toast } from "./Toast";

interface Props {
  config: SignatureConfig;
  onToggleOutlook: () => void;
}

export function Preview({ config, onToggleOutlook }: Props) {
  const sigRef = useRef<HTMLDivElement>(null);
  const html = renderTemplate(config);

  async function handleCopySignature() {
    if (!sigRef.current) return;
    const result = await copySignatureHtml(sigRef.current);
    if (result.ok) {
      toast("Signature copied — paste directly into Gmail or Outlook", "success");
    } else {
      toast("Copy failed — try selecting and copying manually", "error");
    }
  }

  async function handleCopySource() {
    const result = await copyHtmlSource(html);
    if (result.ok) {
      toast("HTML source copied", "success");
    } else {
      toast("Could not copy source", "error");
    }
  }

  async function handleShare() {
    const url = buildShareUrl(config);
    try {
      await navigator.clipboard.writeText(url);
      toast("Share link copied to clipboard", "info");
    } catch {
      toast("Could not copy link — check your clipboard permissions", "error");
    }
  }

  function handleDownload() {
    const blob = new Blob([html], { type: "text/html" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "signature.html";
    a.click();
    URL.revokeObjectURL(a.href);
    toast("signature.html downloaded", "success");
  }

  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Preview card */}
      <div className="flex-1 rounded-xl border border-gray-200 bg-white overflow-auto">
        {/* Fake email header bar */}
        <div className="border-b border-gray-100 px-5 py-3 flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-400" />
            <div className="w-3 h-3 rounded-full bg-yellow-400" />
            <div className="w-3 h-3 rounded-full bg-green-400" />
          </div>
          <span className="text-xs text-gray-400 ml-2">
            {config.outlookMode ? "Outlook mode — stripped styles" : "Preview — modern email clients"}
          </span>
          <button
            onClick={onToggleOutlook}
            className={`ml-auto text-xs px-2.5 py-1 rounded-full border transition-colors font-medium ${
              config.outlookMode
                ? "border-orange-400 text-orange-600 bg-orange-50"
                : "border-gray-200 text-gray-400 hover:border-gray-300"
            }`}
          >
            {config.outlookMode ? "Outlook" : "Switch to Outlook"}
          </button>
        </div>
        <div className="p-6">
          <div
            ref={sigRef}
            dangerouslySetInnerHTML={{ __html: html }}
            className={config.outlookMode ? "outlook-compat" : ""}
          />
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={handleCopySignature}
          className="flex-1 min-w-[140px] bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm px-4 py-2.5 rounded-lg transition-colors"
        >
          Copy Signature
        </button>
        <button
          onClick={handleCopySource}
          className="flex-1 min-w-[120px] border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium text-sm px-4 py-2.5 rounded-lg transition-colors"
        >
          Copy HTML
        </button>
        <button
          onClick={handleShare}
          className="flex-1 min-w-[100px] border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium text-sm px-4 py-2.5 rounded-lg transition-colors"
        >
          Share Link
        </button>
        <button
          onClick={handleDownload}
          className="border border-gray-200 hover:bg-gray-50 text-gray-500 text-sm px-3 py-2.5 rounded-lg transition-colors"
          title="Download as .html file"
        >
          ↓
        </button>
      </div>

      {/* Instructions */}
      <div className="text-xs text-gray-400 bg-gray-50 rounded-lg p-3 space-y-1">
        <p><strong className="text-gray-500">Gmail:</strong> Settings → See all settings → Signature → paste in the text area</p>
        <p><strong className="text-gray-500">Outlook:</strong> File → Options → Mail → Signatures → New → paste</p>
        <p><strong className="text-gray-500">Apple Mail:</strong> Mail → Preferences → Signatures → paste</p>
      </div>
    </div>
  );
}
