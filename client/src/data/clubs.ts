export interface IClubsType {
  id: string;
  name: string;
  logo: string;
  clubSite: string;
}

export const clubs: IClubsType[] = [
  {
    id: "arsenal",
    name: "Arsenal",
    logo: "/logos/Arsenal-FC-logo.png",
    clubSite: "https://www.arsenal.com/",
  },
  {
    id: "astonvilla",
    name: "Aston Villa",
    logo: "/logos/Aston-Villa-FC-logo.png",
    clubSite: "https://www.avfc.co.uk/",
  },
  {
    id: "bournemouth",
    name: "Bournemouth",
    logo: "/logos/AFC-Bournemouth-logo.png",
    clubSite: "https://www.afcb.co.uk/",
  },
  {
    id: "brentford",
    name: "Brentford",
    logo: "/logos/Brentford-FC-logo.png",
    clubSite: "https://www.brentfordfc.com/",
  },
  {
    id: "brighton",
    name: "Brighton",
    logo: "/logos/Brighton-Hove-Albion-logo.png",
    clubSite: "https://www.brightonandhovealbion.com/",
  },
  {
    id: "chelsea",
    name: "Chelsea",
    logo: "/logos/Chelsea-FC-logo.png",
    clubSite: "https://www.chelseafc.com/",
  },
  {
    id: "palace",
    name: "Crystal Palace",
    logo: "/logos/Crystal-Palace-FC-logo.png",
    clubSite: "https://www.cpfc.co.uk/",
  },
  {
    id: "everton",
    name: "Everton",
    logo: "/logos/Everton-FC-logo.png",
    clubSite: "https://www.evertonfc.com/",
  },
  {
    id: "fulham",
    name: "Fulham",
    logo: "/logos/Fulham-FC-logo.png",
    clubSite: "https://www.fulhamfc.com/",
  },
  {
    id: "ipswich",
    name: "Ipswich Town",
    logo: "/logos/Ipswich-Town-FC-logo.png",
    clubSite: "https://www.itfc.co.uk/",
  },
  {
    id: "leicester",
    name: "Leicester",
    logo: "/logos/Leicester-City-FC-logo.png",
    clubSite: "https://www.lcfc.com/",
  },
  {
    id: "liverpool",
    name: "Liverpool",
    logo: "/logos/Liverpool-FC-logo.png",
    clubSite: "https://www.liverpoolfc.com/",
  },
  {
    id: "mancity",
    name: "Manchester City",
    logo: "/logos/Manchester-City-FC-logo.png",
    clubSite: "https://www.mancity.com/",
  },
  {
    id: "manutd",
    name: "Manchester United",
    logo: "/logos/Manchester-United-FC-logo.png",
    clubSite: "https://www.manutd.com/",
  },
  {
    id: "newcastle",
    name: "Newcastle",
    logo: "/logos/Newcastle-United-logo.png",
    clubSite: "https://www.nufc.co.uk/",
  },
  {
    id: "forest",
    name: "Nottingham",
    logo: "/logos/Nottingham-Forest-FC-logo.png",
    clubSite: "https://www.nottinghamforest.co.uk/",
  },
  {
    id: "southampton",
    name: "Southampton",
    logo: "/logos/Southampton-FC-logo.png",
    clubSite: "https://www.southamptonfc.com/",
  },
  {
    id: "tottenham",
    name: "Tottenham",
    logo: "/logos/Tottenham-Hotspur-logo.png",
    clubSite: "https://www.tottenhamhotspur.com/",
  },
  {
    id: "westham",
    name: "West Ham",
    logo: "/logos/West-Ham-United-FC-logo.png",
    clubSite: "https://www.whufc.com/",
  },
  {
    id: "wolves",
    name: "Wolves",
    logo: "/logos/Wolverhampton-Wanderers-logo.png",
    clubSite: "https://www.wolves.co.uk/",
  },
];

// app/data/navigation.ts (Data file)
export const subNavItems = [
  "Home",
  "Fixtures",
  "Results",
  "Standings",
  "News",
  "Videos",
  "Clubs",
  "Players",
];
