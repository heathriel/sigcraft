import { SignatureConfig } from "../types";

interface Props {
  config: SignatureConfig;
  onChange: (partial: Partial<SignatureConfig>) => void;
}

interface FieldDef {
  key: keyof SignatureConfig;
  label: string;
  placeholder: string;
  type?: string;
  optional?: boolean;
}

const IDENTITY_FIELDS: FieldDef[] = [
  { key: "name",       label: "Full Name",    placeholder: "Jane Smith",          type: "text" },
  { key: "pronouns",   label: "Pronouns",     placeholder: "she/her",             type: "text",  optional: true },
  { key: "title",      label: "Title",        placeholder: "Senior Engineer",     type: "text" },
  { key: "company",    label: "Company",      placeholder: "Acme Corp",           type: "text" },
  { key: "department", label: "Department",   placeholder: "Engineering",         type: "text",  optional: true },
];

const CONTACT_FIELDS: FieldDef[] = [
  { key: "email",   label: "Email",   placeholder: "jane@acme.com",          type: "email" },
  { key: "phone",   label: "Phone",   placeholder: "+1 (415) 555-0123",      type: "tel",   optional: true },
  { key: "website", label: "Website", placeholder: "acme.com",               type: "url",   optional: true },
];

const SOCIAL_FIELDS: FieldDef[] = [
  { key: "linkedin", label: "LinkedIn", placeholder: "janesmith (handle or full URL)", optional: true },
  { key: "twitter",  label: "Twitter/X", placeholder: "janesmith",                    optional: true },
  { key: "github",   label: "GitHub",   placeholder: "janesmith",                    optional: true },
];

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">{title}</h3>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function Field({ def, value, onChange }: { def: FieldDef; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="flex items-center gap-1 text-xs font-medium text-gray-600 mb-1">
        {def.label}
        {def.optional && <span className="text-gray-300 font-normal">optional</span>}
      </label>
      <input
        type={def.type ?? "text"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={def.placeholder}
        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 placeholder:text-gray-300"
      />
    </div>
  );
}

export function Form({ config, onChange }: Props) {
  function field(key: keyof SignatureConfig) {
    return (value: string) => onChange({ [key]: value });
  }

  return (
    <div className="space-y-6">
      <Section title="Identity">
        {IDENTITY_FIELDS.map((def) => (
          <Field key={def.key} def={def} value={config[def.key] as string} onChange={field(def.key)} />
        ))}
      </Section>
      <Section title="Contact">
        {CONTACT_FIELDS.map((def) => (
          <Field key={def.key} def={def} value={config[def.key] as string} onChange={field(def.key)} />
        ))}
      </Section>
      <Section title="Social">
        {SOCIAL_FIELDS.map((def) => (
          <Field key={def.key} def={def} value={config[def.key] as string} onChange={field(def.key)} />
        ))}
      </Section>
    </div>
  );
}
