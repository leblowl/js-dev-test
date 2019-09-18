import { EmitApp, Repo, Commit } from './typings';
import * as model from './model';
import * as request from '../util/request';


function onlyUnique(value: any, index: number, self: Array<any>) {
      return self.indexOf(value) === index;
}

const repoCommitUrl = function(repo: Repo) {
  return `https://api.github.com/repos/${repo.full_name}/commits`;
}

const onReceiveLatestCommits = function(
  app: EmitApp,
  data: any
) {
  app.setState((state, props) => {
    let ndx = state.entities.repos.indexOf(data.repo);

    state.entities.repos[ndx].latestCommit = (data.data[0] && data.data[0].commit) || {
      'author': {'name': 'test', 'date': 'now'},
      'message': 'This is a placeholder message for when Github unblocks me'
    };
    return state;
  });
}

const getLatestRepoCommit = function(repo: Repo, onLoad: Function, onErr: Function) {
  request.get(repoCommitUrl(repo), onLoad, onErr);
}

const onRequestLatestCommits = function(
  app: EmitApp,
  repos: Array<Repo>
) {
  repos.forEach((repo) => {
    let onResp = (data: Array<Commit>) => {
      app.emit(onReceiveLatestCommits, { repo, data });
    }
    getLatestRepoCommit(repo, onResp, onResp);
  });
}

const onInitState = function(
  app: EmitApp,
  data: Array<Repo>
) {
  app.setState((state, props) => {
    state.entities.repos = data;
    state.repoList.repos = state.entities.repos;

    let uniqueLanguages = [model.ANY_LANGUAGE].concat(state.entities.repos.map(
      (x) => x.language).filter(onlyUnique));
    state.repoList.languages = uniqueLanguages;

    return state;
  }, () => app.emit(onRequestLatestCommits, app.state.entities.repos));
}

const reposUrl = 'http://localhost:4000/repos';

const getRepos = function(onLoad: Function, onErr: Function) {
  request.get(reposUrl, onLoad, onErr);
}

const onAppMount = function(
  app: EmitApp,
  data: Array<Repo>
) {
  getRepos((data: Array<Repo>) => {
    app.emit(onInitState, data);
  }, console.error);
}

const onSelectRepo = function(
  app: EmitApp,
  id: number
) {
  app.setState((state, props) => {
    state.repoList.repos = state.entities.repos.map((x) => {
      if (x.id === id) {
        x.selected = !x.selected;
        return x;
      } else {
        return x;
      }});
    return state;
  });
}

const onSortByLanguage = function(
  app: EmitApp,
  language: string
) {
  app.setState((state, props) => {
    if (language === model.ANY_LANGUAGE) {
      state.repoList.repos = state.entities.repos;
    } else {
      state.repoList.repos = state.entities.repos.filter((x) => {
        return x.language === language;
      })
    }
    state.repoList.languageSelected = language;
    return state;
  });
}

export { reposUrl, getRepos, getLatestRepoCommit, onAppMount, onInitState, onSelectRepo, onSortByLanguage };
