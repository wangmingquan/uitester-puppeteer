module.exports = async (tester, action) => {
  let cookie = action.value;

  if (Object.prototype.toString.call(cookie) !== '[object Object]') {
    throw new Error('参数格式不正确');
  }
  if (!cookie.name || !cookie.value) {
    throw new Error('缺失cookie名或值');
  }
  await tester.page.setCookie(cookie);
};
