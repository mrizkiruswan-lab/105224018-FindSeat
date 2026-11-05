
import { Suspense } from "react";
import { auth } from "@/auth";
import LogoutButton from "@/components/LogoutButton";

async function AuthContent() {
  const session = await auth();

  if (!session?.user) {
    return null;
  }

  return <LogoutButton />;
}

export default function HeaderAuth() {
  return (
    <Suspense fallback={null}>
      <AuthContent />
    </Suspense>
  );
}
