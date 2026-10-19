import "server-only";
import sanitizeHtml from "sanitize-html";
import { htmlToPlainText, toEditorHtml } from "./format";

/**
 * Allow-list sanitizer for product rich text. Runs on every write (repository)
 * and again on render, so stored or legacy content can never inject scripts,
 * styles or event handlers into the storefront.
 */
const OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: ["p", "br", "strong", "b", "em", "i", "u", "s", "h2", "h3", "h4", "ul", "ol", "li", "blockquote", "a", "hr"],
  allowedAttributes: { a: ["href", "target", "rel"] },
  allowedSchemes: ["http", "https", "mailto", "tel"],
  allowProtocolRelative: false,
  transformTags: {
    // The page already owns the only <h1>.
    h1: "h2",
    div: "p",
    a: (_tagName, attribs) => ({
      tagName: "a",
      attribs: { href: attribs.href ?? "", target: "_blank", rel: "noopener noreferrer nofollow" },
    }),
  },
  exclusiveFilter: (frame) => frame.tag === "a" && !frame.attribs.href,
};

/** Clean rich text, upgrading legacy plain text. Empty content becomes null. */
export function sanitizeRichText(value: string | null | undefined): string | null {
  const html = toEditorHtml(value);
  if (!html) return null;
  const clean = sanitizeHtml(html, OPTIONS)
    // Drop the empty paragraphs editors leave at the start/end.
    .replace(/^(?:\s*<p>\s*(?:<br\s*\/?>)?\s*<\/p>)+|(?:<p>\s*(?:<br\s*\/?>)?\s*<\/p>\s*)+$/g, "")
    .trim();
  return htmlToPlainText(clean) ? clean : null;
}

/**
 * REVOLT does not offer a warranty, so any line that mentions one
 * ("🛡️ Garantía de 6 meses…") is dropped from descriptions before they are
 * stored or shown. A line is the text between tags / <br>.
 */
export function stripWarrantyClaims(html: string | null): string | null {
  if (!html) return html;
  const clean = html
    .replace(/(?:<br\s*\/?>)?[^<>]*\b(?:garant[ií]as?|warranty)\b[^<>]*/gi, "")
    .replace(/<p>\s*(?:<br\s*\/?>\s*)*<\/p>/g, "")
    .trim();
  return clean || null;
}

/** Old links to the Vercel preview domain now point to the store's own domain. */
export function toOwnDomain(html: string | null): string | null {
  return html?.replace(/(?:https?:\/\/)?revolt-laptops[\w-]*\.vercel\.app\/?/gi, "https://revolt-laptops.com/") ?? html;
}

/** Storefront cleanup applied to every stored description/verdict. */
export function cleanStoredRichText(html: string | null): string | null {
  return toOwnDomain(stripWarrantyClaims(html));
}
