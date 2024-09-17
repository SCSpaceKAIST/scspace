"use client";

import Manage from "@/Components/Manage/Manage";
import PageHeader from "@/Components/_commons/PageHeader";
import { useLoginCheck } from "@/Hooks/useLoginCheck";

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
