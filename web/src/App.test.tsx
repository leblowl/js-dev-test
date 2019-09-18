/* eslint-env jest */

import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import renderer from 'react-test-renderer';
import * as event from './App/event';
import * as api from './App/api';

test('App renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
});

describe('App', () => {
  const fakeRepos = [
    {
     "id": 12345678,
     "name": "JSONExample",
     "full_name": "silverorange/JSON-Example",
     "description": "An example repository from a JSON file.",
     "language": "English",
     "forks_count": 999
    },
    {
     "id": 87654321,
     "name": "JSONExample2",
     "full_name": "silverorange/JSON-Example2",
     "description": "An SECOND example repository from a JSON file.",
     "language": "French",
     "forks_count": 888
    }
  ];

  const fakeLatestCommit = [
      {
        'commit': {
          'author': {'name': 'SuperWoman', 'date': 'Tomorrow'},
          'message': 'Huh?'
        }
      }
  ];

  jest.spyOn(api, 'getRepos').mockImplementation((onLoad, onError) => {
    onLoad(fakeRepos);
  });

  jest.spyOn(api, 'getLatestRepoCommits').mockImplementation((repo, onLoad, onError) => {
    onLoad(fakeLatestCommit);
  });

  let rendered = renderer.create(<App />);
  let root = rendered.root;

  test('(1) lists repos', () => {
    let tree = rendered.toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('(2) can select repo', () => {
    root.findAll((x) => x.props.className === 'repo-item')[0]
        .find((x) => x.props.className === 'name')
        .props
        .onClick();

    let tree = rendered.toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('(3) can filter by language button', () => {
    root.find((x) => x.props.className === 'button-row')
        .findAll((x) => x.type === 'button')[1]
        .props
        .onClick();

    let tree = rendered.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
