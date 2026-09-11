import { GROUPME, NIGHTS, OFFICERS, FOUNDING, TEACHES } from "@/lib/site";

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
    cta?: { label: string; href: string };
};

export const STATIONS: StationContent[] = [
    {
        id: "door",
        hint: "A door standing alone on the lawn, with light behind it.",
        label: "A door",
        title: "Nobody is missing talent. They are missing a door.",
        body: [
            "Every fall, students arrive curious. They hear about hackathons, open source, the people shipping things at 2am. Then they wait, because nobody told them what the first step looks like.",
            "So we made the first step small. One room, one evening, one thing that runs by the end of it.",
        ],
    },
    {
        id: "board",
        hint: "A whiteboard, still covered in someone's diagram.",
        label: "The whiteboard",
        title: "Twice a month, somebody teaches the thing they actually use.",
        body: [
            "Tool session: an upperclassman who already uses the thing teaches it. Next.js, Copilot, whatever is actually in the job description this year.",
            "Skill night: take a real app apart on a whiteboard. Trade the one CLI alias that changed how you work. Lower stakes, same room.",
        ],
    },
    {
        id: "clock",
        hint: "A clock on a pole, counting down from two hours.",
        label: "The clock",
        title: "Every third meeting, a clock.",
        body: [
            "Mini-hackathon. Two hours from scratch, or one hour with AI wide open. You leave with something that runs. That is the entire bar.",
            "The students who have already shipped something are the ones who show up to the real hackathon in spring.",
        ],
    },
    {
        id: "sign",
        hint: "An LED sign scrolling names of nights.",
        label: "The marquee",
        title: "The rest of the calendar is not a lecture.",
        body: [
            "A rotating set of nights built so that showing up alone is never awkward.",
        ],
        list: NIGHTS,
    },
    {
        id: "circle",
        hint: "A ring of people around one glowing laptop.",
        label: "The circle",
        title: "Taught by students who did it eighteen months ago.",
        body: [
            "Not a professor two decades from their last standup. Upperclassmen with hackathon placements and finished internships, in the same room, building alongside you.",
        ],
        list: TEACHES,
    },
    {
        id: "chat",
        hint: "A kiosk with a swarm of dots around it.",
        label: "The group chat",
        title: "Seventy students joined the group chat before this club was allowed to exist.",
        body: [
            "Six of them volunteered to mentor. Nobody asked them to. That is the whole argument for why HackBama should be here.",
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
            "No application, no experience bar, no dues. Freshmen welcome. Come to one night and decide from there.",
        ],
        cta: { label: "Join the GroupMe", href: GROUPME },
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
