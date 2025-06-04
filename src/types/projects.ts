export interface Project {
  id: number;
  name: string;
  description: string;
  technologies: string[];
  stars: number;
  commits: number;
  url: string;
  contributors: number;
  lastUpdate: string;
}

export interface CommitActivity {
  date: string;
  commits: number;
}
