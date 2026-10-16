/**
 * HackBama_01, Saturday October 17, 2026. Everything the event page says
 * lives here. Times are Central (CDT, UTC-5 on that date).
 */

export const REGISTER = "https://forms.gle/UFuFeUP9cd6p68th9";

/** Where teams submit at 5 PM. Until it is set, the page says it drops at the opening. */
export const DEVPOST: string | null = null;

export const MAPS =
    "https://www.google.com/maps/search/?api=1&query=HM+Comer+Hall,+245+7th+Avenue,+Tuscaloosa,+AL+35401";

export const CALENDAR =
    "https://calendar.google.com/calendar/render?action=TEMPLATE" +
    "&text=HackBama_01" +
    "&dates=20261017T123000Z/20261018T013000Z" +
    "&location=HM+Comer+Hall,+245+7th+Avenue,+Tuscaloosa,+AL+35401" +
    "&details=12-hour+hackathon.+Check+in+at+the+HM+Comer+entrance+at+7:30+AM.+hackbama.org/hackbama1";

export const DAY = "2026-10-17";
const OFFSET = "-05:00";

/** "HH:MM" on the day, as epoch ms. */
export function at(hhmm: string) {
    return Date.parse(`${DAY}T${hhmm}:00${OFFSET}`);
}

export const OPENS = "07:30";
export const CLOSES = "20:30";
export const SUBMIT = "17:00";
export const PROMPTS = "09:30";

export type Block = {
    n: string;
    from: string;
    to?: string;
    title: string;
    where: string;
    note: string;
    /** Which side of the trace it hangs off. Keeps neighbouring blocks apart. */
    lane: "up" | "down";
    key?: boolean;
};

export const SCHEDULE: Block[] = [
    {
        n: "01",
        from: "07:30",
        to: "09:00",
        title: "Check-in",
        where: "Front desk / foyer",
        note: "Badge, caffeine, and a team by 9 if you came without one.",
        lane: "up",
    },
    {
        n: "02",
        from: "09:00",
        to: "09:30",
        title: "Opening ceremony",
        where: "Main room",
        note: "Welcome, the two tracks, rules and judging. Prompts drop at 9:30.",
        lane: "down",
    },
    {
        n: "03",
        from: "09:30",
        to: "17:00",
        title: "Hacking",
        where: "Track rooms",
        note: "The clock starts. Officers and sponsor mentors roam all day.",
        lane: "up",
        key: true,
    },
    {
        n: "04",
        from: "12:00",
        title: "Lunch",
        where: "Foyer",
        note: "Grab it and get back to your laptop.",
        lane: "down",
    },
    {
        n: "05",
        from: "17:00",
        title: "Submission deadline",
        where: "Track rooms",
        note: "Code freeze. Everything on the manifest goes in before 5:00 PM.",
        lane: "down",
        key: true,
    },
    {
        n: "06",
        from: "17:30",
        to: "19:00",
        title: "Demos",
        where: "Track rooms",
        note: "Every team presents its project to the judges.",
        lane: "up",
    },
    {
        n: "07",
        from: "19:00",
        to: "19:30",
        title: "Judging",
        where: "Main room",
        note: "Judges deliberate.",
        lane: "down",
    },
    {
        n: "08",
        from: "19:30",
        to: "20:00",
        title: "Dinner",
        where: "Foyer",
        note: "Eat. Meet the sponsors.",
        lane: "up",
    },
    {
        n: "09",
        from: "20:00",
        to: "20:30",
        title: "Awards",
        where: "Main room",
        note: "Track winners, sponsor shout-outs, team photos.",
        lane: "down",
    },
];

export const VENUE = {
    name: "HM Comer Hall",
    street: "245 7th Avenue",
    city: "Tuscaloosa, AL 35401",
};

