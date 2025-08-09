"use client";

import { useEffect } from "react";
import { NotificationPanel } from "@/components/notifications/NotificationBell";
import { Toaster } from "@/components/ui/toaster";
import Layout from "@/components/Layout";
import ScrollToTop from "@/components/ScrollToTop";
import { useAuthStore } from "@/stores/useAuthStore";

export default function LayoutClient({ children }) {
  const getUser = useAuthStore((state) => state.getUser);

  useEffect(() => {
    getUser();
  }, []);

  return (
    <>
      <ScrollToTop />
      <Layout>{children}</Layout>
      <Toaster position="top-center" reverseOrder={false} />
      <NotificationPanel />
    </>
  );
}
