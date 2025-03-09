
import { Team } from '@/utilities/apis/teams/teams.api';
import TeamGrid from '@/components/teams/team.grid';  // Your team grid component

interface TeamsPageProps {
    teams: Team[];
    error?: string;
}

// The Page Component
export default function TeamsPage({ error }: TeamsPageProps) {
    if (error) {
        return <div>Error: {error}</div>;
    }

    return <TeamGrid />;
}