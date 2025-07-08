import PageTemplete from "@scspace-client/Components/pages/layouts/PageTemplete";
import SSOLogin from "@scspace-client/Components/pages/Login";

export default function LoginPage() {
  return (
    <PageTemplete
      title="개인정보처리방침"
      subtitle="Privacy Policy"
    >
      <SSOLogin />
    </PageTemplete>
  );
}

