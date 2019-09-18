import { EmitApp, Repo, Commit } from './typings';
import * as model from './model';
import * as api from './api';


/**
 * Filter function that, when used with Array.protoype.filter,
 * results in an array of distinct values.
 */
function onlyUnique(value: any, index: number, self: Array<any>) {
      return self.indexOf(value) === index;
}

/**
 * On receiving the latest commits for a repo, add the most recent
 * commit to the repo state.
 */
const onReceiveLatestCommits = function(
  app: EmitApp,
  data: any
) {
  app.setState((state, props) => {
    // NOTE: We should probably index repos by Id or associate the repo
    // array index with each repo object, to avoid indexOf.
    let ndx = state.entities.repos.indexOf(data.repo);

    state.entities.repos[ndx].latestCommit = (data.data[0] && data.data[0].commit) || {
      'author': {'name': 'test', 'date': 'now'},
      'message': 'This is a placeholder message.'
    };
    return state;
  });
}

/**
 * On requesting latest repo commits, fetch latest repo commits
 * and emit onReceiveLatestCommits event for each repo.
 */
const onRequestLatestCommits = function(
  app: EmitApp,
  repos: Array<Repo>
) {
  repos.forEach((repo) => {
    let onResp = (data: Array<Commit>) => {
      app.emit(onReceiveLatestCommits, { repo, data });
    }
    api.getLatestRepoCommits(repo, onResp, onResp);
  });
}

/**
 * On initializing state, set state view models.
 */
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

/**
 * On app mounting, fetch repos from application backend and trigger
 * app state initialization.
 */
const onAppMount = function(
  app: EmitApp,
  data: Array<Repo>
) {
  api.getRepos((data: Array<Repo>) => {
    app.emit(onInitState, data);
  }, console.error);
}

/**
 * On selecting a repo, update the repo state to reflect that it's selected.
 */
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

/**
 * On filtering by language, update the view-model state to reflect
 * the filtered subset of repos.
 */
const onFilterByLanguage = function(
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

export { onAppMount, onInitState, onSelectRepo, onFilterByLanguage };
