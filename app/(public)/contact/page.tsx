import type { Metadata } from "next";
import ContactPage from "@/modules/public/ContactPage";
import { SITE_NAME } from "@/lib/branding";

export const metadata: Metadata = {
  title: "Contact",
  description: `Get in touch with ${SITE_NAME} — support, partnerships, and product feedback.`,
  openGraph: {
    title: `Contact | ${SITE_NAME}`,
    description: `Contact ${SITE_NAME} by email or phone.`,
  },
};

export default function Page() {
  return <ContactPage />;
}
