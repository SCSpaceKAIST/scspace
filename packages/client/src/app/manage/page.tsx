"use client";

import Management from "@scspace-client/Components/pages/Management";
import { useAuth } from "@scspace-client/Hooks/auth";
import PageTemplete from "@scspace-client/Components/pages/Layout/PageTemplete";

export default function SpacePage() {
  const { needManager: needAdmin } = useAuth();
  needAdmin();

  return (
    <PageTemplete
      title="관리"
      subtitle="Management"
    >
      <Management />
    </PageTemplete>
  );
}
