import PageTemplete from "@scspace-client/Components/molecules/page/PageTemplete";
import Rules from "@scspace-client/Components/pages/Browse/Rules";

export default function SpacePage() {
    return (
        <PageTemplete
            title={["찾아보기", "세칙"]}
            subtitle={["Browse", "Rules"]}
        >
            <Rules />
        </PageTemplete>
    );
}