import { sanitizeRichText } from "@/lib/rich-text/sanitize";
import { cn } from "@/lib/utils/cn";

/** Server-rendered, sanitized rich text (product descriptions and verdicts). */
export function RichText({ html, className }: { html: string | null | undefined; className?: string }) {
  const clean = sanitizeRichText(html);
  if (!clean) return null;
  return <div className={cn("rich-text", className)} dangerouslySetInnerHTML={{ __html: clean }} />;
}
