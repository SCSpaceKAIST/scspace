"use client";

import { useAuth } from "@scspace-client/Hooks/auth";
import PageTemplete from "@scspace-client/Components/pages/Layout/PageTemplete";
import Administration from "@scspace-client/Components/pages/Administration";

export default function SpacePage() {
  const { needAdmin } = useAuth();
  needAdmin();

  return (
    <PageTemplete
      title="운영"
      subtitle="Administration"
    >
      <Administration />
    </PageTemplete>
  );
}
