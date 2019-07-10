let describe = {
  describe: '自动化测试示例',
  newBrowser: true,
  newPage: true,
  actions: [
    {
      name: '打开测试页面',
      action: 'open',
      value: 'http://123.57.38.206:92/'
    },
    {
      name: '输入用户名',
      action: 'type',
      selector: '#username',
      value: 'admin'
    },
    {
      name: '输入密码',
      action: 'type',
      selector: '#password',
      value: '123456',
      screenshot: true
    },
    {
      name: '点击登录',
      action: 'click',
      selector: '#loginSubmitBtn'
    },
    {
      action: 'frame',
      name: '进入iframe',
      frameName: 'iframeTest',
      waitBefore: 200
    },
    {
      name: 'frame里面进行了点击',
      action: 'click',
      selector: '#countBtn'
    },
    {
      name: '退出iframe',
      action: 'mainFrame',
      screenshot: true
    }
  ]
};

// 维护一堆case
const its = [
  { name: '测试isEmpty', condition: 'isEmpty', selector: '#result' },
  { name: '测试isEmptyHtml', condition: 'isEmptyHtml', selector: '#result' },
  { name: '测试isNotEmpty', condition: 'isNotEmpty', selector: '#result' },
  { name: '测试isNotEmptyHtml', condition: 'isNotEmptyHtml', selector: '#result' },
  { name: '测试equal', condition: 'equal', selector: '#result', value: '100' },
  { name: '测试equalHtml', condition: 'equalHtml', selector: '#result', value: '100' },
  { name: '测试notEqual', condition: 'notEqual', selector: '#result', value: '100' },
  { name: '测试startWith', condition: 'startWith', selector: '#result', value: '100' },
  { name: '测试endWith', condition: 'endWith', selector: '#result', value: '100' },
  { name: '测试notStartWith', condition: 'notStartWith', selector: '#result', value: '100' },
  { name: '测试notEndWith', condition: 'notEndWith', selector: '#result', value: '100' },
  { name: '测试contain', condition: 'contain', selector: '#result', value: '100' },
  { name: '测试notContain', condition: 'notContain', selector: '#result', value: '100' },
  { name: '测试countEqual', condition: 'countEqual', selector: '#list>li', value: 3 },
  { name: '测试countNotEqual', condition: 'countNotEqual', selector: '#list>li', value: 3 },
  { name: '测试countMore', condition: 'countMore', selector: '#list>li', value: 3 },
  { name: '测试countLess', condition: 'countLess', selector: '#list>li', value: 3 }
];
let cases = [];
for (let it of its) {
  cases.push({
    ...describe,
    it
  })
}

module.exports = cases;
