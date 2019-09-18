import React from 'react';
import './App.css';
import { AppState, Repo, RepoListVM} from './App.typings';

// Util

const get = function(url: string, onload: Function) {
  let req = new XMLHttpRequest();

  req.responseType = 'json';
  req.open('GET', url);
  req.onload = function(e) {
    if (this.status === 200) {
      onload(this.response);
    }
  };
  req.send();
}

function onlyUnique(value: any, index: number, self: Array<any>) {
      return self.indexOf(value) === index;
}

// Events

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

// Views

const RepoItem: React.FunctionComponent<{
  repo: Repo;
  emit: Function;
}> = function({ repo, emit }) {

  let selectedClass = repo.selected ? 'selected' : '';

  return (
    <li className={'repo-item ' + selectedClass}>
      <button onClick={() => emit(onSelectRepo, repo.id)}>
        {repo.name}
      </button>
      <span>{repo.description}</span>
      <span>{repo.language}</span>
      <span>{repo.forks_count}</span>
    </li>
  );
};

const LanguageButtons: React.FunctionComponent<{
  languages: Array<string>;
  languageSelected: string;
  emit: Function;
}> = function({ languages, languageSelected, emit }) {


  return (
    <div className='button-row'>
      {languages.map((x) => {
        return <button key={x} onClick={() => emit(onSortByLanguage, x)}>{x}</button>;
      })}
    </div>
  )
}

const RepoList: React.FunctionComponent<{
  repoList: RepoListVM;
  emit: Function;
}> = function( { repoList, emit }) {
  return (
    <div className='repo-list'>
      <LanguageButtons
        languages={repoList.languages}
        languageSelected={repoList.languageSelected}
        emit={emit} />

      <ul className='repo-list'>
        {repoList.repos.map((x) => {
          return <RepoItem key={x.id} repo={x} emit={emit} />
        })}
      </ul>
    </div>
  );
}

class App extends React.Component<Object, AppState> {
  constructor(props: Object) {
    super(props);
    this.state = {
      entities: {
        repos: []
      },
      repoList: {
        languages: [],
        languageSelected: '',
        repos: []
      }
    };
  }

  componentDidMount() {
    get('http://localhost:4000/repos', (data: Array<Repo>) => {
      this.emit(this, onInitState, data);
    });
  }

  emit(app: React.Component<Object, AppState>, event: Function, data: Object) {
    event(app, data);
  }

  render() {
    let emit = (event: Function, data: Object) => this.emit(this, event, data);

    return (
      <div className='App'>
        <RepoList
          repoList={this.state.repoList}
          emit={emit} />
      </div>
    );
  }
}

export default App;
