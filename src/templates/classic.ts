import { SignatureConfig } from "../types";

export function renderClassic(c: SignatureConfig): string {
  const nameStr = c.name + (c.pronouns ? ` <span style="color:${c.mutedColor};font-size:11px;">(${c.pronouns})</span>` : "");
  const titleLine = [c.title, c.department].filter(Boolean).join(", ");
  const companyLine = c.company;

  const lines: string[] = [];
  if (titleLine) lines.push(`<div style="font-size:12px;color:${c.mutedColor};margin-top:1px;">${titleLine}</div>`);
  if (companyLine) lines.push(`<div style="font-size:12px;color:${c.mutedColor};">${companyLine}</div>`);
  if (c.email) lines.push(`<div style="font-size:12px;margin-top:6px;"><a href="mailto:${c.email}" style="color:${c.accentColor};text-decoration:none;">${c.email}</a></div>`);
  if (c.phone) lines.push(`<div style="font-size:12px;"><a href="tel:${c.phone.replace(/\D/g,"")}" style="color:${c.mutedColor};text-decoration:none;">${c.phone}</a></div>`);
  if (c.website) lines.push(`<div style="font-size:12px;"><a href="${ensureHttp(c.website)}" style="color:${c.mutedColor};text-decoration:none;">${stripHttp(c.website)}</a></div>`);

  const logoCell = c.logoUrl
    ? `<td style="padding:0 16px 0 0;vertical-align:top;">
        <img src="${c.logoUrl}" alt="${c.company || "Logo"}" width="80" height="80" style="display:block;object-fit:contain;" />
      </td>`
    : `<td style="padding:0 12px 0 0;vertical-align:top;">
        <div style="width:4px;height:100%;background:${c.accentColor};min-height:70px;"></div>
      </td>`;

  return `<table cellpadding="0" cellspacing="0" border="0" style="font-family:-apple-system,Arial,sans-serif;font-size:14px;line-height:1.5;color:${c.textColor};">
  <tr>
    ${logoCell}
    <td style="padding:0;vertical-align:top;border-left:3px solid ${c.accentColor};padding-left:14px;">
      <div style="font-size:15px;font-weight:600;color:${c.textColor};">${nameStr}</div>
      ${lines.join("\n      ")}
    </td>
  </tr>
</table>`;
}

function ensureHttp(url: string): string {
  return url.startsWith("http") ? url : `https://${url}`;
}

function stripHttp(url: string): string {
  return url.replace(/^https?:\/\//, "");
}
