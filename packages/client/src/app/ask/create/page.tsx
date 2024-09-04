"use client"; // 클라이언트 컴포넌트로 지정

import PageHeader from "@/Components/_commons/PageHeader";
import AskCreate from "@/Components/Ask/AskCreate";
import { useLoginCheck } from "@/Hooks/useLoginCheck";

export default function NoticeCreatePage() {
  const { needLogin } = useLoginCheck();
  needLogin();
  return (
    <div>
      <PageHeader
        link_to_prop={"/ask"}
        page_name={"문의사항 작성"}
        sub_name={"Ask"}
        parent_name="문의사항"
      />
      <AskCreate />
    </div>
  );
}
