
import FooterComponent from '@/components/main/footer.component';
import ClubSiteComponent from '@/components/main/clubsite.component';
import SubnavNavigation from '@/components/main/subnav.component';
import HeaderComponent from '@/components/main/header.component';
import MainNavigation from '@/components/main/main.navigation.component';


const PremierLeagueLayout = ({ children }: { children: React.ReactNode }) => {

    return (
        <>
            <div className="min-h-screen bg-white">
                <HeaderComponent />

                {/* Club sites */}
                <ClubSiteComponent />

                {/* Main navigation */}
                <MainNavigation />

                {/* Secondary navigation */}
                <SubnavNavigation />

                {/* Main content area */}
                <main className="container mx-auto px-4">
                    <div className="mt-8">{children}</div> {/* Render nội dung trang con */}
                </main>
            </div>
            {/* Footer */}
            <FooterComponent />
        </>
    );
}



export default PremierLeagueLayout