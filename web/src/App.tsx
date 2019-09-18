import React from 'react';
import './App.css';
import { Repo, AppState} from './App.typings';

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

// Events

const onSelectRepo = function(app: React.Component<Object, AppState>, id: number) {
  app.setState({
    repos: app.state.repos.map((x) => {
      if (x.id === id) {
        x.selected = !x.selected;
        return x;
      } else {
        return x;
      }})
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

const RepoList: React.FunctionComponent<{
  repos: Array<Repo>;
  emit: Function;
}> = function( { repos, emit }) {
  return (
    <ul className='repo-list'>
      {repos.map((x) => {
        return <RepoItem key={x.id} repo={x} emit={emit} />
      })}
    </ul>
  );
}

class App extends React.Component<Object, AppState> {
  constructor(props: Object) {
    super(props);
    this.state = {repos: []};
  }

  componentDidMount() {
    get('http://localhost:4000/repos', (data: Array<Repo>) => {
      this.setState({
        'repos': data
      });
    });
  }

  emit(app: React.Component<Object, AppState>, event: Function, data: Object) {
    event(app, data);
  }

  render() {
    return (
      <div className='App'>
        <RepoList repos={this.state.repos}
                  emit={(event: Function, data: Object) => this.emit(this, event, data)}/>
      </div>
    );
  }
}

export default App;
