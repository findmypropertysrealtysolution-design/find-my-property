import { redirect } from "next/navigation";

/** Favorites feature hidden — keep route from 404 for old links. */
export default function Page() {
  redirect("/dashboard");
}
