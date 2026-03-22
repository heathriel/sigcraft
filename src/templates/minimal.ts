import { SignatureConfig } from "../types";

export function renderMinimal(c: SignatureConfig): string {
  const nameStr = c.name + (c.pronouns ? ` <span style="color:${c.mutedColor};font-size:12px;">(${c.pronouns})</span>` : "");
  const titleLine = [c.title, c.company].filter(Boolean).join(" · ");
  const contactLine = [
    c.email ? `<a href="mailto:${c.email}" style="color:${c.accentColor};text-decoration:none;">${c.email}</a>` : "",
    c.phone ? `<a href="tel:${c.phone.replace(/\D/g, "")}" style="color:${c.mutedColor};text-decoration:none;">${c.phone}</a>` : "",
    c.website ? `<a href="${ensureHttp(c.website)}" style="color:${c.mutedColor};text-decoration:none;">${stripHttp(c.website)}</a>` : "",
  ].filter(Boolean).join(" &nbsp;·&nbsp; ");

  return `<table cellpadding="0" cellspacing="0" border="0" style="font-family:-apple-system,Arial,sans-serif;font-size:14px;line-height:1.5;color:${c.textColor};">
  <tr>
    <td style="padding:0;">
      <div style="font-size:16px;font-weight:600;color:${c.textColor};">${nameStr}</div>
      ${titleLine ? `<div style="font-size:13px;color:${c.mutedColor};margin-top:2px;">${titleLine}</div>` : ""}
      <div style="border-top:2px solid ${c.accentColor};width:40px;margin:8px 0;"></div>
      ${contactLine ? `<div style="font-size:12px;color:${c.mutedColor};">${contactLine}</div>` : ""}
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
