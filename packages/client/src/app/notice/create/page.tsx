"use client"; // 클라이언트 컴포넌트로 지정

import PageHeader from "@/Components/_commons/PageHeader";
import NoticeCreate from "@/Components/Notice/NoticeCreate";
import { useLoginCheck } from "@/Hooks/useLoginCheck";

export default function NoticeCreatePage() {
  const { needAdmin } = useLoginCheck();
  needAdmin();
  return (
    <div>
      <PageHeader
        link_to_prop={"/notice"}
        page_name={"공지사항 작성"}
        sub_name={"Notice"}
        parent_name="공지사항"
      />
      <NoticeCreate />
    </div>
  );
}
