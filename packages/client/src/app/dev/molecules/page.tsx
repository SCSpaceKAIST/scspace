import PageTemplete from "@scspace-client/Components/pages/Layout/PageTemplete";
import Molecules from "@scspace-client/Components/pages/Development/Molecules";

export default function SpacePage() {
    return (
        <PageTemplete
            title={["개발", "Molecules"]}
            subtitle={["Development", "Components"]}
        >
            <Molecules />
        </PageTemplete>
    );
}
