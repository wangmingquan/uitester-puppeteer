module.exports = async (tester,action) => {
  let page = tester.getPage();

  // 等待加载
  await page.waitFor(action.selector, {
    timeout: 5000
  });
  // 清空
  await page.$eval(action.selector, (selector) => {
    selector.value = "";
  });
  // 输入
  await page.type(action.selector, action.value, {
    delay: action.delay || 0
  });
};
