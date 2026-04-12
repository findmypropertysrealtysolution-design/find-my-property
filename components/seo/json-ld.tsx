import Script from "next/script";

type JsonValue = Record<string, unknown>;

function stringifyLd(data: JsonValue) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

/**
 * Renders one or more JSON-LD blocks. Safe for untrusted strings in values when serialized.
 */
export function JsonLd({ data }: { data: JsonValue | JsonValue[] | null }) {
  if (!data) return null;
  const items = Array.isArray(data) ? data : [data];
  return (
    <>
      {items.map((item, i) => (
        <Script key={i} strategy="beforeInteractive" type="application/ld+json" dangerouslySetInnerHTML={{ __html: stringifyLd(item) }} />
      ))}
    </>
  );
}
