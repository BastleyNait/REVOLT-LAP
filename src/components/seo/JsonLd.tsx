/**
 * Structured data (schema.org JSON-LD) for search engines. `<` is escaped so
 * product text can never close the script tag (XSS-safe, per the Next docs).
 */
export function JsonLd({ data }: { data: object | object[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
