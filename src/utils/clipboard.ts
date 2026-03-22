export interface CopyResult {
  ok: boolean;
  method: "modern" | "legacy" | "failed";
}

/** Copy an element's innerHTML as rich text (preserves table formatting in Gmail/Outlook paste) */
export async function copySignatureHtml(el: HTMLElement): Promise<CopyResult> {
  const html = el.innerHTML;
  const text = el.innerText;

  // Modern async clipboard API — preferred
  if (navigator.clipboard && window.ClipboardItem) {
    try {
      await navigator.clipboard.write([
        new ClipboardItem({
          "text/html": new Blob([html], { type: "text/html" }),
          "text/plain": new Blob([text], { type: "text/plain" }),
        }),
      ]);
      return { ok: true, method: "modern" };
    } catch {
      // Fall through to legacy
    }
  }

  // Legacy selection method — works in all browsers
  try {
    const range = document.createRange();
    range.selectNodeContents(el);
    const sel = window.getSelection();
    sel?.removeAllRanges();
    sel?.addRange(range);
    document.execCommand("copy");
    sel?.removeAllRanges();
    return { ok: true, method: "legacy" };
  } catch {
    return { ok: false, method: "failed" };
  }
}

/** Copy the raw HTML string to clipboard (for "Copy HTML source") */
export async function copyHtmlSource(html: string): Promise<CopyResult> {
  try {
    await navigator.clipboard.writeText(html);
    return { ok: true, method: "modern" };
  } catch {
    return { ok: false, method: "failed" };
  }
}
