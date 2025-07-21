import PageTemplete from "@scspace-client/Components/molecules/page/PageTemplete";
import Scspace from "@scspace-client/Components/pages/Browse/Scspace";

export default function SpacePage() {
    return (
        <PageTemplete
            title={["찾아보기", "공간위"]}
            subtitle={["Browse", "SCSpace"]}
        >
            <Scspace />
        </PageTemplete>
    );
}