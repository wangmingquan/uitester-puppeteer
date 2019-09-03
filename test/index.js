let Uitester = require('../index');
let cases = require('./cases');
const log = require('log-mini');

let doTest = function (testcase) {
  return new Promise((resolve) => {
    let uiTester = new Uitester(testcase, {
      global: {
        username: 'admin',
        password: '123456',
        origin: 'http://123.57.38.206:92'
      },
      dev: true,
      screenshotPrePath: '/Users/wangmingquan/Downloads'
    });

    uiTester.on('start', () => {
      log('开始启动测试');
    });

    uiTester.on('describe_start', (ev) => {
      log(`desribe '${ev.describe}' is starting...`);
    });
    uiTester.on('describe_done', (ev) => {
      log.success(`desribe '${ev.describe}'测试完成.`);
    });

    uiTester.on('action_start', (ev) => {
      log.info(`action '${ev.name}' is running...`);
    });
    uiTester.on('action_done', (ev) => {
      log.success(`[${ev._costTime}ms] action '${ev.name}' 动作完成.`);
    });

    uiTester.on('it_start', (ev) => {
      log.warn(`it '${ev.name}' is testing...`);
    });
    uiTester.on('it_done', (ev) => {
      log.success(`[${ev._costTime}ms] it '${ev.name}' is OK.`);
    });

    // uiTester.on('done', (ev) => {
    //   log.success('测试成功');
    // });

    // uiTester.on('fail', (ev) => {
    //   log.error('测试失败');
    //   log('失败具体信息:');
    //   console.log(ev);
    // });
    uiTester.on('complete', (data) => {
      data.status === 'fail' ? log.error('测试失败') : log.success('测试成功');
      log('测试报告信息:');
      console.log(data);
      resolve();
    });
  });
};

(async () => {
  // 单个case测试
  // for (let i in cases) {
  //   await doTest([cases[i]]);
  // }

  // 作为一个整体测试
  await doTest(cases);
})();
