import React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (!user && !token) {
        router.push("/login");
      }
    }
  }, [user, router]);

  if (
    typeof window !== "undefined" &&
    !user &&
    !localStorage.getItem("token")
  ) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
