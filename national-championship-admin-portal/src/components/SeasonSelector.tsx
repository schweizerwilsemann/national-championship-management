import { useEffect, useState } from 'react';
import { useSeason } from '../context/season.context';
import { useOngoingTour } from '../context/ongoing.tournament.context';

interface Season {
    id: string;
    name: string;
    year: number;
    status: string;
}

export function SeasonSelector() {
    const { seasons, currentSeason, setCurrentSeason, loading } = useSeason();
    const { ongoingTournament } = useOngoingTour();
    const [selected, setSelected] = useState<Season | null>(currentSeason);

    useEffect(() => {
        if (currentSeason) {
            setSelected(currentSeason);
        }
    }, [currentSeason]);

    if (loading || !currentSeason) {
        return (
            <div className="w-48 h-10 bg-gray-200 animate-pulse rounded-md"></div>
        );
    }

    const handleSeasonChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedId = e.target.value;
        const season = seasons.find(s => s.id === selectedId) || null;
        if (season) {
            setSelected(season);
            setCurrentSeason(season);
        }
    };

    // Get the appropriate styling based on status
    const getSelectStyle = () => {
        if (!selected) return '';

        switch (selected.status) {
            case 'ONGOING':
                return 'border-green-400 text-green-700';
            case 'PREPARING':
                return 'border-blue-400 text-blue-700';
            case 'COMPLETED':
                return 'border-gray-400 text-gray-700';
            default:
                return 'border-gray-300 text-gray-700';
        }
    };

    // Get badge styles
    const getBadgeStyle = () => {
        if (!selected) return '';

        switch (selected.status) {
            case 'ONGOING':
                return 'bg-green-100 text-green-800 border border-green-200';
            case 'PREPARING':
                return 'bg-blue-100 text-blue-800 border border-blue-200';
            case 'COMPLETED':
                return 'bg-gray-100 text-gray-800 border border-gray-200';
            default:
                return 'bg-gray-100 text-gray-800 border border-gray-200';
        }
    };

    return (
        <div className="flex items-center">
            <div className="relative">
                <select
                    value={selected?.id || ''}
                    onChange={handleSeasonChange}
                    className={`appearance-none bg-white border py-1.5 px-3 pr-8 rounded-md leading-tight focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 text-sm font-medium min-w-[220px] ${getSelectStyle()}`}
                >
                    {seasons.map((season) => {
                        const isOngoing = ongoingTournament?.id === season.id;
                        return (
                            <option
                                key={season.id}
                                value={season.id}
                                className={isOngoing ? 'font-bold' : ''}
                            >
                                {season.name} {isOngoing ? '(current)' : ''}
                            </option>
                        );
                    })}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                </div>
            </div>
            {selected && (
                <span className={`ml-2 inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${getBadgeStyle()}`}>
                    {selected.status.toLowerCase()}
                </span>
            )}
        </div>
    );
} 