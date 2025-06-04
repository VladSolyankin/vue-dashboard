import type { Project, CommitActivity } from "../types/projects";

export const mockProjects: Project[] = [
  {
    id: 1,
    name: "SocialVibe",
    description: "Аналог социальной сети",
    technologies: ["React", "TypeScript", "TailwindCSS", "Firebase"],
    stars: 999,
    commits: 555,
    url: "https://socialvibe.vercel.app/login",
    contributors: 1,
    lastUpdate: "2024-03-15",
  },
  {
    id: 2,
    name: "Nuxt3 Chat",
    description: "Онлайн чат на Nuxt3 с использованием Socket.io",
    technologies: ["Nuxt3", "TypeScript", "Socket.io", "TailwindCSS"],
    stars: 0,
    commits: 111,
    url: "https://github.com/VladSolyankin/nuxt3_chat",
    contributors: 5,
    lastUpdate: "2024-03-20",
  },
  {
    id: 3,
    name: "MusicStream",
    description: "Музыкальный стриминговый сервис MusicStream",
    technologies: ["React", "TypeScript", "TailwindCSS", "Firebase"],
    stars: 0,
    commits: 184,
    url: "https://musicstream-react.web.app/",
    contributors: 4,
    lastUpdate: "2024-03-18",
  },
];

export const mockCommitActivity: CommitActivity[] = [
  { date: "2024-01", commits: 45 },
  { date: "2024-02", commits: 62 },
  { date: "2024-03", commits: 78 },
  { date: "2024-04", commits: 56 },
  { date: "2024-05", commits: 89 },
  { date: "2024-06", commits: 95 },
];
