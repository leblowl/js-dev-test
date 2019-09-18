import React from 'react';
import './App.css';
import { AppState, Repo, RepoListVM } from './App/typings';
import * as model from './App/model';
import * as event from './App/event';


const RepoItemDetails: React.FunctionComponent<{
  repo: Repo;
  emit: Function;
}> = function({ repo, emit }) {
  if (repo.latestCommit) {
    return (
      <div className='body'>
        <span>{'AUTHOR: ' + repo.latestCommit.author.name}</span>
        <span>{'DATE: ' + repo.latestCommit.author.date}</span>
        <span>{'MESSAGE: ' + repo.latestCommit.message}</span>
      </div>
    );
  } else {
    return <div className='body'></div>;
  }
}

const RepoItem: React.FunctionComponent<{
  repo: Repo;
  emit: Function;
}> = function({ repo, emit }) {

  let selectedClass = repo.selected ? 'selected' : '';
  return (
    <li className={'repo-item ' + selectedClass}>
      <div className='header'>
        <button
          className='name'
          onClick={() => emit(event.onSelectRepo, repo.id)}>
          {repo.name}
        </button>
        <span className='description'>{repo.description}</span>
        <span>{repo.language}</span>
        <span>{repo.forks_count}</span>
      </div>
      <RepoItemDetails repo={repo} emit={emit}/>
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
        return (
          <button
            key={x}
            className={x === languageSelected ? 'selected' : ''}
            onClick={() => emit(event.onSortByLanguage, x)}>
            {x}
          </button>
        );
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
    this.state = model.initialModel;
  }

  emit(event: Function, data: Object) {
    event(this, data);
  }

  componentDidMount() {
    this.emit(event.onAppMount, {});
  }

  render() {
    let emit = (event: Function, data: Object) => this.emit(event, data);

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
