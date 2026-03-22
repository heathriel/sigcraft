export type TemplateId = "minimal" | "classic" | "social";

export interface SignatureConfig {
  // Identity
  name: string;
  pronouns: string;
  title: string;
  company: string;
  department: string;

  // Contact
  email: string;
  phone: string;
  website: string;

  // Social
  linkedin: string;
  twitter: string;
  github: string;

  // Branding
  logoUrl: string;
  accentColor: string;
  textColor: string;
  mutedColor: string;

  // Layout
  template: TemplateId;

  // Compat mode: strips CSS Outlook doesn't support
  outlookMode: boolean;
}

export const DEFAULT_CONFIG: SignatureConfig = {
  name: "",
  pronouns: "",
  title: "",
  company: "",
  department: "",
  email: "",
  phone: "",
  website: "",
  linkedin: "",
  twitter: "",
  github: "",
  logoUrl: "",
  accentColor: "#6366f1",
  textColor: "#111827",
  mutedColor: "#6b7280",
  template: "classic",
  outlookMode: false,
};
