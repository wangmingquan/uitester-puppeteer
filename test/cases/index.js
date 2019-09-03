let describe = {
  describe: '自动化测试示例',
  newBrowser: true,
  newPage: true,
  actions: [
    {
      name: '打开测试页面',
      action: 'open',
      value: '<global: origin>'
    },
    {
      name: '输入用户名',
      action: 'type',
      // selector: '#username',
      selector: '//*[@id="username"]',
      value: '<global: username>',
      screenshot: true
    },
    {
      name: '输入密码',
      action: 'type',
      selector: '#password',
      value: '<global: password>',
      screenshot: true
    },
    {
      name: '点击登录',
      action: 'click',
      selector: '#loginSubmitBtn',
      screenshot: true
    },
    {
      action: 'frame',
      name: '进入iframe',
      frameName: 'iframeTest',
      waitBefore: 200,
      screenshot: true
    },
    {
      name: 'frame里面进行了点击',
      action: 'click',
      selector: '#countBtn'
    },
    {
      name: '仅截图，无操作',
      action: 'screenshot'
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
  // {
  //   name: '测试isEmpty',
  //   condition: 'isEmpty',
  //   selector: '#result',
  //   screenshot: true
  // },
  // { name: '测试isEmptyHtml', condition: 'isEmptyHtml', selector: '#result' },
  { name: '测试isNotEmpty', condition: 'isNotEmpty', selector: '#result' },
  // { name: '测试isNotEmptyHtml', condition: 'isNotEmptyHtml', selector: '#result' },
  // { name: '测试equal', condition: 'equal', selector: '#result', value: '100' },
  // { name: '测试equalHtml', condition: 'equalHtml', selector: '#result', value: '100' },
  // { name: '测试notEqual', condition: 'notEqual', selector: '#result', value: '100' },
  // { name: '测试startWith', condition: 'startWith', selector: '#result', value: '100' },
  // { name: '测试endWith', condition: 'endWith', selector: '#result', value: '100' },
  // { name: '测试notStartWith', condition: 'notStartWith', selector: '#result', value: '100' },
  // { name: '测试notEndWith', condition: 'notEndWith', selector: '#result', value: '100' },
  // { name: '测试contain', condition: 'contain', selector: '#result', value: '100' },
  // { name: '测试notContain', condition: 'notContain', selector: '#result', value: '100' },
  // { name: '测试countEqual', condition: 'countEqual', selector: '#list>li', value: 3 },
  // { name: '测试countNotEqual', condition: 'countNotEqual', selector: '#list>li', value: 3 },
  // { name: '测试countMore', condition: 'countMore', selector: '#list>li', value: 3 },
  // { name: '测试countLess', condition: 'countLess', selector: '#list>li', value: 3 }
];
let cases = [];
for (let it of its) {
  cases.push({
    ...describe,
    it
  });
}

cases.push({
  describe: '测试TodoList',
  newBrowser: false,
  newPage: false,
  actions: [
    {
      name: '打开 todo 页面',
      action: 'open',
      value: '<global: origin>/todo',
      waitAfter: 300
    },
    {
      name: '输入任务',
      action: 'type',
      selector: '#task',
      value: '<mock: @csentence>'
    },
    {
      name: '添加任务',
      action: 'click',
      selector: '#addnew',
      waitAfter: 2000
    }
  ],
  it: {
    name: '查看是否添加成功',
    selector: '#tasklist>li',
    value: 0,
    condition: 'countMore'
  }
});

module.exports = cases;
