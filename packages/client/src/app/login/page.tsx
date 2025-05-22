import PageTemplete from "@scspace-client/Components/_commons/PageTemplete";
import SSOLogin from "@scspace-client/Components/PrivacyPolicy/PrivacyPolicy";

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

