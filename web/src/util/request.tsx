const get = function(url: string, onLoad: Function, onError: Function) {
  let req = new XMLHttpRequest();

  req.responseType = 'json';
  req.open('GET', url);
  req.onload = function(e) {
    if (this.status === 200) {
      onLoad(this.response);
    } else {
      onError(this.response);
    }
  };
  req.send();
}

export { get };

