module.exports = async (tester, action) => {
  let page = tester.getPage();
  await page.evaluate(action.value);
};
