import { SignatureConfig } from "../types";
import { normalizeConfig } from "./safety";

export const MAX_SHARE_HASH_LENGTH = 65536;
export const SHARE_LINK_ERROR = "This signature cannot be saved in a share link. Try shortening the fields. You can still copy or download the signature.";

export function encodeConfig(config: SignatureConfig): string | null {
  try {
    const normalized = normalizeConfig(config);
    if (!normalized) return null;
    const encoded = btoa(encodeURIComponent(JSON.stringify(normalized)));
    // Never produce a link that our own decoder will reject.
    return encoded.length <= MAX_SHARE_HASH_LENGTH ? encoded : null;
  } catch {
    return null;
  }
}

export function decodeConfig(hash: string): SignatureConfig | null {
  try {
    const raw = hash.startsWith("#") ? hash.slice(1) : hash;
    if (!raw || raw.length > MAX_SHARE_HASH_LENGTH) return null;
    const parsed = JSON.parse(decodeURIComponent(atob(raw)));
    return normalizeConfig(parsed);
  } catch {
    return null;
  }
}

export function loadFromUrl(): SignatureConfig | null {
  return decodeConfig(window.location.hash);
}

export function syncToUrl(config: SignatureConfig): boolean {
  const encoded = encodeConfig(config);
  if (encoded === null) {
    // A previous, smaller signature must not masquerade as the current one.
    // Keep the current fields in memory and preserve the path and query.
    window.history.replaceState(null, "", window.location.pathname + window.location.search);
    return false;
  }
  window.history.replaceState(null, "", `#${encoded}`);
  return true;
}

export function buildShareUrl(config: SignatureConfig): string | null {
  const encoded = encodeConfig(config);
  if (encoded === null) return null;
  return `${window.location.origin}${window.location.pathname}#${encoded}`;
}

