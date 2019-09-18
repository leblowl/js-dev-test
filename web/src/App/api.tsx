import { Repo } from './typings';
import * as request from '../util/request';

/**
 * URL for application backend repos.
 */
const reposUrl = 'http://localhost:4000/repos';

/**
 * Fetch repos from application backend.
 */
const getRepos = function(onLoad: Function, onErr: Function) {
  request.get(reposUrl, onLoad, onErr);
}

/**
 * Get Github latest commits URL for a given repo.
 */
const repoCommitUrl = function(repo: Repo) {
  return `https://api.github.com/repos/${repo.full_name}/commits`;
}

/**
 * Fetch latest repo commits from Github.
 */
const getLatestRepoCommits = function(repo: Repo, onLoad: Function, onErr: Function) {
  request.get(repoCommitUrl(repo), onLoad, onErr);
}

export { getRepos, getLatestRepoCommits }
