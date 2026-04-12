import { Building2, Heart, Phone, Mail } from "lucide-react";
import Link from "next/link";
import { SITE_NAME, SUPPORT_EMAIL } from "@/lib/branding";

const Footer = () => {
  const settings = { siteName: SITE_NAME };

  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-3">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg hero-gradient flex items-center justify-center">
                <Building2 className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-heading font-bold text-xl text-foreground">
                {SITE_NAME}
              </span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs wrap-break-word">
              {SITE_NAME} helps you find and list homes with verified details and direct owner contact.
            </p>
          </div>

          <div>
            <h4 className="font-heading font-semibold text-foreground mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/browse" className="hover:text-primary transition-colors">Browse listings</Link></li>
              <li><Link href="/about" className="hover:text-primary transition-colors">About</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
              <li><Link href="/login" className="hover:text-primary transition-colors">Sign in</Link></li>
              <li><Link href="/sitemap" className="hover:text-primary transition-colors">Sitemap</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-semibold text-foreground mb-4">Contact</h4>
            <ul className="space-y-2 text-sm text-muted-foreground wrap-break-word">
              <li className="flex items-center gap-2 min-w-0"><Phone className="w-4 h-4 shrink-0" /> <span className="min-w-0">+91 98765 43210</span></li>
              <li className="flex items-center gap-2 min-w-0"><Mail className="w-4 h-4 shrink-0" /> <a href={`mailto:${SUPPORT_EMAIL}`} className="min-w-0 break-all hover:text-primary transition-colors">{SUPPORT_EMAIL}</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground">© 2026 {settings?.siteName ?? SITE_NAME}. All rights reserved.</p>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            Made with <Heart className="w-3 h-3 text-accent" /> in India
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
