export const GROUPME =
    "https://groupme.com/join_group/117004171/tHApD8o9";

export const NAV = [
    { label: "Why", href: "#why" },
    { label: "What we do", href: "#what" },
    { label: "Nights", href: "#nights" },
    { label: "Play", href: "#play" },
] as const;

/** The weekly hour. Same room every Monday, both semesters. */
export const MEETING = {
    when: "Mondays, 5–6 PM",
    where: "Tom Bevill 1066",
    room: "Cyber Lab",
} as const;

export const STATS = [
    { v: "50", l: "at the first meeting, no email blast" },
    { v: "22", l: "Monday meetings a year" },
    { v: "8", l: "micro and mini hackathons" },
    { v: "2", l: "full hackathons, Oct and Feb" },
] as const;

export const PILLARS = [
    {
        n: "01",
        title: "Mentorship",
        body: "Near-peer teaching in two tracks. Beginners go from nothing to a deployed project; the advanced track covers infrastructure, agents, and systems.",
    },
    {
        n: "02",
        title: "Hackathons",
        body: "Sixty-minute micro sprints, one-to-two hour minis, and two full-day events. The short formats are what make the long ones survivable.",
    },
    {
        n: "03",
        title: "Community",
        body: "Architecture Teardown, Bug Bounty Night, Code Golf Night. Low-stakes evenings for members who are not in it to compete.",
    },
] as const;

/** Mondays rotate on three weeks, so a student who comes once a month still gets the full picture. */
export const RHYTHM = [
    { word: "Teach", body: "Peer-led, beginner and advanced tracks. Topics voted on monthly." },
    { word: "Build", body: "Micro-hackathon. Prompt on the hour, two-minute demos at the end, no prep." },
    { word: "Play", body: "A community night or an open project show-and-tell." },
] as const;

export const FORMATS = [
    { name: "Micro", length: "≤ 60 min", cadence: "Every third Monday", where: "Bevill 1066", scale: "20–40" },
    { name: "Mini", length: "1–2 hours", cadence: "2–3 a semester", where: "Bevill 1066 / The Cube", scale: "30–50" },
    { name: "Full", length: "12 hours", cadence: "Once a semester", where: "HM Comer / NERC", scale: "70–150" },
] as const;

/** Where the student software program is likely to land first. */
export const PROGRAM = [
    "Tooling for research groups",
    "Lab resource booking",
    "Data-collection interfaces",
    "Course and scheduling utilities",
    "Campus-life apps",
] as const;

/** The year, as members will see it. */
export const YEAR = [
    { month: "Sep 2026", title: "Stand it up", body: "First meeting, fifty students. A zero-cost micro-hackathon to prove the format." },
    { month: "Oct 2026", title: "HackBama_01", body: "Our first twelve-hour hackathon on the 17th. First mini-hackathon and peer-led mentorship session.", href: "/hackbama1" },
    { month: "Nov 2026", title: "Build the bench", body: "Architecture Teardown or Bug Bounty Night. Two more student mentors." },
    { month: "Dec 2026", title: "Demo Night", body: "Open to the Department. Five minutes per project." },
    { month: "Jan 2027", title: "Restart", body: "Get On Board Day. Two micro-hackathons and a mini." },
    { month: "Feb 2027", title: "HackBama II", body: "The second full hackathon. Around 150 builders and a regional track." },
    { month: "Mar 2027", title: "Pitch and partner", body: "A three-week pitch clinic. A mini-hackathon on a sponsor's prompt." },
    { month: "Apr 2027", title: "Showcase", body: "Spring Demo Night for the Department and invited employers." },
    { month: "May 2027", title: "Hand off", body: "A summer build group for members staying in Tuscaloosa." },
] as const;

export const NIGHTS = [
    "Code Golf Night",
    "Speed-Run a Landing Page",
    "Bug Bounty Night",
    "Architecture Teardown",
    "Prompt Engineering Battle",
    "UI Speed-Dating",
    "Roast My Setup",
    "Blind Coding",
    "Terminal RCM",
    "Documentation Roast",
    "Keyboard Modding Night",
    "Fireside Chat",
] as const;

export const TEACHES = [
    "Front-end and full-stack that people actually ship. React, Next.js, Svelte.",
    "Backends and APIs. Node, FastAPI, Supabase, Prisma.",
    "Directing AI instead of being replaced by it.",
    "Reading a job description and building straight at it.",
    "Hackathon strategy. Scope it, build it, pitch it, before the clock runs out.",
    "A GitHub and a portfolio that survive a recruiter's ten seconds.",
] as const;

export const OFFICERS = [
    { name: "Vedanta Somnathe", role: "President" },
    { name: "Faizan Khan", role: "Vice President" },
    { name: "Evan Gibson", role: "Treasurer" },
    { name: "Gina Kaiser", role: "Public Relations" },
    { name: "Tsion Shamsu", role: "Operations" },
    { name: "Dr. Pete Ludovice", role: "Faculty Advisor" },
    { name: "Dr. Yi Lin", role: "Faculty Advisor" },
] as const;

export const FOUNDING = [
    "Alex Gundrum",
    "Kori Russell",
    "Nikechukwu Okoronkwo",
] as const;

/** The wall in the game. Every one of these has been said out loud. */
export const EXCUSES = [
    "next semester",
    "after finals",
    "too busy",
    "not ready yet",
    "no team",
    "I'll watch first",
    "when I learn React",
    "no laptop",
    "too advanced",
    "after my internship",
    "next year",
    "maybe",
] as const;
