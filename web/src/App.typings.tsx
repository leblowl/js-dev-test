export interface Repo extends Object {
  id: number;
  selected: boolean;
  name: string;
  description: string;
  language: string;
  forks_count: number;
}

export interface AppState extends Object {
  repos: Array<Repo>;
}

