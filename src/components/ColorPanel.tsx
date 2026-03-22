import { useState } from "react";
import { SignatureConfig } from "../types";
import { extractColors } from "../utils/colorExtract";
import { toast } from "./Toast";

interface Props {
  config: SignatureConfig;
  onChange: (partial: Partial<SignatureConfig>) => void;
}

export function ColorPanel({ config, onChange }: Props) {
  const [extracting, setExtracting] = useState(false);
  const [extracted, setExtracted] = useState<string[]>([]);

  async function handleExtract() {
    if (!config.logoUrl) { toast("Paste a logo URL first", "error"); return; }
    setExtracting(true);
    const colors = await extractColors(config.logoUrl, 5);
    setExtracting(false);
    if (!colors.length) {
      toast("Could not extract colors — CORS may be blocking the image. Try a CDN-hosted logo.", "error");
      return;
    }
    setExtracted(colors);
    // Auto-apply the most dominant color as accent
    onChange({ accentColor: colors[0] });
    toast("Colors extracted — click any swatch to apply", "info");
  }

  return (
    <div className="space-y-4">
      {/* Logo */}
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wide">Logo URL</label>
        <div className="flex gap-2">
          <input
            type="url"
            value={config.logoUrl}
            onChange={(e) => onChange({ logoUrl: e.target.value })}
            placeholder="https://yourcompany.com/logo.png"
            className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <button
            onClick={handleExtract}
            disabled={extracting}
            className="px-3 py-2 text-xs font-semibold rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 transition-colors whitespace-nowrap"
          >
            {extracting ? "…" : "Extract Colors"}
          </button>
        </div>
        {extracted.length > 0 && (
          <div className="flex gap-2 mt-2 flex-wrap">
            {extracted.map((hex) => (
              <button
                key={hex}
                title={`Apply ${hex}`}
                onClick={() => { onChange({ accentColor: hex }); toast(`Accent set to ${hex}`, "success"); }}
                className="w-7 h-7 rounded-full border-2 border-white shadow-md hover:scale-110 transition-transform"
                style={{ background: hex }}
              />
            ))}
            <span className="text-xs text-gray-400 self-center">click to apply as accent</span>
          </div>
        )}
      </div>

      {/* Color pickers */}
      <div className="grid grid-cols-3 gap-3">
        {(
          [
            { key: "accentColor", label: "Accent" },
            { key: "textColor", label: "Name" },
            { key: "mutedColor", label: "Muted" },
          ] as { key: keyof SignatureConfig; label: string }[]
        ).map(({ key, label }) => (
          <div key={key}>
            <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={config[key] as string}
                onChange={(e) => onChange({ [key]: e.target.value })}
                className="w-8 h-8 rounded cursor-pointer border border-gray-200 p-0.5 bg-white"
              />
              <input
                type="text"
                value={config[key] as string}
                onChange={(e) => onChange({ [key]: e.target.value })}
                className="flex-1 rounded border border-gray-200 px-2 py-1 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-indigo-400"
                maxLength={7}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
