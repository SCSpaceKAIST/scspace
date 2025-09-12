import ArticleDetail from "@scspace-client/Components/pages/Article/Detail";

export default async function ArticleDetailPage({ params }: { params: Promise<{ id: number }> }) {
    const { id } = await params;

    return (
        <ArticleDetail id={id} />
    );
}
