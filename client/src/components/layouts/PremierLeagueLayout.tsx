"use client"; // Đảm bảo đây là component client-side

import { usePathname } from "next/navigation";
import FooterComponent from "@/components/main/footer.component";
import ClubSiteComponent from "@/components/main/clubsite.component";
import SubnavNavigation from "@/components/main/subnav.component";
import HeaderComponent from "@/components/main/header.component";
import MainNavigation from "@/components/main/main.navigation.component";

const PremierLeagueLayout = ({ children }: { children: React.ReactNode }) => {
    const pathname = usePathname();
    const isHome = pathname === "/"; // Xác định đang ở trang Home hay không

    return (
        <>
            <div className="min-h-screen">
                {/* Header */}
                <div className="z-40 relative">
                    <HeaderComponent />
                </div>

                {/* Club sites */}
                <div className="z-40 relative">
                    <ClubSiteComponent />
                </div>

                {/* Main navigation */}
                <div className="z-40 relative">
                    <MainNavigation />
                </div>

                {/* Secondary navigation */}
                <div className={`sticky top-0 z-50 shadow-md ${isHome ? "bg-transparent" : "bg-white"}`}>
                    <SubnavNavigation />
                </div>

                {/* Nội dung chính */}
                <main>{children}</main>
            </div>

            {/* Footer */}
            <FooterComponent />
        </>
    );
};

export default PremierLeagueLayout;
