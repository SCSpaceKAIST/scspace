"use client";

import { useAuth } from "@scspace-client/Hooks/auth";
import PageTemplete from "@scspace-client/Components/atoms/PageTemplete";
import Admin from "@scspace-client/Components/templates/Admin";

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
