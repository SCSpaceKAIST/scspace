import PageTemplete from "@scspace-client/Components/_commons/PageTemplete";
import Rules from "@scspace-client/Components/About/Rules";

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