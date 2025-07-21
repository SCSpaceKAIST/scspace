import PageTemplete from "@scspace-client/Components/molecules/page/PageTemplete";
import ManageReservation from "@scspace-client/Components/pages/Management/Reservation";

export default function SpacePage() {
    return (
        <PageTemplete
            title={["관리", "예약"]}
            subtitle={["Management", "Reservation"]}
        >
            <ManageReservation />
        </PageTemplete>
    );
}