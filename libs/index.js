const events = require('events');
const start = require('./start.js');
const path = require('path');
const mkdirp = require('mkdirp');
const moment = require('moment');
const mockData = require('./utils/mock.js');

class Tester extends events.EventEmitter {
  constructor (list, options = {}) {
    super();
    this.list = mockData(list, options.global);
    this.options = options;
    this.page = null;
    this.iframe = null;
    this.iframeStatus = 'main';

    this.start();
  }

  async start () {
    this.formarteList();
    await start(this);
  }

  /**
   * @description 对测试用例进行格式化：支持xpath
   * @memberof Tester
   * @returns {void}
   */
  formarteList () {
    let xPathToCss = (xpath) => {
      return xpath
        .replace(/\[(\d+?)\]/g, function (s, m1) { return '[' + (m1 - 1) + ']'; })
        .replace(/\/{2}/g, '')
        .replace(/\/+/g, ' > ')
        .replace(/@/g, '')
        .replace(/\[(\d+)\]/g, ':eq($1)')
        .replace(/^\s+/, '');
    };
    for (let item of this.list) {
      for (let action of item.actions) {
        if (/^\/\/.+/.test(action.selector)) {
          action.selector = xPathToCss(action.selector);
        }
      }
      if (/^\/\/.+/.test(item.it.selector)) {
        item.it.selector = xPathToCss(item.it.selector);
      }
      for (let action of item.afterIt || []) {
        if (/^\/\/.+/.test(action.selector)) {
          action.selector = xPathToCss(action.selector);
        }
      }
    }
  }

  getPage () {
    return this.iframeStatus === 'main' ? this.page : this.iframe;
  }

  async screenshot () {
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
    let fileName = `${+new Date()}.png`;
    let finalyPath = path.join(dir, fileName);
    let err;
    await mkdirpPromise();
    await this.page.screenshot({
      path: finalyPath
    }).catch(_err => {
      // 截图失败啦
      console.log('截图失败', err);
      err = _err;
    });
    if (!err) {
      return finalyPath;
    } else {
      return '';
    }
  }
}

module.exports = Tester;
