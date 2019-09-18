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

export { get };

