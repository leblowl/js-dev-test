import { EmitApp, Repo } from './typings';
import * as model from './model';
import * as request from '../util/request';


function onlyUnique(value: any, index: number, self: Array<any>) {
      return self.indexOf(value) === index;
}

const onInitState = function(
  app: EmitApp,
  data: Array<Repo>
) {
  app.setState((state, props) => {
    state.entities.repos = data;
    state.repoList.repos = state.entities.repos;
    state.repoList.languages = [model.ANY_LANGUAGE].concat(state.entities.repos.map(
      (x) => x.language).filter(onlyUnique));
    return state;
  });
}

const onAppMount = function(
  app: EmitApp,
  data: Array<Repo>
) {
  request.get('http://localhost:4000/repos', (data: Array<Repo>) => {
    app.emit(onInitState, data);
  });
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

export { onAppMount, onInitState, onSelectRepo, onSortByLanguage };
