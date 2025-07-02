"use client";

import Manage from "@scspace-client/Components/Manage/Manage";
import { useAuth } from "@scspace-client/Hooks/auth";
import PageTemplete from "@scspace-client/Components/_commons/PageTemplete";

export default function SpacePage() {
  const { needManager: needAdmin } = useAuth();
  needAdmin();

  return (
    <PageTemplete
      title="관리"
      subtitle="Management"
    >
      <Manage />
    </PageTemplete>
  );
}
