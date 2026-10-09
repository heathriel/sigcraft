import { DEFAULT_CONFIG, SignatureConfig } from '../types';
import { normalizeConfig, escapeHtml as e, safeSocialUrl } from '../utils/safety';
import { renderClassic } from './classic';

const SOCIAL = {
  linkedin: { label: 'LinkedIn', prefix: 'https://linkedin.com/in/' },
  twitter: { label: 'Twitter/X', prefix: 'https://x.com/' },
  github: { label: 'GitHub', prefix: 'https://github.com/' },
};
export function renderSocial(input: SignatureConfig): string {
  const c = normalizeConfig(input) ?? DEFAULT_CONFIG;
  const links = (['linkedin', 'twitter', 'github'] as const).map(key => {
    const {label, prefix} = SOCIAL[key];
    const url = safeSocialUrl(c[key], prefix);
    return url ? `<a href="${e(url)}" style="color:${c.accentColor};text-decoration:none;font-size:11px;font-weight:500;border:1px solid ${c.accentColor};padding:2px 8px;display:inline-block;">${label}</a>` : '';
  }).filter(Boolean);
  const classic = renderClassic(c);
  // Keep both tables well formed; do not nest a table directly inside another table.
  return classic + (links.length ? `<table cellpadding="0" cellspacing="0" border="0" style="margin-top:10px;"><tr><td>${links.join('&nbsp;')}</td></tr></table>` : '');
}
