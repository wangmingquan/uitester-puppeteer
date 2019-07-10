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
  tester.emit('describe_start', describe);

  await doActions(describe.actions);

  if (!failFlag) {
    // 执行最终判断
    
    let itRel = await it(tester, describe.it).catch(e => {
      err = e;
      // it 执行失败, 测试失败
      failFlag = true;
    });
    
    if (!itRel) {
      err = new Error(`
        测试用例 <${describe.it.name}>验证失败:
        condition <${describe.it.condition}>,
        selector <${describe.it.selector}>,
        value <${describe.it.value || ''}>
      `);
      failFlag = true;
    } else {
      tester.emit('it_done', describe.it);
    }
  }

  if (!failFlag && describe.afterIt) {
    // 执行判断后action操作
    await doActions(describe.afterIt);
  }

  if (failFlag) {
    throw err;
  } else {
    tester.emit('describe_done', describe);
  }
};