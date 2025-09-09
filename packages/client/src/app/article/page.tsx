import PageTemplete from "@scspace-client/Components/molecules/page/PageTemplete";
import Article from "@scspace-client/Components/pages/Article";

export default function ArticlePage() {
    return (
        <PageTemplete
            title="게시판"
            subtitle="Article"
        >
            <Article />
        </PageTemplete>
    );
}
