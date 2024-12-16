import { Inter } from "next/font/google";
import "./globals.css";
import ReduxProvider from "@/store/ReduxProvider";
import Script from 'next/script'
import { AntdRegistry } from '@ant-design/nextjs-registry';
import {ConfigProvider} from 'antd'

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Top Review Expert"
};

const theme = {
  token: {
    colorPrimary: '#22c55d', // Primary color
    colorLink: '#1DA57A', // Link color
    colorSuccess: '#52c41a', // Success color
    colorWarning: '#faad14', // Warning color
    colorError: '#f5222d', // Error color
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
          <head>
        {/* Google Tag Manager */}
        <Script
          id="gtm-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-MMP8D9DZ');`
          }}
        />
        {/* End Google Tag Manager */}
      </head>
      <body className={inter.className}>
         {/* Google Tag Manager (noscript) */}
        <noscript
          dangerouslySetInnerHTML={{
            __html: `<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-MMP8D9DZ"
              height="0" width="0" style="display:none;visibility:hidden"></iframe>`
          }}
        />
        {/* End Google Tag Manager (noscript) */}
        <ReduxProvider> <AntdRegistry >  <ConfigProvider theme={theme}>{children}</ConfigProvider></AntdRegistry></ReduxProvider>
      </body>
    </html>
  );
}
