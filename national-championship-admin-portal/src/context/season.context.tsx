import axios from "axios";
import {
    createContext,
    useContext,
    useEffect,
    useState,
    ReactNode,
} from "react";
import { useOngoingTour } from "./ongoing.tournament.context";

interface Season {
    id: string;
    name: string;
    year: number;
    status: string;
}

interface SeasonContextType {
    seasons: Season[];
    currentSeason: Season | null;
    setCurrentSeason: (season: Season) => void;
    loading: boolean;
    error: string | null;
}

// Initialize with default values to avoid undefined
const SeasonContext = createContext<SeasonContextType>({
    seasons: [],
    currentSeason: null,
    setCurrentSeason: () => { },
    loading: true,
    error: null,
});

interface SeasonProviderProps {
    children: ReactNode;
}

export const SeasonProvider = ({ children }: SeasonProviderProps) => {
    const [seasons, setSeasons] = useState<Season[]>([]);
    const [currentSeason, setCurrentSeason] = useState<Season | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const { ongoingTournament, loading: ongoingLoading } = useOngoingTour();

    useEffect(() => {
        const fetchSeasons = async () => {
            try {
                // Get all tournaments from the API
                const response = await axios.get(`/api/v1/tournaments`);

                if (!response || !response.data) {
                    return;
                }

                // Format tournaments as seasons
                const seasonsData: Season[] = response.data.map((tournament: any) => ({
                    id: tournament.id,
                    name: tournament.name,
                    year: tournament.year,
                    status: tournament.status
                }));

                setSeasons(seasonsData);

                // If ongoing tournament context has data, use that as the default
                if (ongoingTournament && !ongoingLoading) {
                    const ongoingSeason: Season = {
                        id: ongoingTournament.id,
                        name: ongoingTournament.name,
                        year: seasonsData.find(s => s.id === ongoingTournament.id)?.year || 0,
                        status: seasonsData.find(s => s.id === ongoingTournament.id)?.status || "ONGOING"
                    };
                    setCurrentSeason(ongoingSeason);
                } else {
                    // Get the ongoing tournament to set as default
                    const ongoingResponse = await axios.get(
                        `/api/v1/tournaments/epl/ongoing-tournament`
                    );

                    if (ongoingResponse && ongoingResponse.data) {
                        const ongoingSeason: Season = {
                            id: ongoingResponse.data.id,
                            name: ongoingResponse.data.name,
                            year: ongoingResponse.data.year,
                            status: ongoingResponse.data.status
                        };
                        setCurrentSeason(ongoingSeason);
                    } else if (seasonsData.length > 0) {
                        // If no ongoing season, set the most recent one
                        setCurrentSeason(seasonsData[0]); // Assuming they're sorted by date desc
                    }
                }
            } catch (err) {
                setError("Failed to load seasons");
            } finally {
                setLoading(false);
            }
        };

        fetchSeasons();
    }, [ongoingTournament, ongoingLoading]);

    const value = {
        seasons,
        currentSeason,
        setCurrentSeason,
        loading,
        error,
    };

    return (
        <SeasonContext.Provider value={value}>
            {children}
        </SeasonContext.Provider>
    );
};

export const useSeason = (): SeasonContextType => {
    const context = useContext(SeasonContext);
    if (!context) {
        throw new Error(
            "useSeason must be used within a SeasonProvider"
        );
    }
    return context;
}; 