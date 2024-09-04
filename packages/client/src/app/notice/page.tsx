import Notice from "@Components/Notice/Notice";
import PageHeader from "@/Components/_commons/PageHeader";
import { noticeUrl } from "@depot/urls/notice";
export default function NoticePage() {
  return (
    <div>
      <PageHeader
        link_to_prop={noticeUrl}
        page_name={"공지사항"}
        sub_name="Notice"
      />
      <Notice />
    </div>
  );
}
