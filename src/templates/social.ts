import { SignatureConfig } from "../types";
import { renderClassic } from "./classic";

// Social icons as inline SVGs (no external dependencies, email-safe via cid or data URI alternative)
// We use linked text icons for max email client compat — many block external images
const SOCIAL_ICONS: Record<string, { label: string; prefix: string }> = {
  linkedin: { label: "LinkedIn", prefix: "https://linkedin.com/in/" },
  twitter:  { label: "Twitter/X", prefix: "https://x.com/" },
  github:   { label: "GitHub", prefix: "https://github.com/" },
};

export function renderSocial(c: SignatureConfig): string {
  const classicHtml = renderClassic(c);

  const socialLinks = (["linkedin", "twitter", "github"] as const)
    .filter((key) => c[key])
    .map((key) => {
      const { label, prefix } = SOCIAL_ICONS[key];
      const handle = c[key];
      const url = handle.startsWith("http") ? handle : `${prefix}${handle}`;
      return `<a href="${url}" style="color:${c.accentColor};text-decoration:none;font-size:11px;font-weight:500;border:1px solid ${c.accentColor};padding:2px 8px;border-radius:3px;display:inline-block;">${label}</a>`;
    });

  if (!socialLinks.length) return classicHtml;

  const socialRow = `
<table cellpadding="0" cellspacing="0" border="0" style="margin-top:10px;">
  <tr>
    <td style="padding:0;">
      ${socialLinks.join("&nbsp;")}
    </td>
  </tr>
</table>`;

  // Inject social row before the closing table tag of classic
  return classicHtml.replace("</table>", "") + socialRow + "\n</table>";
}
