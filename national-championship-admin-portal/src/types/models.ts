// types/models.ts
export interface Tournament {
    id: string;
    name: string;
    status: 'UPCOMING' | 'ONGOING' | 'COMPLETED';
}

export interface Team {
    id: string;
    name: string;
    tournamentId?: string;
}

export interface Match {
    id: string;
    tournamentId: string;
    status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED';
}

export interface Player {
    id: string;
    name: string;
    age?: number;
}

export interface User {
    id: string;
    name: string;
    email: string;
    role: 'ADMIN' | 'USER';
}

export interface DashboardStats {
    tournaments: number;
    teams: number;
    matches: number;
    players: number;
}