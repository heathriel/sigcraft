import { SignatureConfig } from "../types";
import { normalizeConfig } from "./safety";

export function encodeConfig(config: SignatureConfig): string {
  try {
    return btoa(encodeURIComponent(JSON.stringify(normalizeConfig(config))));
  } catch {
    return "";
  }
}

export function decodeConfig(hash: string): SignatureConfig | null {
  try {
    const raw = hash.startsWith("#") ? hash.slice(1) : hash;
    if (!raw || raw.length > 65536) return null;
    const parsed = JSON.parse(decodeURIComponent(atob(raw)));
    return normalizeConfig(parsed);
  } catch {
    return null;
  }
}

export function loadFromUrl(): SignatureConfig | null {
  return decodeConfig(window.location.hash);
}

export function syncToUrl(config: SignatureConfig): void {
  const encoded = encodeConfig(config);
  window.history.replaceState(null, "", `#${encoded}`);
}

export function buildShareUrl(config: SignatureConfig): string {
  const encoded = encodeConfig(config);
  return `${window.location.origin}${window.location.pathname}#${encoded}`;
}

