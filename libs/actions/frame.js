module.exports = async (tester, action) => {
  // 等待加载
  let { frameName, frameUrl, frameTitle } = action;
  if (!(frameName || frameUrl || frameTitle)) {
    throw new Error('缺少iframe表示参数');
  }

  if (tester.iframeStatus === 'main') {
    let frames = tester.page.frames();
    if (!frames.length) {
      throw new Error('当前页面没有iframe');
    }
    if (frameName) {
      tester.iframe = frames.find(frame => frame.name() === frameName);
    } else if (frameUrl) {
      tester.iframe = frames.find(frame => frame.url() === frameUrl);
    } else if (frameTitle) {
      tester.iframe = frames.find(frame => frame.title() === title);
    }
    if (!tester.iframe) {
      throw new Error(`进入iframe<${frameName || frameUrl || frameTitle}>失败`);
    } else {
      tester.iframeStatus = 'iframe';
    }
  } else {
    throw new Error('当前页面已经在iframe里面，不能继续进入iframe');
  }
};
