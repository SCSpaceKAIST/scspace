"use client";

import Manage from "@scspace-client/Components/Manage/Manage";
import { useLoginCheck } from "@scspace-client/APIs/auth/useLoginCheck";
import PageTemplete from "@scspace-client/Components/_commons/PageTemplete";

export default function SpacePage() {
  const { needAdmin } = useLoginCheck();
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
