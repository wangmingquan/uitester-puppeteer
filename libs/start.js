const puppeteer = require('puppeteer');
const describe = require('./describe.js');

module.exports = async (tester) => {
  let allFailFlag = false;
  let err = null;
  let browser = null;
  let list = tester.list;
  let closePage = async () => {
    await tester.page.close({
      runBeforeUnload: false
    });
    tester.iframe = null;
    tester.page = null;
    tester.frameStatus = 'main';
  };

  for (let item of list) {
    let failFlag = false;
    // 如果需要重新生成用一个浏览器，则关闭之前的浏览器
    if (browser && item.newBrowser) {
      await closePage();
      await browser.close();
      browser = null;
    }

    // 无浏览器，则生成浏览器
    if (!browser) {
      let options = tester.options;
      let headless = true;
      if (options.dev) {
        headless = false;
      }
      let sandBoxConf = ['--no-sandbox', '--disable-setuid-sandbox'];
      if (options.sandBox) {
        sandBoxConf = [];
      }
      let browserOptions = {
        defaultViewport: {
          width: options.clientWidth || 1368,
          height: options.clientHeight || 768
        },
        args: [...sandBoxConf],
        headless
      }

      browser = await puppeteer.launch(browserOptions);
    };

    // 如果需要重新打开一个页面，则先关闭之前的页面
    if (tester.page && item.newPage) {
      await closePage();
    }

    // 创建page
    if (!tester.page) {
      tester.page = await browser.newPage();
      // 处理beforeunload，以免page不能被正常的关闭
      tester.page.on('dialog', async dialog => {
        let type = await dialog.type();
        if (type === 'beforeunload') {
          await dialog.dismiss();
        }
      });
    }

    await describe(tester, item).catch(ev => {
      err = ev;
      failFlag = true;
    });

    // 多个测试用例，其中一个测试失败，后面的测试将继续
    if (failFlag) {
      allFailFlag = true;
      item.success = false;
      item.err = err;
    } else {
      item.success = true;
    }
  }

  // 全部测试完毕，关闭页面，关闭浏览器
  await closePage();
  await browser.close();

  if (allFailFlag) {
    tester.emit('fail');
    tester.emit('complete', {
      status: 'fail',
      result: tester.list
    });
  } else {
    tester.emit('done');
    tester.emit('complete', {
      status: 'success',
      result: tester.list
    });
  }
};