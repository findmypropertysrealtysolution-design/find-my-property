import { PublicAuthRoute } from "@/components/auth/route-guards";
import Login from "@/modules/auth/Login";

export default function LoginPage() {
  return (
    <PublicAuthRoute>
      <Login />
    </PublicAuthRoute>
  );
}
