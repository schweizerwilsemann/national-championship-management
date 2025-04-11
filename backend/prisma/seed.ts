import {
  PrismaClient,
  UserRole,
  TournamentStatus,
  PlayerPosition,
  MatchStatus,
  GoalType,
} from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Clean up existing data
  await prisma.$transaction([
    prisma.goal.deleteMany(),
    prisma.match.deleteMany(),
    prisma.player.deleteMany(),
    prisma.standing.deleteMany(),
    prisma.team.deleteMany(),
    prisma.tournament.deleteMany(),
    prisma.user.deleteMany(),
  ]);

  console.log('✓ Database cleaned');

  // Create users
  const hashedPassword = await bcrypt.hash('password123', 10);

  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@example.com',
      password: hashedPassword,
      name: 'Admin User',
      role: UserRole.ADMIN,
    },
  });

  const organizerUser = await prisma.user.create({
    data: {
      email: 'organizer@example.com',
      password: hashedPassword,
      name: 'Tournament Organizer',
      role: UserRole.ORGANIZER,
    },
  });

  const refereeUser = await prisma.user.create({
    data: {
      email: 'referee@example.com',
      password: hashedPassword,
      name: 'Match Referee',
      role: UserRole.REFEREE,
    },
  });

  const normalUser = await prisma.user.create({
    data: {
      email: 'user@example.com',
      password: hashedPassword,
      name: 'Football Fan',
      role: UserRole.USER,
    },
  });

  console.log('✓ Users created');

  // Create tournament
  const tournament = await prisma.tournament.create({
    data: {
      name: 'Premier League 2024/25',
      year: 2024,
      description:
        'The 33rd season of the Premier League, the top English professional league for association football clubs.',
      startDate: new Date('2024-08-16'),
      endDate: new Date('2025-05-25'),
      status: TournamentStatus.ONGOING,
      logo: 'https://logofiles.org/premier-league-logo.png',
    },
  });

  console.log('✓ Tournament created');

  // Create teams
  const teamsData = [
    {
      name: 'Arsenal',
      shortName: 'ARS',
      homeColor: '#EF0107',
      logo: 'arsenal.png',
    },
    {
      name: 'Aston Villa',
      shortName: 'AVL',
      homeColor: '#95BFE5',
      logo: 'aston-villa.png',
    },
    {
      name: 'Bournemouth',
      shortName: 'BOU',
      homeColor: '#DA291C',
      logo: 'bournemouth.png',
    },
    {
      name: 'Brentford',
      shortName: 'BRE',
      homeColor: '#E30613',
      logo: 'brentford.png',
    },
    {
      name: 'Brighton',
      shortName: 'BHA',
      homeColor: '#0057B8',
      logo: 'brighton.png',
    },
    {
      name: 'Chelsea',
      shortName: 'CHE',
      homeColor: '#034694',
      logo: 'chelsea.png',
    },
    {
      name: 'Crystal Palace',
      shortName: 'CRY',
      homeColor: '#1B458F',
      logo: 'crystal-palace.png',
    },
    {
      name: 'Everton',
      shortName: 'EVE',
      homeColor: '#003399',
      logo: 'everton.png',
    },
    {
      name: 'Fulham',
      shortName: 'FUL',
      homeColor: '#FFFFFF',
      logo: 'fulham.png',
    },
    {
      name: 'Liverpool',
      shortName: 'LIV',
      homeColor: '#C8102E',
      logo: 'liverpool.png',
    },
    {
      name: 'Manchester City',
      shortName: 'MCI',
      homeColor: '#6CABDD',
      logo: 'manchester-city.png',
    },
    {
      name: 'Manchester United',
      shortName: 'MUN',
      homeColor: '#DA291C',
      logo: 'manchester-united.png',
    },
    {
      name: 'Newcastle',
      shortName: 'NEW',
      homeColor: '#241F20',
      logo: 'newcastle.png',
    },
    {
      name: 'Nottingham Forest',
      shortName: 'NFO',
      homeColor: '#DD0000',
      logo: 'nottingham-forest.png',
    },
    {
      name: 'Southampton',
      shortName: 'SOU',
      homeColor: '#D71920',
      logo: 'southampton.png',
    },
    {
      name: 'Tottenham',
      shortName: 'TOT',
      homeColor: '#132257',
      logo: 'tottenham.png',
    },
    {
      name: 'West Ham',
      shortName: 'WHU',
      homeColor: '#7A263A',
      logo: 'west-ham.png',
    },
    {
      name: 'Wolves',
      shortName: 'WOL',
      homeColor: '#FDB913',
      logo: 'wolves.png',
    },
    {
      name: 'Leicester City',
      shortName: 'LEI',
      homeColor: '#003090',
      logo: 'leicester.png',
    },
    {
      name: 'Ipswich Town',
      shortName: 'IPS',
      homeColor: '#0044A7',
      logo: 'ipswich.png',
    },
  ];

  const teams = await Promise.all(
    teamsData.map((team) =>
      prisma.team.create({
        data: {
          ...team,
          tournamentId: tournament.id,
        },
      }),
    ),
  );

  console.log('✓ Teams created');

  // Create players (sample for 2 teams)
  const positions = [
    PlayerPosition.GOALKEEPER,
    PlayerPosition.DEFENDER,
    PlayerPosition.MIDFIELDER,
    PlayerPosition.FORWARD,
  ];

  // Create Arsenal players
  const arsenalPlayers = [
    {
      name: 'Aaron Ramsdale',
      number: 1,
      position: PlayerPosition.GOALKEEPER,
      birthDate: new Date('1998-05-14'),
      nationality: 'England',
    },
    {
      name: 'William Saliba',
      number: 2,
      position: PlayerPosition.DEFENDER,
      birthDate: new Date('2001-03-24'),
      nationality: 'France',
    },
    {
      name: 'Ben White',
      number: 4,
      position: PlayerPosition.DEFENDER,
      birthDate: new Date('1997-10-08'),
      nationality: 'England',
    },
    {
      name: 'Gabriel',
      number: 6,
      position: PlayerPosition.DEFENDER,
      birthDate: new Date('1997-12-19'),
      nationality: 'Brazil',
    },
    {
      name: 'Thomas Partey',
      number: 5,
      position: PlayerPosition.MIDFIELDER,
      birthDate: new Date('1993-06-13'),
      nationality: 'Ghana',
    },
    {
      name: 'Bukayo Saka',
      number: 7,
      position: PlayerPosition.MIDFIELDER,
      birthDate: new Date('2001-09-05'),
      nationality: 'England',
    },
    {
      name: 'Martin Ødegaard',
      number: 8,
      position: PlayerPosition.MIDFIELDER,
      birthDate: new Date('1998-12-17'),
      nationality: 'Norway',
    },
    {
      name: 'Declan Rice',
      number: 41,
      position: PlayerPosition.MIDFIELDER,
      birthDate: new Date('1999-01-14'),
      nationality: 'England',
    },
    {
      name: 'Gabriel Martinelli',
      number: 11,
      position: PlayerPosition.FORWARD,
      birthDate: new Date('2001-06-18'),
      nationality: 'Brazil',
    },
    {
      name: 'Gabriel Jesus',
      number: 9,
      position: PlayerPosition.FORWARD,
      birthDate: new Date('1997-04-03'),
      nationality: 'Brazil',
    },
    {
      name: 'Kai Havertz',
      number: 29,
      position: PlayerPosition.FORWARD,
      birthDate: new Date('1999-06-11'),
      nationality: 'Germany',
    },
  ];

  // Create Liverpool players
  const liverpoolPlayers = [
    {
      name: 'Alisson',
      number: 1,
      position: PlayerPosition.GOALKEEPER,
      birthDate: new Date('1992-10-02'),
      nationality: 'Brazil',
    },
    {
      name: 'Virgil van Dijk',
      number: 4,
      position: PlayerPosition.DEFENDER,
      birthDate: new Date('1991-07-08'),
      nationality: 'Netherlands',
    },
    {
      name: 'Ibrahima Konaté',
      number: 5,
      position: PlayerPosition.DEFENDER,
      birthDate: new Date('1999-05-25'),
      nationality: 'France',
    },
    {
      name: 'Trent Alexander-Arnold',
      number: 66,
      position: PlayerPosition.DEFENDER,
      birthDate: new Date('1998-10-07'),
      nationality: 'England',
    },
    {
      name: 'Andy Robertson',
      number: 26,
      position: PlayerPosition.DEFENDER,
      birthDate: new Date('1994-03-11'),
      nationality: 'Scotland',
    },
    {
      name: 'Dominik Szoboszlai',
      number: 8,
      position: PlayerPosition.MIDFIELDER,
      birthDate: new Date('2000-10-25'),
      nationality: 'Hungary',
    },
    {
      name: 'Alexis Mac Allister',
      number: 10,
      position: PlayerPosition.MIDFIELDER,
      birthDate: new Date('1998-12-24'),
      nationality: 'Argentina',
    },
    {
      name: 'Ryan Gravenberch',
      number: 38,
      position: PlayerPosition.MIDFIELDER,
      birthDate: new Date('2002-05-16'),
      nationality: 'Netherlands',
    },
    {
      name: 'Mohamed Salah',
      number: 11,
      position: PlayerPosition.FORWARD,
      birthDate: new Date('1992-06-15'),
      nationality: 'Egypt',
    },
    {
      name: 'Luis Díaz',
      number: 7,
      position: PlayerPosition.FORWARD,
      birthDate: new Date('1997-01-13'),
      nationality: 'Colombia',
    },
    {
      name: 'Darwin Núñez',
      number: 9,
      position: PlayerPosition.FORWARD,
      birthDate: new Date('1999-06-24'),
      nationality: 'Uruguay',
    },
  ];

  // Create players for Arsenal
  await Promise.all(
    arsenalPlayers.map((player) =>
      prisma.player.create({
        data: {
          ...player,
          teamId: teams[0].id, // Arsenal
        },
      }),
    ),
  );

  // Create players for Liverpool
  await Promise.all(
    liverpoolPlayers.map((player) =>
      prisma.player.create({
        data: {
          ...player,
          teamId: teams[9].id, // Liverpool
        },
      }),
    ),
  );

  // Create players for remaining teams
  for (let i = 1; i < teams.length; i++) {
    if (i !== 9) {
      // Skip Liverpool which is already created
      const teamPlayers: {
        name: string;
        number: number;
        position: PlayerPosition;
        birthDate: Date;
        nationality: string;
        teamId: string;
      }[] = [];

      // Create 2 goalkeepers
      for (let j = 1; j <= 2; j++) {
        teamPlayers.push({
          name: `${teams[i].name} Goalkeeper ${j}`,
          number: j,
          position: PlayerPosition.GOALKEEPER,
          birthDate: new Date(1990 + j, 0, j),
          nationality: 'England',
          teamId: teams[i].id,
        });
      }

      // Create 5 defenders
      for (let j = 3; j <= 7; j++) {
        teamPlayers.push({
          name: `${teams[i].name} Defender ${j - 2}`,
          number: j,
          position: PlayerPosition.DEFENDER,
          birthDate: new Date(1990 + j, 0, j),
          nationality: 'England',
          teamId: teams[i].id,
        });
      }

      // Create 5 midfielders
      for (let j = 8; j <= 12; j++) {
        teamPlayers.push({
          name: `${teams[i].name} Midfielder ${j - 7}`,
          number: j,
          position: PlayerPosition.MIDFIELDER,
          birthDate: new Date(1990 + j, 0, j),
          nationality: 'England',
          teamId: teams[i].id,
        });
      }

      // Create 4 forwards
      for (let j = 13; j <= 16; j++) {
        teamPlayers.push({
          name: `${teams[i].name} Forward ${j - 12}`,
          number: j,
          position: PlayerPosition.FORWARD,
          birthDate: new Date(1990 + j, 0, j),
          nationality: 'England',
          teamId: teams[i].id,
        });
      }

      await Promise.all(
        teamPlayers.map((player) =>
          prisma.player.create({
            data: player,
          }),
        ),
      );
    }
  }

  console.log('✓ Players created');

  // Create standings
  const standingsData = teams.map((team, index) => ({
    teamId: team.id,
    tournamentId: tournament.id,
    position: index + 1,
    played: Math.floor(Math.random() * 10),
    won: Math.floor(Math.random() * 7),
    drawn: Math.floor(Math.random() * 3),
    lost: Math.floor(Math.random() * 4),
  }));

  // Calculate additional stats based on wins/draws/losses
  const standings = await Promise.all(
    standingsData.map((standing) => {
      const goalsFor = standing.won * 2 + standing.drawn;
      const goalsAgainst = standing.lost * 2 + standing.drawn;

      return prisma.standing.create({
        data: {
          ...standing,
          goalsFor,
          goalsAgainst,
          goalDifference: goalsFor - goalsAgainst,
          points: standing.won * 3 + standing.drawn,
          form: generateForm(standing.won, standing.drawn, standing.lost),
        },
      });
    }),
  );

  console.log('✓ Standings created');

  // Create matches in the database
  const createdMatches: {
    id: string;
    tournamentId: string;
    matchday: number;
    homeTeamId: string;
    awayTeamId: string;
    date: Date;
    time: string;
    status: MatchStatus;
    homeScore?: number;
    awayScore?: number;
  }[] = [];

  const totalTeams = teams.length;
  const totalRounds = totalTeams - 1;

  // Generate matches for the tournament
  for (let round = 1; round <= totalRounds; round++) {
    for (let i = 0; i < totalTeams / 2; i++) {
      const home = (round + i) % (totalTeams - 1);
      let away = (totalTeams - 1 - i + round) % (totalTeams - 1);

      // Last team stays in the same position
      if (i === 0) {
        away = totalTeams - 1;
      }

      const matchDate = new Date(tournament.startDate);
      matchDate.setDate(matchDate.getDate() + (round - 1) * 7);

      const homeTeamId = teams[home].id;
      const awayTeamId = teams[away].id;

      const match = await prisma.match.create({
        data: {
          id: uuidv4(),
          tournamentId: tournament.id,
          matchday: round,
          homeTeamId,
          awayTeamId,
          date: matchDate,
          time: `${15 + Math.floor(Math.random() * 7)}:${Math.random() > 0.5 ? '00' : '30'}`,
          status: MatchStatus.FINISHED,
          homeScore: Math.floor(Math.random() * 5),
          awayScore: Math.floor(Math.random() * 5),
        },
      });
      //@ts-ignore
      createdMatches.push(match);
    }
  }

  // Create goals for finished matches
  const goals: {
    matchId: string;
    scorerId: string;
    minute: number;
    type: GoalType;
    isOwnGoal: boolean;
    isPenalty: boolean;
  }[] = [];

  for (const match of createdMatches) {
    const homeGoals = match.homeScore ?? 0;
    const awayGoals = match.awayScore ?? 0;

    // Get players from home team
    const homePlayers = await prisma.player.findMany({
      where: { teamId: match.homeTeamId, position: PlayerPosition.FORWARD },
    });

    // Create goals for home team
    for (let i = 0; i < homeGoals; i++) {
      const randomPlayer =
        homePlayers[Math.floor(Math.random() * homePlayers.length)];
      goals.push({
        matchId: match.id,
        scorerId: randomPlayer.id,
        minute: Math.floor(Math.random() * 90) + 1,
        type: Math.random() > 0.8 ? GoalType.PENALTY : GoalType.NORMAL,
        isOwnGoal: false,
        isPenalty: Math.random() > 0.8,
      });
    }

    // Get players from away team
    const awayPlayers = await prisma.player.findMany({
      where: { teamId: match.awayTeamId, position: PlayerPosition.FORWARD },
    });

    // Create goals for away team
    for (let i = 0; i < awayGoals; i++) {
      const randomPlayer =
        awayPlayers[Math.floor(Math.random() * awayPlayers.length)];
      goals.push({
        matchId: match.id,
        scorerId: randomPlayer.id,
        minute: Math.floor(Math.random() * 90) + 1,
        type: Math.random() > 0.8 ? GoalType.HEADER : GoalType.NORMAL,
        isOwnGoal: false,
        isPenalty: Math.random() > 0.8,
      });
    }
  }

  // Insert goals into the database
  await Promise.all(
    goals.map((goal) =>
      prisma.goal.create({
        data: goal,
      }),
    ),
  );

  console.log('✓ Matches and Goals created');
  console.log('🌱 Database seeding completed!');
}

