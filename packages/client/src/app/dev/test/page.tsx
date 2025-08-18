import PageTemplete from "@scspace-client/Components/molecules/page/PageTemplete";
import TestPage from "@scspace-client/Components/pages/Development/Test";

export default function SpacePage() {
    return (
        <PageTemplete
            title={["개발", "Test"]}
            subtitle={["Development", "Test"]}
        >
            <TestPage />
        </PageTemplete>
    );
}
