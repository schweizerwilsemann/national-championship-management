import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Premier League teams data with detailed information
const teamsData = [
    {
        name: 'Arsenal',
        stadium: 'Emirates Stadium',
        address: 'Highbury House, 75 Drayton Park, London, N5 1BU',
        city: 'London',
        country: 'England',
        founded: 1886,
        website: 'www.arsenal.com',
        description: 'Arsenal Football Club is a professional football club based in Islington, London, England. Arsenal plays in the Premier League, the top flight of English football.',
    },
    {
        name: 'Aston Villa',
        stadium: 'Villa Park',
        address: 'Villa Park, Trinity Road, Birmingham, B6 6HE',
        city: 'Birmingham',
        country: 'England',
        founded: 1874,
        website: 'www.avfc.co.uk',
        description: 'Aston Villa Football Club is a professional football club based in Aston, Birmingham, England. The club competes in the Premier League, the top tier of the English football league system.',
    },
    {
        name: 'Bournemouth',
        stadium: 'Vitality Stadium',
        address: 'Dean Court, Kings Park, Bournemouth, BH7 7AF',
        city: 'Bournemouth',
        country: 'England',
        founded: 1899,
        website: 'www.afcb.co.uk',
        description: 'AFC Bournemouth is a professional football club based in Kings Park, Boscombe, a suburb of Bournemouth, Dorset, England.',
    },
    {
        name: 'Brentford',
        stadium: 'Gtech Community Stadium',
        address: 'Lionel Road South, Brentford, TW8 0RU',
        city: 'London',
        country: 'England',
        founded: 1889,
        website: 'www.brentfordfc.com',
        description: 'Brentford Football Club is a professional football club based in Brentford, West London, England. They compete in the Premier League, the highest tier of English football.',
    },
    {
        name: 'Brighton',
        stadium: 'Amex Stadium',
        address: 'American Express Community Stadium, Village Way, Brighton, BN1 9BL',
        city: 'Brighton',
        country: 'England',
        founded: 1901,
        website: 'www.brightonandhovealbion.com',
        description: 'Brighton & Hove Albion Football Club, commonly referred to simply as Brighton, is an English professional football club based in the city of Brighton and Hove.',
    },
    {
        name: 'Chelsea',
        stadium: 'Stamford Bridge',
        address: 'Stamford Bridge, Fulham Road, London, SW6 1HS',
        city: 'London',
        country: 'England',
        founded: 1905,
        website: 'www.chelseafc.com',
        description: 'Chelsea Football Club is an English professional football club based in Fulham, West London. Founded in 1905, they compete in the Premier League, the top division of English football.',
    },
    {
        name: 'Crystal Palace',
        stadium: 'Selhurst Park',
        address: 'Selhurst Park, Whitehorse Lane, London, SE25 6PU',
        city: 'London',
        country: 'England',
        founded: 1905,
        website: 'www.cpfc.co.uk',
        description: 'Crystal Palace Football Club is a professional football club based in Selhurst in the Borough of Croydon, South London, England.',
    },
    {
        name: 'Everton',
        stadium: 'Goodison Park',
        address: 'Goodison Park, Goodison Road, Liverpool, L4 4EL',
        city: 'Liverpool',
        country: 'England',
        founded: 1878,
        website: 'www.evertonfc.com',
        description: 'Everton Football Club is an English professional football club based in Liverpool that competes in the Premier League, the top tier of English football.',
    },
    {
        name: 'Fulham',
        stadium: 'Craven Cottage',
        address: 'Craven Cottage, Stevenage Road, London, SW6 6HH',
        city: 'London',
        country: 'England',
        founded: 1879,
        website: 'www.fulhamfc.com',
        description: 'Fulham Football Club is an English professional football club based in Fulham, London. They compete in the Premier League, the highest tier of English football.',
    },
    {
        name: 'Liverpool',
        stadium: 'Anfield',
        address: 'Anfield, Anfield Road, Liverpool, L4 0TH',
        city: 'Liverpool',
        country: 'England',
        founded: 1892,
        website: 'www.liverpoolfc.com',
        description: 'Liverpool Football Club is a professional football club based in Liverpool, England. The club competes in the Premier League, the top tier of English football.',
    },
    {
        name: 'Manchester City',
        stadium: 'Etihad Stadium',
        address: 'Etihad Stadium, Etihad Campus, Manchester, M11 3FF',
        city: 'Manchester',
        country: 'England',
        founded: 1880,
        website: 'www.mancity.com',
        description: 'Manchester City Football Club is an English football club based in Manchester that competes in the Premier League, the top flight of English football.',
    },
    {
        name: 'Manchester United',
        stadium: 'Old Trafford',
        address: 'Sir Matt Busby Way, Old Trafford, Manchester, M16 0RA',
        city: 'Manchester',
        country: 'England',
        founded: 1878,
        website: 'www.manutd.com',
        description: 'Manchester United Football Club, commonly referred to as Man United, is a professional football club based in Old Trafford, Greater Manchester, England.',
    },
    {
        name: 'Newcastle',
        stadium: "St James' Park",
        address: "St James' Park, Barrack Road, Newcastle upon Tyne, NE1 4ST",
        city: 'Newcastle',
        country: 'England',
        founded: 1892,
        website: 'www.nufc.co.uk',
        description: 'Newcastle United Football Club is an English professional football club based in Newcastle upon Tyne, that plays in the Premier League.',
    },
    {
        name: 'Nottingham Forest',
        stadium: 'City Ground',
        address: 'The City Ground, Pavilion Road, Nottingham, NG2 5FJ',
        city: 'Nottingham',
        country: 'England',
        founded: 1865,
        website: 'www.nottinghamforest.co.uk',
        description: 'Nottingham Forest Football Club is an English professional football club based in West Bridgford, Nottingham.',
    },
    {
        name: 'Southampton',
        stadium: "St Mary's Stadium",
        address: "St Mary's Stadium, Britannia Road, Southampton, SO14 5FP",
        city: 'Southampton',
        country: 'England',
        founded: 1885,
        website: 'www.southamptonfc.com',
        description: 'Southampton Football Club is an English professional football club based in Southampton, Hampshire, that competes in the Premier League.',
    },
    {
        name: 'Tottenham',
        stadium: 'Tottenham Hotspur Stadium',
        address: 'Tottenham Hotspur Stadium, 782 High Road, London, N17 0BX',
        city: 'London',
        country: 'England',
        founded: 1882,
        website: 'www.tottenhamhotspur.com',
        description: 'Tottenham Hotspur Football Club, commonly referred to as Tottenham or Spurs, is a professional football club based in Tottenham, London, England.',
    },
    {
        name: 'West Ham',
        stadium: 'London Stadium',
        address: 'London Stadium, Queen Elizabeth Olympic Park, London, E20 2ST',
        city: 'London',
        country: 'England',
        founded: 1895,
        website: 'www.whufc.com',
        description: 'West Ham United Football Club is an English professional football club based in Stratford, East London that compete in the Premier League.',
    },
    {
        name: 'Wolves',
        stadium: 'Molineux Stadium',
        address: 'Molineux Stadium, Waterloo Road, Wolverhampton, WV1 4QR',
        city: 'Wolverhampton',
        country: 'England',
        founded: 1877,
        website: 'www.wolves.co.uk',
        description: 'Wolverhampton Wanderers Football Club, commonly known as Wolves, is a professional football club based in Wolverhampton, West Midlands, England.',
    },
    {
        name: 'Leicester City',
        stadium: 'King Power Stadium',
        address: 'King Power Stadium, Filbert Way, Leicester, LE2 7FL',
        city: 'Leicester',
        country: 'England',
        founded: 1884,
        website: 'www.lcfc.com',
        description: 'Leicester City Football Club is an English professional football club based in Leicester in the East Midlands, England.',
    },
    {
        name: 'Ipswich Town',
        stadium: 'Portman Road',
        address: 'Portman Road, Ipswich, IP1 2DA',
        city: 'Ipswich',
        country: 'England',
        founded: 1878,
        website: 'www.itfc.co.uk',
        description: 'Ipswich Town Football Club is a professional football club based in Ipswich, Suffolk, England.',
    }
];

async function updateTeams() {
    try {
        console.log('⏳ Starting to update team information...');

        // Get all teams from database
        const teams = await prisma.team.findMany();
        console.log(`Found ${teams.length} teams in the database`);

        // Update each team with additional data
        for (const teamData of teamsData) {
            const team = teams.find(t => t.name === teamData.name);

            if (team) {
                console.log(`Updating ${teamData.name}...`);
                await prisma.team.update({
                    where: { id: team.id },
                    data: {
                        stadium: teamData.stadium,
                        address: teamData.address,
                        city: teamData.city,
                        country: teamData.country,
                        founded: teamData.founded,
                        website: teamData.website,
                        description: teamData.description,
                    }
                });
                console.log(`✅ Updated ${teamData.name}`);
            } else {
                console.log(`⚠️ Team ${teamData.name} not found in database`);
            }
        }

        console.log('✨ Team information update completed!');
    } catch (error) {
        console.error('Error updating teams:', error);
    } finally {
        await prisma.$disconnect();
    }
}

// Run the update
updateTeams(); 