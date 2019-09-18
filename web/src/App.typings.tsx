export interface Repo extends Object {
  id: number;
  selected: boolean;
  name: string;
  description: string;
  language: string;
  forks_count: number;
}

export interface Entities extends Object {
  repos: Array<Repo>;
}

export interface RepoListVM extends Object {
  languages: Array<string>;
  languageSelected: string;
  repos: Array<Repo>;
}

export interface AppState extends Object {
  entities: Entities;
  repoList: RepoListVM;
}

