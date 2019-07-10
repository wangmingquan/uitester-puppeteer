module.exports = async (tester, action) => {
  let page = tester.getPage();
  await page.goto(action.value);
};
