module.exports = async (tester, action) => {
  let page = tester.getPage();
  // 等待加载
  let err = null;
  await page.waitFor(action.selector, {
    timeout: 1000
  }).catch(e => {
    err = e;
  });

  if (err) {
    throw new Error(`元素<${action.selector}>未找到`);
  } else {
    await page.click(action.selector);
  }
};
