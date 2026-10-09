import { DEFAULT_CONFIG, SignatureConfig } from '../types';
import { normalizeConfig, escapeHtml as e, safeHttpUrl, safeEmailHref, safePhoneHref } from '../utils/safety';

export function renderMinimal(input: SignatureConfig): string {
  const c = normalizeConfig(input) ?? DEFAULT_CONFIG;
  const name = e(c.name) + (c.pronouns ? ` <span style="color:${c.mutedColor};font-size:12px;">(${e(c.pronouns)})</span>` : '');
  const title = [c.title, c.company].filter(Boolean).map(e).join(' · ');
  const items = [[c.email, safeEmailHref(c.email)], [c.phone, safePhoneHref(c.phone)], [c.website.replace(/^https?:\/\//i, ''), safeHttpUrl(c.website)]];
  const contacts = items.filter(([label]) => label).map(([label, href]) => href
    ? `<a href="${e(href)}" style="color:${c.mutedColor};text-decoration:none;">${e(label)}</a>` : e(label)).join(' &nbsp;·&nbsp; ');
  return `<table cellpadding="0" cellspacing="0" border="0" style="font-family:Arial,sans-serif;font-size:14px;line-height:1.5;color:${c.textColor};"><tr><td style="padding:0;">
<div style="font-size:16px;font-weight:600;">${name}</div>
${title ? `<div style="font-size:13px;color:${c.mutedColor};margin-top:2px;">${title}</div>` : ''}
<div style="border-top:2px solid ${c.accentColor};width:40px;margin:8px 0;"></div>
${contacts ? `<div style="font-size:12px;">${contacts}</div>` : ''}
</td></tr></table>`;
}
