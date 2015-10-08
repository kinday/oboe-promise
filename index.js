import oboe from 'oboe';

class OboePromise {
  constructor(source) {
    this.node = this.node.bind(this);
    this.on = this.on.bind(this);
    this.path = this.path.bind(this);
    this.run = this.run.bind(this);

    this._cache = [];
    this._source = source;

    return {
      done: this._error('#done is unavailable in Promise; use #then'),
      fail: this._error('#fail is unavailable in Promise; use #catch'),
      node: this.node,
      on: this.on,
      path: this.path,
      run: this.run,
    };
  }

  _chain(method, args) {
    this._cache.push(instance => instance[method].apply(instance, args));
    return this;
  }

  _done(...args) {
    return this._chain('done', args);
  }

  _fail(...args) {
    return this._chain('fail', args);
  }

  _error(message) {
    return function _stub() {
      throw new Error(message);
    };
  }

  node(...args) {
    return this._chain('node', args);
  }

  on(...args) {
    return this._chain('on', args);
  }

  path(...args) {
    return this._chain('path', args);
  }

  run() {
    return new Promise((resolve, reject) => {
      this._done(resolve)._fail(reject);
      const oboeStream = oboe(this._source);
      for (let unit = 0; unit < this._cache.length; unit++) {
        this._cache[unit](oboeStream);
      }
    });
  }
}

export default function oboePromise(source) {
  return new OboePromise(source);
}

oboePromise.drop = oboe.drop;
