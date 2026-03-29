import { PublicAuthRoute } from "@/components/auth/route-guards";
import Register from "@/views/Register";

export default function RegisterPage() {
  return (
    <PublicAuthRoute>
      <Register />
    </PublicAuthRoute>
  );
}
