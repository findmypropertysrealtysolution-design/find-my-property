import { redirect } from "next/navigation";

/** Alerts feature hidden — keep route from 404 for old links. */
export default function Page() {
  redirect("/dashboard");
}
