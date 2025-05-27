import PageTemplete from "@scspace-client/Components/_commons/PageTemplete";
import Scspace from "@scspace-client/Components/About/Scspace";

export default function SpacePage() {
    return (
        <PageTemplete
            title={["찾아보기", "공간위"]}
            subtitle={["About", "SCSpace"]}
        >
            <Scspace />
        </PageTemplete>
    );
}