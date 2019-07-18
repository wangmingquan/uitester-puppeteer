let conditionsMap = require('./its/index.js');
const highlightSelector = require('./utils/highlightSelector');

module.exports = async (tester, it) => {
  let _st_it = new Date().getTime();
  let page = tester.getPage();
  let condition = it.condition;
  if (!condition) {
    throw new Error('判断条件必须包含condition');
  }
  let conditionHandle = conditionsMap[condition];
  let conditionType = conditionHandle.type;
  let data = null;
  if (conditionHandle
    && conditionHandle.type
    && condition.fn
  ) {
    let err = new Error(`unsupported condition <${condition}>`);
    err.type = 'it';
    err.it = it;
    throw(err);
  }

  tester.emit('it_start', it)
  // 等待加载
  await page.waitFor(it.selector, {
    timeout: 1000
  }).catch(e => {
    throw(`未找到selector <${it.selector}>`);
  });

  if (conditionType === 'text') {
    data = await page.$eval(it.selector, selector => selector.innerText);
  } else if (conditionType === 'html') {
    data = await page.$eval(it.selector, selector => selector.innerHTML);
  } else if (conditionType === 'elements') {
    data = await page.$$eval(it.selector, selector => selector.length);
  }

  // 截图
  if (it.screenshot) {
    await highlightSelector(tester, it.selector, async () => {
      it.screenshotUrl = await tester.screenshot();
    });
  }

  it._costTime = new Date().getTime() - _st_it;

  return conditionHandle.fn(data, it.value)
};
