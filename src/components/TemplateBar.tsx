import { TEMPLATES } from "../templates";
import { TemplateId } from "../types";

interface Props {
  selected: TemplateId;
  onChange: (id: TemplateId) => void;
}

export function TemplateBar({ selected, onChange }: Props) {
  return (
    <div className="flex gap-2">
      {TEMPLATES.map((t) => (
        <button
          key={t.id}
          onClick={() => onChange(t.id)}
          className={`flex-1 rounded-lg border px-3 py-2 text-left transition-all ${
            selected === t.id
              ? "border-indigo-500 bg-indigo-50 text-indigo-700"
              : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50"
          }`}
        >
          <div className="text-sm font-semibold">{t.label}</div>
          <div className="text-xs text-gray-400 mt-0.5">{t.description}</div>
        </button>
      ))}
    </div>
  );
}
