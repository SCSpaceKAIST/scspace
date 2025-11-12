import PageTemplete from "@scspace-client/Components/molecules/page/PageTemplete";
import Archive from "@scspace-client/Components/pages/Browse/Archive";

export default function SpacePage() {
    return (
        <PageTemplete
            title={["찾아보기", "자료실"]}
            subtitle={["Browse", "Archive"]}
        >
            <Archive />
        </PageTemplete>
    );
}