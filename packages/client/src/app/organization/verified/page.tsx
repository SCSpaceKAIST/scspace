import PageTemplete from "@scspace-client/Components/pages/Layout/PageTemplete";
import VerifiedOrganization from "@scspace-client/Components/pages/Organization/Verified";

export default function SpacePage() {
    return (
        <PageTemplete
            title={["조직", "인증된 조직"]}
            subtitle={["Organization", "Verified Organization"]}
        >
            <VerifiedOrganization />
        </PageTemplete>
    );
}
