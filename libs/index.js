const events = require('events');
const start = require('./start.js');
const path = require('path');
const mkdirp = require('mkdirp');
const moment = require('moment');

class Tester extends events.EventEmitter {
  constructor(list, options = {}) {
    super();
    this.list = list;
    this.options = options;
    this.page = null;
    this.iframe = null;
    this.iframeStatus = 'main';

    this.start();
  }

  async start() {
    await start(this);
  }

  getPage() {
    return this.iframeStatus === 'main' ? this.page : this.iframe;
  }

  async screenshot() {
    let { screenshotPrePath } = this.options;
    if (!screenshotPrePath) {
      return '';
    }
    let today = moment().format('YYYY-MM-DD');
    let prefix = `/uitester/images/${today}/`;
    let dir = path.join(screenshotPrePath, prefix);
    let mkdirpPromise = () => new Promise((resolve, reject) => {
      mkdirp(dir, err => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
    let fileName = `${+ new Date}.png`;
    let finalyPath = path.join(dir, fileName);
    await mkdirpPromise();
    await this.page.screenshot({
      path: finalyPath
    });
    return finalyPath;
  }
}

module.exports = Tester;
