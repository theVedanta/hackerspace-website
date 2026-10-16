import { REGISTER } from "@/lib/hackbama1";
import { FOUNDING, GROUPME, MEETING, NIGHTS, OFFICERS, PROGRAM, TEACHES } from "@/lib/site";

/**
 * Everything the Quad can teach you, one card per lit spot. The order here is
 * the order in the journal; the map decides where each one stands.
 */
export type StationId =
    | "door"
    | "board"
    | "clock"
    | "sign"
    | "circle"
    | "chat"
    | "room";

export type StationContent = {
    id: StationId;
    /** What you see from a distance, before you know what it is. */
    hint: string;
    /** Label that floats over the spot once you are close. */
    label: string;
    title: string;
    body: string[];
    list?: readonly string[];
    people?: readonly { name: string; role: string }[];
    /** The first link is the loud one. Internal links (starting with /) open in place. */
    links?: { label: string; href: string }[];
};

export const STATIONS: StationContent[] = [
    {
        id: "door",
        hint: "A door standing alone on the lawn, with light behind it.",
        label: "A door",
        title: "Nobody is missing talent. They are missing a door.",
        body: [
            "Every fall, students arrive curious. They hear about hackathons, open source, the people shipping things at 2am. Then they wait, because nobody told them what the first step looks like.",
            "HackBama is that step: a build, hackathon, pitch, and software-engineering club at The University of Alabama. One room, one hour a week, one thing that runs by the end of it.",
        ],
    },
    {
        id: "board",
        hint: "A whiteboard, still covered in someone's diagram.",
        label: "The whiteboard",
        title: "Taught by students who did it eighteen months ago.",
        body: [
            "Near-peer teaching in two tracks. Beginners go from nothing to a deployed project. The advanced track covers infrastructure, agents, and systems. Members vote on the topics every month.",
        ],
        list: TEACHES,
    },
    {
        id: "clock",
        hint: "A clock on a pole, counting down to something.",
        label: "HackBama_01",
        title: "Twelve hours. Saturday, October 17.",
        body: [
            "HackBama_01 is our first full hackathon: 7:30 AM to 8:30 PM at HM Comer Hall. Two sponsor tracks from the College of Engineering and UA EcoCAR, $1,800 in prizes, teams of one to four formed on site.",
            "No experience bar. Open to college students from anywhere. The only thing you need by 8 PM is a working demo.",
        ],
        links: [
            { label: "Register", href: REGISTER },
            { label: "See the event", href: "/hackbama1" },
        ],
    },
    {
        id: "sign",
        hint: "An LED sign scrolling names of nights.",
        label: "The marquee",
        title: "Teach. Build. Play. Repeat.",
        body: [
            `${MEETING.when} in ${MEETING.where}. Mondays rotate on three weeks: a peer-led lesson, a sixty-minute micro-hackathon with two-minute demos, then a community night. Come once a month and you still get the whole picture.`,
            "Every sprint runs in one of two modes: unassisted, or AI-permitted at half the time. Alternating them is the point.",
        ],
        list: NIGHTS,
    },
    {
        id: "circle",
        hint: "A ring of people around one glowing laptop.",
        label: "The circle",
        title: "Software the University actually uses.",
        body: [
            "The big goal this year: campus utilities built by students, for students, faculty, and staff, that outlive the cohort that wrote them. Some start with a faculty member who has a real problem. Others start with us.",
            "Either way, a team of two to four scopes it, builds it, and keeps it running. Two pilots this fall, live with real users by spring.",
        ],
        list: PROGRAM,
    },
    {
        id: "chat",
        hint: "A kiosk with a swarm of dots around it.",
        label: "The group chat",
        title: "Fifty students came to the first meeting. Nobody sent an email blast.",
        body: [
            "Seventy joined the group chat before the club was allowed to exist, and six volunteered to mentor before anyone asked. Now it is a registered student organization in the Department of Computer Science.",
            `With founding members ${FOUNDING[0]}, ${FOUNDING[1]}, and ${FOUNDING[2]}.`,
        ],
        people: OFFICERS,
    },
    {
        id: "room",
        hint: "The building at the top of the Quad. One window is on.",
        label: "The room",
        title: "Build something.",
        body: [
            `No application, no experience bar, no dues. Freshmen welcome. ${MEETING.when}, ${MEETING.room}, ${MEETING.where}. Come to one and decide from there.`,
            "Or start big at HackBama_01, our first twelve-hour hackathon.",
        ],
        links: [
            { label: "Join the GroupMe", href: GROUPME },
            { label: "HackBama_01", href: "/hackbama1" },
        ],
    },
];

/** The six spots that light the tower. The room is the destination, not a light. */
export const LIGHT_IDS: StationId[] = ["door", "board", "clock", "sign", "circle", "chat"];

export const LEVELS = [
    "Lurker",
    "Curious",
    "Showed up",
    "Builder",
    "Shipper",
    "Regular",
    "Member",
] as const;

export function stationById(id: StationId) {
    return STATIONS.find((s) => s.id === id)!;
}
