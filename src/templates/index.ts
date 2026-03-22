import { SignatureConfig, TemplateId } from "../types";
import { renderMinimal } from "./minimal";
import { renderClassic } from "./classic";
import { renderSocial } from "./social";

export interface TemplateInfo {
  id: TemplateId;
  label: string;
  description: string;
  render: (config: SignatureConfig) => string;
}

export const TEMPLATES: TemplateInfo[] = [
  {
    id: "minimal",
    label: "Minimal",
    description: "Clean single-column, no logo",
    render: renderMinimal,
  },
  {
    id: "classic",
    label: "Classic",
    description: "Logo left, contact right",
    render: renderClassic,
  },
  {
    id: "social",
    label: "Social",
    description: "Classic + social icon row",
    render: renderSocial,
  },
];

export function renderTemplate(config: SignatureConfig): string {
  const template = TEMPLATES.find((t) => t.id === config.template) ?? TEMPLATES[1];
  return template.render(config);
}
