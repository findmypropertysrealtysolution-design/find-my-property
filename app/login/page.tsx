import { PublicAuthRoute } from "@/components/auth/route-guards";
import Login from "@/views/Login";

export default function LoginPage() {
  return (
    <PublicAuthRoute>
      <Login />
    </PublicAuthRoute>
  );
}
