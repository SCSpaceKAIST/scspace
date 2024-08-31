"use client"; // 클라이언트 컴포넌트로 지정

import PageHeader from "@/Components/_commons/PageHeader";
import { useParams } from "next/navigation"; // useParams를 사용하여 동적 라우팅 파라미터를 가져옴
import NoticeView from "@/Components/Notice/NoticeView";

export default function AskPage() {
  const params = useParams();
  const id = params.id; // URL의 [id] 부분을 가져옴

  return (
    <div>
      <PageHeader
        link_to_prop={"/notice"}
        page_name={"공지사항"}
        sub_name={"Notice"}
      />
      <NoticeView view_id={id as string} />
      {/* id가 string으로 타입 변환 */}
    </div>
  );
}
