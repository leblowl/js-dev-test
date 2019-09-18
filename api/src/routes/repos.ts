import express from 'express';
import * as http from 'http';
import * as https from 'https';
import * as fs from 'fs';
import { config } from '../config';

const reposPath = '/repos.json';
const reposRemoteTmpPath = '/repos-remote.json';

/**
 * Get full path to data file, given a path relative to the data directory.
 */
const getDataPath = function(relPath: String) {
  return config.data.path + relPath;
}

/**
 * Load & return local repos from project data directory.
 */
const loadLocalRepos = function(relPath: String) {
  let dataPath = getDataPath(relPath);
  let content = fs.readFileSync(dataPath, {'encoding': 'utf-8'});
  return JSON.parse(content);
}

/**
 * Fetch remote repos from Github.
 */
const fetchRemoteRepos = function(onLoad: Function, onError: Function) {
  const reqOptions = {
    hostname: 'api.github.com',
    port: 443,
    path: '/users/silverorange/repos',
    method: 'GET',
    headers: {
      'User-Agent': 'HippoEducation/js-dev-test'
    }
  }

  const req = https.request(reqOptions, res => {
    let body = '';

    res.setEncoding('utf8');

    res.on('data', data => {
      body += data;
    });

    res.on('end', function() {
      let bodyObj = JSON.parse(body);

      if (res.statusCode != 200) {
        console.error(
          'Remote error fetching remote repos!\n'
          + 'Request: %s\n'
          + 'Remote status code: %s',
          reqOptions,
          res.statusCode);
        onError();
      } else {
        onLoad(bodyObj);
      }
    });
  });

  req.on('error', function(e) {
    console.error('Unexpected error fetching remote repos!', e);
    onError();
  });

  req.end()
}

/**
 * Get all repos (local & remote).
 */
const getRepos = function(onLoad: Function, onError: Function) {
  let localRepos = loadLocalRepos(reposPath);

  // Got rate-limited by Github!
  //fetchRemoteRepos(
  //  (data: Array<Object>) => {
  //    onLoad(data.concat(localRepos));
  //  },
  //  onError
  //);
  // Hack for testing:
  //  Downloaded remote repos JSON from Github.
  let remoteRepos = loadLocalRepos(reposRemoteTmpPath);

  onLoad(remoteRepos.concat(localRepos));
}

export const repos = express.Router();

/**
 * Get repos API endpoint.
 */
repos.get('/', (req, res) => {
  res.header('Content-Type', 'application/json');
  getRepos(
    (data: Array<Object>) => {
      res.status(200);
      res.json(data);
    },
    () => {
      res.status(500);
      res.end();
    }
  );
});
