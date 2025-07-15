import PageTemplete from "@scspace-client/Components/pages/Layout/PageTemplete";
import ManageOrganization from "@scspace-client/Components/pages/Management/Organization";

export default function SpacePage() {
    return (
        <PageTemplete
            title={["관리", "조직"]}
            subtitle={["Management", "Organization"]}
        >
            <ManageOrganization />
        </PageTemplete>
    );
}