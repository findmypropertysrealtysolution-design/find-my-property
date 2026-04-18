import "server-only";

type JsonValue = Record<string, unknown>;

function stringifyLd(data: JsonValue) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

/**
 * Renders one or more JSON-LD blocks as plain inline `<script>` tags in the server-rendered HTML.
 *
 * This is intentionally a server-only component so React never re-hydrates or re-renders the
 * `<script>` element on the client — avoiding React 19's "script tag in React component" warning,
 * which fires because non-async inline scripts are not executed during client rendering. JSON-LD
 * doesn't need to execute; search engines read it straight from the initial HTML, so SSR-only
 * emission is both correct and the pattern recommended in the Next.js App Router docs.
 */
export function JsonLd({ data }: { data: JsonValue | JsonValue[] | null }) {
  if (!data) return null;
  const items = Array.isArray(data) ? data : [data];
  return (
    <>
      {items.map((item, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: stringifyLd(item) }}
        />
      ))}
    </>
  );
}
