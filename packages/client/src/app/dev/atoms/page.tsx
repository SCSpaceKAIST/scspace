import PageTemplete from "@scspace-client/Components/pages/Layout/PageTemplete";
import Atoms from "@scspace-client/Components/pages/Development/Atoms";

export default function SpacePage() {
    return (
        <PageTemplete
            title={["개발", "Atoms"]}
            subtitle={["Development", "Components"]}
        >
            <Atoms />
        </PageTemplete>
    );
}
