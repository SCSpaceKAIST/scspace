import PageTemplete from "@scspace-client/Components/templates/PageTemplete";
import Rules from "@scspace-client/Components/organisms/About/Rules";

export default function SpacePage() {
    return (
        <PageTemplete
            title={["찾아보기", "세칙"]}
            subtitle={["About", "Rules"]}
        >
            <Rules />
        </PageTemplete>
    );
}