export interface Author extends Object {
  name: string;
  date: string;
}

export interface Commit extends Object {
  author: Author;
  message: string;
}

export interface Repo extends Object {
  id: number;
  selected: boolean;
  name: string;
  full_name: string;
  description: string;
  language: string;
  forks_count: number;
  latestCommit: Commit
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

export interface EmitApp extends React.Component<Object, AppState> {
  emit: Function;
}
