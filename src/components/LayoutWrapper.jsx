"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useUserStore } from "@/stores/useUserStore";
import { useFileStore } from "@/stores/useFileStore";
import { useSupabase } from "@/utils/supabase/client";
import Layout from "./Layout";
import NotificationPanel from "./notifications/NotificationBell";

export default function LayoutWrapper({ children, session }) {
  const pathname = usePathname();
  const supabase = useSupabase();
  const { setUser, fetchUnreadNotifications } = useUserStore();
  const { getAllNotes } = useFileStore();

  useEffect(() => {
    const initializeData = async () => {
      if (session?.user) {
        setUser(session.user);
        await fetchUnreadNotifications(supabase);
        await getAllNotes(supabase);
      }
    };

    initializeData();
  }, [session, setUser, fetchUnreadNotifications, getAllNotes, supabase]);

  return (
    <Layout>
      {children}
      <NotificationPanel />
    </Layout>
  );
}
