const actions = require('./actions/index.js');

module.exports = async (tester, action) => {
  let page = tester.getPage();

  tester.emit('action_start', action);

  let _st_action = new Date().getTime();

  if (actions[action.action] && typeof actions[action.action] === 'function') {
    // action前置等待
    if (action.waitBefore) {
      await page.waitFor(action.waitBefore);
    }

    // action的selector等待
    if (action.waitFor) {
      await page.waitFor(action.selector, {
        timeout: action.timeout || 1000
      });
    }
    // action执行
    await actions[action.action](tester, action);

    // action后置等待
    if (action.waitAfter) {
      await page.waitFor(action.waitAfter);
    }

    // 截图
    if (action.screenshot) {
      action.screenshotUrl = await tester.screenshot();
    }

    action._costTime = new Date().getTime() - _st_action;
  } else {
    tester.emit('action_fail', action);
  }
};