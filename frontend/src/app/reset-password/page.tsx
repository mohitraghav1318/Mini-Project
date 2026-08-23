import { Suspense } from "react";
import ResetPassword from "@/features/reset-password/ResetPassword";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPassword />
    </Suspense>
  );
}