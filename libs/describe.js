const action = require('./action.js');
const it = require('./it.js');

module.exports = async (tester, describe) => {
  let failFlag = false;
  let err = null;
  let doActions = async (actions) => {
    for (let item of actions) {
      await action(tester, item).catch(e => {
        // action 执行失败, 测试失败
        err = e;
        failFlag = true;
      });
      if (failFlag) {
        break;
      } else {
        tester.emit('action_done', item);
      }
    }
  };
  let lastErrIt = null;
  let checkIts = async (its) => {
    for (let item of its) {
      item.success = true;
      let itResult = await it(tester, item).catch(e => {
        // it 执行失败, 测试失败
        err = e;
        failFlag = true;
        item.success = false;
        lastErrIt = item;
      });
      if (!itResult) {
        failFlag = true;
        item.success = false;
        lastErrIt = item;
      }
    }
  };
  tester.emit('describe_start', describe);

  await doActions(describe.actions);

  if (!failFlag) {
    // 执行最终判断
    await checkIts(describe.its);

    if (lastErrIt) {
      err = new Error(`
        测试用例 <${lastErrIt.name}>验证失败:
        condition <${lastErrIt.condition}>,
        selector <${lastErrIt.selector}>,
        value <${lastErrIt.value || ''}>
      `);
      failFlag = true;
    }
  }

  if (describe.afterIt) {
    // 执行判断后action操作
    await doActions(describe.afterIt);
  }

  if (failFlag) {
    throw err;
  } else {
    tester.emit('describe_done', describe);
  }
};
