import PageTemplete from "@scspace-client/Components/molecules/page/PageTemplete";
import ManageRental from "@scspace-client/Components/pages/Management/Rental";

export default function SpacePage() {
    return (
        <PageTemplete
            title={["관리", "대여"]}
            subtitle={["Management", "Rental"]}
        >
            <ManageRental />
        </PageTemplete>
    );
}