import "./globals.css";
import "../../static/vendor/bootstrap/css/bootstrap.min.css";
import "../../static/vendor/bootstrap-icons/bootstrap-icons.css";
import "../../static/vendor/aos/aos.css";
import "../../static/vendor/glightbox/css/glightbox.min.css";
import "../../static/vendor/swiper/swiper-bundle.min.css";
import "../../static/css/variables.css";
import "../../static/css/main.css";
import { Header } from "@Components/Header";
import { ReactNode } from "react";
import Footer from "@Components/Footer";

export const metadata = {
  title: "학생문화공간위원회",
  description: "학생문화공간위원회 웹사이트",
  generateViewport: {
    width: "device-width",
    initialScale: 1.0,
    maximumScale: 1.0,
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <link rel="shortcut icon" href="/img/Favicon.svg" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&family=Poppins:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&family=Source+Sans+Pro:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400;1,600;1,700&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          type="text/css"
          href="https://cdn3.devexpress.com/jslib/22.1.4/css/dx.common.css"
        />
        <link
          rel="stylesheet"
          type="text/css"
          href="https://cdn3.devexpress.com/jslib/22.1.4/css/dx.light.css"
        />
      </head>
      <body>
        <Header></Header>
        <div style={{ padding: "20px", margin: "100px" }}>
          {children} {/* children이 여기에 렌더링됩니다 */}
        </div>
        <Footer></Footer>
      </body>
    </html>
  );
}
