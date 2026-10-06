/**
 * Client-safe helpers for product rich text (descriptions and verdicts).
 *
 * Descriptions are stored as HTML produced by the admin editor. Older rows are
 * plain text, so everything here accepts both: plain text is upgraded to
 * paragraphs/lists on the fly. Sanitization lives in ./sanitize.ts (server-only).
 */

const HTML_TAG = /<\/?(p|br|strong|b|em|i|u|s|h[1-6]|ul|ol|li|blockquote|a|hr|div|span)\b[^>]*>/i;

/** True when the value already contains markup (vs. legacy plain text). */
export function isRichHtml(value: string): boolean {
  return HTML_TAG.test(value);
}

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const BULLET = /^\s*[-•*]\s+/;
const NUMBERED = /^\s*\d+[.)]\s+/;

/**
 * Upgrade legacy plain text to HTML: blank lines split paragraphs, lines that
 * start with "-", "•" or "*" become bullet lists, "1." / "1)" ordered lists.
 */
export function plainTextToHtml(text: string): string {
  const blocks = text.replace(/\r\n?/g, "\n").trim().split(/\n{2,}/);

  return blocks
    .map((block) => {
      const lines = block.split("\n").filter((line) => line.trim());
      if (lines.length && lines.every((line) => BULLET.test(line))) {
        return `<ul>${lines.map((line) => `<li>${escapeHtml(line.replace(BULLET, ""))}</li>`).join("")}</ul>`;
      }
      if (lines.length && lines.every((line) => NUMBERED.test(line))) {
        return `<ol>${lines.map((line) => `<li>${escapeHtml(line.replace(NUMBERED, ""))}</li>`).join("")}</ol>`;
      }
      return `<p>${lines.map((line) => escapeHtml(line.trim())).join("<br>")}</p>`;
    })
    .filter((html) => html !== "<p></p>")
    .join("");
}

/** HTML to hand to the editor, whatever format the stored value is in. */
export function toEditorHtml(value: string | null | undefined): string {
  if (!value?.trim()) return "";
  return isRichHtml(value) ? value : plainTextToHtml(value);
}

const ENTITIES: Record<string, string> = {
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&#39;": "'",
  "&nbsp;": " ",
};

/** Flatten rich text to a single line (meta descriptions, JSON-LD, previews). */
export function htmlToPlainText(value: string | null | undefined): string {
  if (!value) return "";
  return value
    .replace(/<(br|hr)\s*\/?>/gi, " ")
    .replace(/<\/(p|li|h[1-6]|blockquote|div)>/gi, " ")
    .replace(/<[^>]+>/g, "")
    .replace(/&(amp|lt|gt|quot|#39|nbsp);/g, (entity) => ENTITIES[entity] ?? entity)
    .replace(/\s+/g, " ")
    .trim();
}

/** Cut text at a word boundary so it fits a meta description. */
export function excerpt(text: string, max = 158): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max - 1);
  const lastSpace = cut.lastIndexOf(" ");
  return `${(lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).replace(/[\s,.;:—-]+$/, "")}…`;
}
