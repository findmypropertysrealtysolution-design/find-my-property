import { PublicAuthRoute } from "@/components/auth/route-guards";
import Register from "@/modules/auth/Register";

export default function RegisterPage() {
  return (
    <PublicAuthRoute>
      <Register />
    </PublicAuthRoute>
  );
}
