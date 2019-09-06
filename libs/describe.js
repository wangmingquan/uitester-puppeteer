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
  let itRel = null;
  let lastIt = null;
  let checkIts = async (its) => {
    for (let item of its) {
      lastIt = item;
      itRel = await it(tester, item).catch(e => {
        // it 执行失败, 测试失败
        err = e;
        failFlag = true;
      });
      if (failFlag) {
        break;
      }
    }
  };
  tester.emit('describe_start', describe);

  await doActions(describe.actions);

  if (!failFlag) {
    // 执行最终判断
    await checkIts(describe.its);

    if (!itRel) {
      err = new Error(`
        测试用例 <${lastIt.name}>验证失败:
        condition <${lastIt.condition}>,
        selector <${lastIt.selector}>,
        value <${lastIt.value || ''}>
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
