import axios from "axios";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";


interface OngoingTournament {
  id: string;
  name: string;
}

interface OngoingTourContextType {
  ongoingTournament: OngoingTournament | null;
  loading: boolean;
  error: string | null;
}

// Initialize with default values to avoid undefined
const OngoingTourContext = createContext<OngoingTourContextType>({
  ongoingTournament: null,
  loading: true,
  error: null,
});

interface OngoingTourProviderProps {
  children: ReactNode;
}

export const OngoingTourProvider = ({ children }: OngoingTourProviderProps) => {
  const [ongoingTournament, setOngoingTournament] =
    useState<OngoingTournament | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOngoingTournament = async () => {
      try {
        // Fixed API URL path - removed environment variable prefix
        const response = await axios.get(
          `/api/v1/tournaments/epl/ongoing-tournament`
        ); // Fetch ongoing tournament data

        if (!response || !response.data) {
          return;
        }

        // Create an ongoing tournament object
        const ongoingTournamentData: OngoingTournament = {
          id: response.data.id,
          name: response.data.name,
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

  const value = {
    ongoingTournament,
    loading,
    error,
  };

  return (
    <OngoingTourContext.Provider value={value}>
      {children}
    </OngoingTourContext.Provider>
  );
};

export const useOngoingTour = (): OngoingTourContextType => {
  const context = useContext(OngoingTourContext);
  if (!context) {
    throw new Error(
      "useOngoingTour must be used within an OngoingTourProvider"
    );
  }
  return context;
};
