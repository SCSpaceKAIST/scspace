"use client";

import { useAuth } from "@scspace-client/Hooks/auth";
import PageTemplete from "@scspace-client/Components/pages/Layout/PageTemplete";
import Development from "@scspace-client/Components/pages/Development";

export default function SpacePage() {
  const { needAdmin } = useAuth();
  // needAdmin();

  return (
    <PageTemplete
      title="개발"
      subtitle="Development"
    >
      <Development />
    </PageTemplete>
  );
}
