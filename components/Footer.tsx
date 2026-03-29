import { Building2, Heart, Phone, Mail } from "lucide-react";
import Link from "next/link";
import { useSettings } from "@/contexts/SettingsContext";

const Footer = () => {
  const { settings } = useSettings();

  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg hero-gradient flex items-center justify-center">
                <Building2 className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-heading font-bold text-xl text-foreground">
                {settings?.siteName || "NoBroker"}
              </span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs wrap-break-word">
              India's first proptech unicorn. Find your dream home without paying any brokerage.
            </p>
          </div>

          <div>
            <h4 className="font-heading font-semibold text-foreground mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/properties" className="hover:text-primary transition-colors">Properties</Link></li>
              <li><Link href="/owner" className="hover:text-primary transition-colors">For Owners</Link></li>
              <li><Link href="/tenant" className="hover:text-primary transition-colors">For Tenants</Link></li>
              <li><Link href="/sitemap" className="hover:text-primary transition-colors">Sitemap</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-semibold text-foreground mb-4">Services</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Home Loans</li>
              <li>Packers & Movers</li>
              <li>Home Interiors</li>
              <li>Legal Assistance</li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-semibold text-foreground mb-4">Contact</h4>
            <ul className="space-y-2 text-sm text-muted-foreground wrap-break-word">
              <li className="flex items-center gap-2 min-w-0"><Phone className="w-4 h-4 shrink-0" /> <span className="min-w-0">+91 98765 43210</span></li>
              <li className="flex items-center gap-2 min-w-0"><Mail className="w-4 h-4 shrink-0" /> <span className="min-w-0 break-all">support@nobroker.in</span></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground">© 2026 {settings?.siteName || "NoBroker"}. All rights reserved.</p>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            Made with <Heart className="w-3 h-3 text-accent" /> in India
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
