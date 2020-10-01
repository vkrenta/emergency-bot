class PromiseProgress extends Promise {
  constructor(fn) {
    let self;
    super(function (resolve, reject) {
      fn(resolve, reject, value => self._progress(value));
    });
    self = this;
  }

  _progress(v) {
    if (this.progressCB)
      this.progressCB(v);
  }

  progress(fn) {
    this.progressCB = fn;
    return this;
  }
}

module.exports = { PromiseProgress }