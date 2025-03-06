"use client";
import "@ant-design/v5-patch-for-react-19";
import "./globals.css";
import { ConfigProvider, App } from "antd";
import { OngoingTourProvider } from "@/context/ongoing.tour.context";



export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <body
      >
        <ConfigProvider>
          <OngoingTourProvider>
            <App>
              {children}
            </App>
          </OngoingTourProvider>
        </ConfigProvider>
      </body>
    </html>
  );
}
