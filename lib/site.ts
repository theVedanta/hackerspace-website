export const GROUPME =
    "";

export const NAV = [
    { label: "Why", href: "#why" },
    { label: "What we do", href: "#what" },
    { label: "Nights", href: "#nights" },
    { label: "Play", href: "#play" },
] as const;

type Meeting = {
    title: string;
    body: string;
    featured?: boolean;
};

/** Every third meeting is a Mini-Hackathon. */
export const CADENCE: Meeting[] = [
    {
        title: "Tool session",
        body: "An upperclassman who already uses the thing teaches it. Next.js, Copilot, whatever is actually in the job description this year.",
    },
    {
        title: "Skill night",
        body: "Take a real app apart on a whiteboard. Trade the one CLI alias that changed how you work. Lower stakes, same room.",
    },
    {
        title: "Mini-hackathon",
        body: "Two hours from scratch, or one hour with AI wide open. You leave with something that runs. That is the entire bar.",
        featured: true,
    },
];

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
    { name: "Professor Yi Lin", role: "Faculty Advisor" },
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
