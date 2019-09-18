import { AppState, Repo } from './typings';


function onlyUnique(value: any, index: number, self: Array<any>) {
      return self.indexOf(value) === index;
}

const onInitState = function(
  app: React.Component<Object, AppState>,
  data: Array<Repo>
) {
  app.setState((state, props) => {
    state.entities.repos = data;
    state.repoList.repos = state.entities.repos;
    state.repoList.languages = [ANY_LANGUAGE].concat(state.entities.repos.map(
      (x) => x.language).filter(onlyUnique));
    return state;
  });
}

const onSelectRepo = function(
  app: React.Component<Object, AppState>,
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

const ANY_LANGUAGE = 'Any';

const onSortByLanguage = function(
  app: React.Component<Object, AppState>,
  language: string
) {
  app.setState((state, props) => {
    if (language === ANY_LANGUAGE) {
      state.repoList.repos = state.entities.repos;
    } else {
      state.repoList.repos = state.entities.repos.filter((x) => {
        return x.language === language;
      })
    }
    return state;
  });
}

export { onInitState, onSelectRepo, onSortByLanguage };
