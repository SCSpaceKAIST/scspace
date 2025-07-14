import PageTemplete from "@scspace-client/Components/pages/Layout/PageTemplete";
import Scspace from "@scspace-client/Components/organisms/About/Scspace";

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