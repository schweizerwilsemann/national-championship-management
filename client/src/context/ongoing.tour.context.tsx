"use client"

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { getOngoingPremierLeagueTournament } from '@/utilities/apis/tournaments/get.ongoing.EPL.tournament'; // Adjust the import based on your API utility

interface Match {
    id: string;
    homeTeam: {
        name: string;
    };
    awayTeam: {
        name: string;
    };
    homeScore: number;
    awayScore: number;
    date: string; // Ensure this matches the expected format
    time: string;
}

interface OngoingTournament {
    id: string;
    name: string;
}

interface OngoingTourContextType {
    ongoingTournament: OngoingTournament | null;
    loading: boolean;
    error: string | null;
}

const OngoingTourContext = createContext<OngoingTourContextType | undefined>(undefined);

export const OngoingTourProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [ongoingTournament, setOngoingTournament] = useState<OngoingTournament | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchOngoingTournament = async () => {
            try {
                const response = await getOngoingPremierLeagueTournament(); // Fetch ongoing tournament data
                if (!response) {
                    return;
                }
                // Create an ongoing tournament object
                const ongoingTournamentData: OngoingTournament = {
                    id: response.id, // Assuming response has an id
                    name: response.name
                };

                setOngoingTournament(ongoingTournamentData); // Set the structured ongoing tournament
            } catch (err) {
                setError("Failed to load ongoing tournament");
            } finally {
                setLoading(false);
            }
        };

        fetchOngoingTournament();
    }, []);

    return (
        <OngoingTourContext.Provider value={{ ongoingTournament, loading, error }}>
            {children}
        </OngoingTourContext.Provider>
    );
};

export const useOngoingTour = () => {
    const context = useContext(OngoingTourContext);
    if (context === undefined) {
        throw new Error('useOngoingTour must be used within an OngoingTourProvider');
    }
    return context;
};
