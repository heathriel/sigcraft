import { DEFAULT_CONFIG, SignatureConfig } from '../types';
import { normalizeConfig, escapeHtml as e, safeHttpUrl, safeEmailHref, safePhoneHref } from '../utils/safety';

export function renderClassic(input: SignatureConfig): string {
  const c = normalizeConfig(input) ?? DEFAULT_CONFIG;
  const name = e(c.name) + (c.pronouns ? ` <span style="color:${c.mutedColor};font-size:11px;">(${e(c.pronouns)})</span>` : '');
  const title = [c.title, c.department].filter(Boolean).map(e).join(', ');
  const lines: string[] = [];
  if (title) lines.push(`<div style="font-size:12px;color:${c.mutedColor};margin-top:1px;">${title}</div>`);
  if (c.company) lines.push(`<div style="font-size:12px;color:${c.mutedColor};">${e(c.company)}</div>`);
  for (const [label, href] of [[c.email, safeEmailHref(c.email)], [c.phone, safePhoneHref(c.phone)], [c.website.replace(/^https?:\/\//i, ''), safeHttpUrl(c.website)]]) {
    if (label) lines.push(`<div style="font-size:12px;">${href ? `<a href="${e(href)}" style="color:${c.accentColor};text-decoration:none;">${e(label)}</a>` : e(label)}</div>`);
  }
  const logo = safeHttpUrl(c.logoUrl);
  const logoCell = logo ? `<td style="padding:0 16px 0 0;vertical-align:top;"><img src="${e(logo)}" alt="${e(c.company || 'Logo')}" referrerpolicy="no-referrer" width="80" height="80" style="display:block;object-fit:contain;" /></td>` : '';
  return `<table cellpadding="0" cellspacing="0" border="0" style="font-family:Arial,sans-serif;font-size:14px;line-height:1.5;color:${c.textColor};"><tr>
${logoCell}<td style="vertical-align:top;border-left:3px solid ${c.accentColor};padding-left:14px;">
<div style="font-size:15px;font-weight:600;">${name}</div>${lines.join('\n')}
</td></tr></table>`;
}