// Helper function to generate random form (e.g., "WDLWW")
function generateForm(wins: number, draws: number, losses: number): string {
  const results: ('W' | 'D' | 'L')[] = [];

  for (let i = 0; i < wins; i++) {
    results.push('W');
  }

  for (let i = 0; i < draws; i++) {
    results.push('D');
  }

  for (let i = 0; i < losses; i++) {
    results.push('L');
  }

  // Shuffle the results
  for (let i = results.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [results[i], results[j]] = [results[j], results[i]];
  }

  // Return last 5 results or all if less than 5
  return results.slice(0, Math.min(5, results.length)).join('');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

/// =====================================================================================>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
// others entity data

// import { PrismaClient, MatchStatus, Prisma } from '@prisma/client';

// const prisma = new PrismaClient();

// async function main() {
//   // Get existing tournaments, teams to link the matches to
//   const tournaments = await prisma.tournament.findMany();

//   if (tournaments.length === 0) {
//     console.log('No tournaments found. Please create tournaments first.');
//     return;
//   }

//   // Create matches for each tournament
//   for (const tournament of tournaments) {
//     // Get teams for this tournament
//     const teams = await prisma.team.findMany({
//       where: { tournamentId: tournament.id },
//     });

//     if (teams.length < 2) {
//       console.log(
//         `Tournament ${tournament.name} has fewer than 2 teams. Skipping...`,
//       );
//       continue;
//     }

//     // Calculate the total number of matches in a round-robin format
//     const totalMatches = (teams.length * (teams.length - 1)) / 2;

//     // Create matches with different statuses
//     const matches: Prisma.MatchCreateInput[] = [];

//     // Helper function to get random teams (ensuring home != away)
//     const getRandomTeamPair = () => {
//       const homeIndex = Math.floor(Math.random() * teams.length);
//       let awayIndex;
//       do {
//         awayIndex = Math.floor(Math.random() * teams.length);
//       } while (awayIndex === homeIndex);

//       return {
//         homeTeam: { connect: { id: teams[homeIndex].id } },
//         awayTeam: { connect: { id: teams[awayIndex].id } },
//       };
//     };

//     // Create SCHEDULED matches (40% of total)
//     const scheduledCount = Math.floor(totalMatches * 0.4);
//     for (let i = 0; i < scheduledCount; i++) {
//       const teamPair = getRandomTeamPair();
//       const startDate = new Date(tournament.startDate);
//       const endDate = new Date(tournament.endDate);

//       // Random date between start and end dates
//       const matchDate = new Date(
//         startDate.getTime() +
//         Math.random() * (endDate.getTime() - startDate.getTime()),
//       );

//       // Format hours and minutes as HH:MM
//       const hours = Math.floor(Math.random() * 12) + 12; // Between 12:00 and 23:59
//       const minutes = [0, 15, 30, 45][Math.floor(Math.random() * 4)]; // 00, 15, 30, or 45
//       const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

//       matches.push({
//         tournament: { connect: { id: tournament.id } },
//         ...teamPair,
//         matchday: Math.floor(Math.random() * 38) + 1, // Assuming a season has up to 38 matchdays
//         date: matchDate,
//         time: timeString,
//         status: MatchStatus.SCHEDULED,
//       });
//     }

//     // Create POSTPONED matches (30% of total)
//     const postponedCount = Math.floor(totalMatches * 0.3);
//     for (let i = 0; i < postponedCount; i++) {
//       const teamPair = getRandomTeamPair();
//       const startDate = new Date(tournament.startDate);
//       const endDate = new Date(tournament.endDate);

//       // Random date between start and end dates
//       const matchDate = new Date(
//         startDate.getTime() +
//         Math.random() * (endDate.getTime() - startDate.getTime()),
//       );

//       // Format hours and minutes as HH:MM
//       const hours = Math.floor(Math.random() * 12) + 12;
//       const minutes = [0, 15, 30, 45][Math.floor(Math.random() * 4)];
//       const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

//       matches.push({
//         tournament: { connect: { id: tournament.id } },
//         ...teamPair,
//         matchday: Math.floor(Math.random() * 38) + 1,
//         date: matchDate,
//         time: timeString,
//         status: MatchStatus.POSTPONED,
//       });
//     }

//     // Create CANCELLED matches (30% of total)
//     const cancelledCount = Math.floor(totalMatches * 0.3);
//     for (let i = 0; i < cancelledCount; i++) {
//       const teamPair = getRandomTeamPair();
//       const startDate = new Date(tournament.startDate);
//       const endDate = new Date(tournament.endDate);

//       // Random date between start and end dates
//       const matchDate = new Date(
//         startDate.getTime() +
//         Math.random() * (endDate.getTime() - startDate.getTime()),
//       );

//       // Format hours and minutes as HH:MM
//       const hours = Math.floor(Math.random() * 12) + 12;
//       const minutes = [0, 15, 30, 45][Math.floor(Math.random() * 4)];
//       const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

//       matches.push({
//         tournament: { connect: { id: tournament.id } },
//         ...teamPair,
//         matchday: Math.floor(Math.random() * 38) + 1,
//         date: matchDate,
//         time: timeString,
//         status: MatchStatus.CANCELLED,
//       });
//     }

//     // Create matches in database
//     console.log(
//       `Creating ${matches.length} matches for tournament: ${tournament.name}`,
//     );

//     for (const match of matches) {
//       await prisma.match.create({
//         data: match,
//       });
//     }

//     console.log(
//       `Successfully created matches for tournament: ${tournament.name}`,
//     );
//   }
// }

// main()
//   .catch((e) => {
//     console.error(e);
//     process.exit(1);
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });
