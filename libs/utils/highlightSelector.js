module.exports = async (tester, selector, cb) => {
  let page = tester.getPage();
  let dom;
  let boxShadow = '';
  let err;
  if (selector) {
    await page
      .waitFor(selector, {
        timeout: 1000
      })
      .catch(e => {
        err = e;
      });
    if (!err) {
      // 获取dom，和dom的默认样式
      dom = await page.$(selector);
      boxShadow = await page.evaluate(dom => {
        let boxShadowValue = '';
        if (dom.scrollIntoView) {
          dom.scrollIntoView();
          boxShadowValue = window.getComputedStyle(dom)['boxShadow'];
          dom.style.boxShadow = '0px 0px 10px 2px red, 0px 0px 10px 2px red';
        }
        return boxShadowValue;
      }, dom);
    }
  }
  await page.waitFor(100);
  cb && await cb();
  if (selector && dom) {
    await page
      .evaluate(
        (dom, boxShadow) => {
          dom.style.boxShadow = boxShadow;
          return '';
        },
        dom,
        boxShadow
      )
      .catch(err => {
        console.error('设置自己的样式失败啦', err);
      });
  }
};
