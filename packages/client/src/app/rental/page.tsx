import PageTemplete from "@scspace-client/Components/molecules/page/PageTemplete";
import Rental from "@scspace-client/Components/pages/Rental";

export default function SpacePage() {
    return (
        <PageTemplete
            title="대여"
            subtitle="Rental"
        >
            <Rental />
        </PageTemplete>
    );
}
