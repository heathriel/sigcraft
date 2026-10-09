import { DEFAULT_CONFIG, SignatureConfig } from '../types';

const TEXT_FIELDS = ['name', 'pronouns', 'title', 'company', 'department', 'email', 'phone', 'website', 'linkedin', 'twitter', 'github', 'logoUrl'] as const;
const COLOR_FIELDS = ['accentColor', 'textColor', 'mutedColor'] as const;
const HEX_COLOR = /^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i;

/** Treat shared links and local form values as data, never markup or CSS. */
export function normalizeConfig(value: unknown): SignatureConfig | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  const input = value as Record<string, unknown>;
  const result: SignatureConfig = { ...DEFAULT_CONFIG };
  for (const key of TEXT_FIELDS) {
    if (typeof input[key] === 'string') result[key] = (input[key] as string).slice(0, 2048);
  }
  for (const key of COLOR_FIELDS) {
    if (typeof input[key] === 'string' && HEX_COLOR.test(input[key] as string)) result[key] = input[key] as string;
  }
  if (input.template === 'minimal' || input.template === 'classic' || input.template === 'social') result.template = input.template;
  if (typeof input.outlookMode === 'boolean') result.outlookMode = input.outlookMode;
  return result;
}

export function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]!));
}

/** Accept web links only. Reject control characters, credentials, and non-web schemes. */
export function safeHttpUrl(value: string): string {
  const trimmed = value.trim();
  if (!trimmed || /[\u0000-\u0020\u007f\\<>"']/.test(trimmed)) return '';
  const hasScheme = /^[a-z][a-z0-9+.-]*:/i.test(trimmed);
  if (hasScheme && !/^https?:\/\//i.test(trimmed)) return '';
  try {
    const url = new URL(hasScheme ? trimmed : `https://${trimmed}`);
    if (!['https:', 'http:'].includes(url.protocol) || !url.hostname || url.username || url.password) return '';
    return url.href;
  } catch { return ''; }
}

export function safeEmailHref(value: string): string {
  const email = value.trim();
  // No mailto headers or control characters from a shared signature.
  return /^[^\s<>"'?#&:]+@[^\s<>"'?#&:]+\.[^\s<>"'?#&:]+$/.test(email) ? `mailto:${encodeURIComponent(email).replace(/%40/g, '@')}` : '';
}

export function safePhoneHref(value: string): string {
  const digits = value.replace(/\D/g, '');
  return digits ? `tel:${value.trim().startsWith('+') ? '+' : ''}${digits}` : '';
}

export function safeSocialUrl(value: string, prefix: string): string {
  if (/^https?:\/\//i.test(value.trim())) return safeHttpUrl(value);
  const handle = value.trim().replace(/^@/, '');
  return /^[a-z0-9_.\/-]+$/i.test(handle) ? safeHttpUrl(prefix + handle) : '';
}
