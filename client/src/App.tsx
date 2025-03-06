import React from 'react';
import { OngoingTourProvider } from '@/context/ongoing.tour.context';
import TournamentDropdown from '@/components/tournaments/tournament.dropdownlist';
// Import other components

const App = () => {
    return (
        <OngoingTourProvider>
            {/* Your application components */}
            <TournamentDropdown />
            {/* Other components */}
        </OngoingTourProvider>
    );
};

export default App; 