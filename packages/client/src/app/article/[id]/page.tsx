import PageTemplete from "@scspace-client/Components/molecules/page/PageTemplete";
import ArticleDetail from "@scspace-client/Components/pages/Article/Detail";

export default async function ArticleDetailPage({ params }: { params: Promise<{ id: number }> }) {
    const { id } = await params;

    return (
        <PageTemplete
            title={["게시판", "상세보기"]}
            subtitle={["Article", "Detail"]}
        >
            <ArticleDetail id={id} />
        </PageTemplete>
    );
}
