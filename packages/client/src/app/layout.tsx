import "./globals.css";
import "../../static/css/main.css";
import Header from "@scspace-client/Components/organisms/Header";
import { ReactNode } from "react";
import Providers from "./providers";
import { Box, Grid, } from "@chakra-ui/react";
import ToasterComponent from "@scspace-client/Components/atoms/Toaster";

export const metadata = {
  title: "KAIST SCSpace",
  description: "Website for KAIST Student Curture and Space Commitee",
};

export const viewport = {
  width: "device-width",
  initialScale: 1.0,
  maximumScale: 1.0,
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
        <Providers>
          <ToasterComponent />
          <Grid
            width="100svw"
            maxHeight="100svh"
            height="100svh"
            direction="column"
            templateRows="auto 1fr"
          >
            <Header />
            <Box
              flexGrow={1}
              px={6}
              py={4}
              scrollbar="hidden"
              overflowY="hidden"
              scrollBehavior="smooth"
              bg="bg.subtle"
            >
              {children}
            </Box>
          </Grid>
        </Providers>
      </body>
    </html>
  );
}
