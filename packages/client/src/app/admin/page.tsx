"use client";

import { useAuth } from "@scspace-client/Hooks/auth";
import PageTemplete from "@scspace-client/Components/_commons/PageTemplete";
import Admin from "@scspace-client/Components/Admin";

export default function SpacePage() {
  const { needAdmin } = useAuth();
  needAdmin();

  return (
    <PageTemplete
      title="운영"
      subtitle="Administration"
    >
      <Admin />
    </PageTemplete>
  );
}
