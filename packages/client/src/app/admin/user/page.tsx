import PageTemplete from "@scspace-client/Components/molecules/page/PageTemplete";
import ManageUser from "@scspace-client/Components/pages/Administration/ManageUser";

export default function SpacePage() {
    return (
        <PageTemplete
            title={["운영", "유저"]}
            subtitle={["Administration", "User"]}
        >
            <ManageUser />
        </PageTemplete>
    );
}
