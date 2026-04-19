import type { Metadata } from "next";
import ContactPage from "@/modules/public/ContactPage";
import { getBranding } from "@/lib/branding/server";

export async function generateMetadata(): Promise<Metadata> {
  const { siteName } = await getBranding();
  return {
    title: "Contact",
    description: `Get in touch with ${siteName} — support, partnerships, and product feedback.`,
    openGraph: {
      title: `Contact | ${siteName}`,
      description: `Contact ${siteName} by email or phone.`,
    },
  };
}

export default async function Page() {
  const { siteName } = await getBranding();
  return <ContactPage siteName={siteName} />;
}
