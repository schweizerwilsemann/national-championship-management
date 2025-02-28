"use client";
import "@ant-design/v5-patch-for-react-19";
import "./globals.css";
import { ConfigProvider, App } from "antd";



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <body
      >
        <ConfigProvider>
          <App>
            {children}
          </App>
        </ConfigProvider>
      </body>
    </html>
  );
}
