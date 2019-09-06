const events = require('events');
const start = require('./start.js');
const path = require('path');
const mkdirp = require('mkdirp');
const moment = require('moment');
const mockData = require('./utils/mock.js');

class Tester extends events.EventEmitter {
  constructor (list, options = {}) {
    super();
    // 测试前置的数据处理
    this.list = list;
    this.formateIts(); // 支持两种数据格式的 it
    this.list = mockData(this.list, options.global); // mock 的处理
    this.formateXpath(); // 支持 xpath

    this.options = options;
    this.page = null;
    this.iframe = null;
    this.iframeStatus = 'main';

    this.start();
  }

  async start () {
    await start(this);
  }

  /**
   * @description 对测试用例进行格式化：支持xpath
   * @memberof Tester
   * @returns {void}
   */
  formateXpath () {
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
      for (let it of item.its) {
        if (/^\/\/.+/.test(it.selector)) {
          it.selector = xPathToCss(it.selector);
        }
      }
      // if (/^\/\/.+/.test(item.it.selector)) {
      //   item.it.selector = xPathToCss(item.it.selector);
      // }
      for (let action of item.afterIt || []) {
        if (/^\/\/.+/.test(action.selector)) {
          action.selector = xPathToCss(action.selector);
        }
      }
    }
  }

  /**
   * @description 对测试用例 its 的格式化
   * @memberof Tester
   * @returns {void}
   */

  formateIts () {
    for (let item of this.list) {
      if (!item.its) {
        item.its = [];
        if (item.it) {
          item.its.push(item.it);
        }
      }
      delete item.it;
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
