import { request } from "@/end-points/http";

export type ContactFormPayload = {
  name: string;
  email: string;
  message: string;
  subject: string;
  /** reCAPTCHA v2 response token for server-side verification */
  recaptchaToken: string;
};

export const contact = {
  submit(payload: ContactFormPayload) {
    return request<{ message?: string }>("/contact", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
};
