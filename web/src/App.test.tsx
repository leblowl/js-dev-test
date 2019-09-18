/* eslint-env jest */

import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import renderer from 'react-test-renderer';
import * as request from './util/request';
import * as event from './App/event.tsx';
const { act } = renderer;

test('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
});

test('App displays repos', async () => {
  let comp;

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

  // NOTE: Couldn't get spyOn to work for event.getRepo...
  // So I am simply spying on request.get for now... adding a little conditional
  // on the URL...
  // TODO: Fixme!
  jest.spyOn(request, 'get').mockImplementation((url, onLoad, onError) => {
    // This is pretty resilient
    if (url === event.reposUrl) {
      onLoad(fakeRepos);
    }
    // This is very fragile
    if (url.startsWith('https://api.github.com/repos/')) {
      onLoad(fakeLatestCommit);
    }
  });

  await act(async () => {
    comp = renderer.create(<App />);
  });

  let tree = comp.toJSON();
  expect(tree).toMatchSnapshot();
});