export const PARKING = [
    {
        name: "Student Center Parking Deck",
        street: "801 Campus Drive West",
        pay: "Pay at the gate",
        maps: "https://www.google.com/maps/search/?api=1&query=801+Campus+Drive+West,+Tuscaloosa,+AL+35401",
    },
    {
        name: "Student Center Parking Lot",
        street: "800 Campus Drive West",
        pay: "ParkMobile, zone 5152",
        maps: "https://www.google.com/maps/search/?api=1&query=800+Campus+Drive+West,+Tuscaloosa,+AL+35401",
    },
] as const;

export const RULES = [
    "Teams of 1 to 4.",
    "One track per team, named at submission.",
    "You must be 19 or older to receive a cash prize.",
    "All code is written on the day. Nothing starts before 9:30 AM.",
    "Submit by 5:00 PM or you can't demo.",
    "Demos run 3 to 5 minutes.",
    "Clean up your area before awards.",
] as const;

export type Track = {
    n: string;
    sponsor: string;
    total: string;
    /** 1st, 2nd, 3rd */
    prizes: [string, string, string];
    tone: "crimson" | "forest";
};

export const TRACKS: Track[] = [
    {
        n: "01",
        sponsor: "Styslinger College of Engineering",
        total: "$950",
        prizes: ["$500", "$300", "$150"],
        tone: "crimson",
    },
    {
        n: "02",
        sponsor: "UA EcoCAR",
        total: "$850",
        prizes: ["$450", "$250", "$150"],
        tone: "forest",
    },
];

export const MANIFEST = [
    "Team name",
    "Team members",
    "Project name",
    "Track",
    "Short project description",
    "GitHub or demo link",
] as const;

export type Sponsor = {
    name: string;
    /** File stem in public/hackbama1/sponsors/ (.svg, .png or .webp). */
    slug: string;
    track?: boolean;
};

export const SPONSORS: Sponsor[] = [
    { name: "Styslinger College of Engineering", slug: "coe", track: true },
    { name: "UA EcoCAR", slug: "ecocar", track: true },
    { name: "Major League Hacking", slug: "mlh" },
    { name: "Bama Dining", slug: "bama-dining" },
    { name: "Base44", slug: "base44" },
    { name: "RYSE", slug: "ryse" },
    { name: "Kind Patches", slug: "kind-patches" },
    { name: "DUDE Wipes", slug: "dude-wipes" },
];

export const FAQ = [
    {
        q: "Who can come?",
        a: "Any college student, from any school. Any major, any year, no experience bar. If you can open a laptop, you can ship something in twelve hours.",
    },
    {
        q: "Do I need a team?",
        a: "No. Teams are 1 to 4 people, and check-in (7:30 to 9:00) doubles as team formation. Come alone and leave with a team.",
    },
    {
        q: "Where do I go?",
        a: "HM Comer Hall, 245 7th Avenue. Check in at the front desk in the foyer. Opening, judging, and awards are in the main room; you build and demo in your track's room.",
    },
    {
        q: "How do the tracks work?",
        a: "Two tracks, one choice. Prompts stay sealed until 9:30 AM. Your team builds for one track and names it when you submit.",
    },
    {
        q: "Who can win cash?",
        a: "Anyone can place, but you must be 19 or older to receive a cash prize.",
    },
    {
        q: "How is it judged?",
        a: "Every team demos in its track room from 5:30 to 7:00. Rules and judging criteria are posted at the opening ceremony.",
    },
    {
        q: "What should I bring?",
        a: "A laptop, its charger, and a water bottle. We cover caffeine, snacks, lunch, and dinner.",
    },
];

export const ORGANIZERS = [
    { role: "President", name: "Vedanta Somnathe", email: "vpsomnathe@crimson.ua.edu" },
    { role: "Vice President", name: "Faizan Khan", email: "fkhan12@crimson.ua.edu" },
    { role: "Treasurer", name: "Evan Gibson", email: "ekgibson2@crimson.ua.edu" },
] as const;
