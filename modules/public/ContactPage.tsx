"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Mail, MapPin, Phone, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SITE_NAME, SUPPORT_EMAIL } from "@/lib/branding";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";

const SUPPORT_PHONE = "+91 98765 43210";

export default function ContactPage() {
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedMessage = message.trim();
    const trimmedSubject = subject.trim();

    if (!trimmedEmail || !trimmedMessage) {
      toast({
        title: "Missing fields",
        description: "Please enter your email and message.",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    try {
      await api.contact.submit({
        name: trimmedName || "Visitor",
        email: trimmedEmail,
        message: trimmedMessage,
        subject: trimmedSubject || "Contact form",
      });
      toast({
        title: "Message sent",
        description: "Thanks — we’ll get back to you as soon as we can.",
      });
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    } catch (err) {
      toast({
        title: "Couldn’t send message",
        description: err instanceof Error ? err.message : "Something went wrong. Try again later.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="pb-20 pt-24">
      <div className="container mx-auto max-w-5xl px-4">
        <Button variant="ghost" size="sm" asChild className="mb-8 -ml-2 text-muted-foreground">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to home
          </Link>
        </Button>

        <div className="mb-12 max-w-2xl">
          <motion.h1
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-heading text-4xl font-bold tracking-tight text-foreground md:text-5xl"
          >
            Contact
          </motion.h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Questions about listings, your account, or working with {SITE_NAME}? Send us a note — we typically reply
            within a few business days.
          </p>
        </div>

        <div className="grid gap-12 lg:grid-cols-5">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="space-y-8 lg:col-span-2"
          >
            <div>
              <h2 className="font-heading text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Direct
              </h2>
              <ul className="mt-4 space-y-4 text-sm">
                <li className="flex gap-3">
                  <Mail className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden />
                  <div>
                    <p className="font-medium text-foreground">Email</p>
                    <a
                      href={`mailto:${SUPPORT_EMAIL}`}
                      className="text-primary underline-offset-4 hover:underline break-all"
                    >
                      {SUPPORT_EMAIL}
                    </a>
                  </div>
                </li>
                <li className="flex gap-3">
                  <Phone className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden />
                  <div>
                    <p className="font-medium text-foreground">Phone</p>
                    <a href={`tel:${SUPPORT_PHONE.replace(/\s/g, "")}`} className="text-foreground hover:text-primary">
                      {SUPPORT_PHONE}
                    </a>
                  </div>
                </li>
                <li className="flex gap-3">
                  <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden />
                  <div>
                    <p className="font-medium text-foreground">Based in</p>
                    <p className="text-muted-foreground">India</p>
                  </div>
                </li>
              </ul>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-3"
          >
            <form
              onSubmit={handleSubmit}
              className="rounded-2xl border border-border bg-card p-6 shadow-sm md:p-8"
            >
              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="contact-name">Name</Label>
                    <Input
                      id="contact-name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Jane Doe"
                      autoComplete="name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact-email">Email</Label>
                    <Input
                      id="contact-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="jane@example.com"
                      autoComplete="email"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact-subject">Subject</Label>
                  <Input
                    id="contact-subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Question"
                    autoComplete="off"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact-message">Message</Label>
                  <Textarea
                    id="contact-message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="How can we help?"
                    rows={6}
                    required
                    className="resize-y min-h-[140px]"
                  />
                </div>
                <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={submitting}>
                  <Send className="mr-2 h-4 w-4" />
                  {submitting ? "Sending…" : "Send message"}
                </Button>
                <p className="text-xs text-muted-foreground">
                  Your message is sent securely to our team. You can still reach us directly at {SUPPORT_EMAIL}.
                </p>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
