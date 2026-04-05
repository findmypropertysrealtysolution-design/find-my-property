import { normalizePhone } from "@/helpers";

/** Digits only, international (e.g. 919876543210) for wa.me / web.whatsapp.com */
export function toWhatsAppDigits(raw: string): string {
  return normalizePhone(raw).replace(/\D/g, "");
}

/** Opens the device dialer with the number. */
export function buildTelHref(raw: string): string {
  const n = normalizePhone(raw).trim();
  if (!n) return "#";
  return `tel:${n.replace(/\s/g, "")}`;
}

/**
 * WhatsApp chat URL: on phones/tablets uses `wa.me` (app or browser);
 * on desktop/laptop uses `web.whatsapp.com/send` so the web client opens with the chat prefilled.
 */
export function buildWhatsAppHref(raw: string, body?: string): string {
  const digits = toWhatsAppDigits(raw);
  if (!digits) return "#";

  if (typeof window === "undefined") {
    const q = body ? `?text=${encodeURIComponent(body)}` : "";
    return `https://wa.me/${digits}${q}`;
  }

  const ua = navigator.userAgent;
  const isMobileOrTablet =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile/i.test(ua) ||
    (navigator.maxTouchPoints > 1 && /Macintosh|Windows/i.test(ua));

  if (isMobileOrTablet) {
    const params = new URLSearchParams();
    if (body) params.set("text", body);
    const q = params.toString();
    return `https://wa.me/${digits}${q ? `?${q}` : ""}`;
  }

  const params = new URLSearchParams();
  params.set("phone", digits);
  if (body) params.set("text", body);
  return `https://web.whatsapp.com/send?${params.toString()}`;
}
