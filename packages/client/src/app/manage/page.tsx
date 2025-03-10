"use client";

import Manage from "@scspace-client/Components/Manage/Manage";
import PageHeader from "@scspace-client/Components/_commons/PageHeader";
import { useLoginCheck } from "@scspace-client/Hooks/useLoginCheck";

export default function SpacePage() {
  const { needAdmin } = useLoginCheck();
  needAdmin();

  return (
    <div>
      <PageHeader
        link_to_prop={"/manage"}
        page_name={"관리"}
        sub_name="Manage"
      />
      <Manage />
    </div>
  );
}
