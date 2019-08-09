# uitester-puppeteer

基于puppeteer的UI自动化测试

## 使用

安装

```shell
npm i uitester-puppeteer -S
```

使用

```javascript
const Tester = require('uitester-puppeteer');
const cases = [
  // ...
];
const options = {
  // ...
};
let tester = new Tester(cases, options);

tester.on('start', () => {});
tester.on('describe_start', (describe) => {});
tester.on('describe_done', (describe) => {});
tester.on('action_start', (action) => {});
tester.on('action_done', (action) => {});
tester.on('it_start', (it) => {});
tester.on('it_done', (it) => {});
tester.on('done', (result) => {});
tester.on('fail', (result) => {});
tester.on('complete', (result) => {});
```

## cases 示例

以下示例模拟登陆，并检查是否登录成功

```js
const cases = [
  {
    describe: '全局测试',
    newBrowser: false,
    newPage: false,
    actions: [
      {
        name: '打开环境',
        value: 'https://xxx',
        action: 'open',
        waitForAfter: 1000,
        screenshot: true
      },
      {
        name: '填充用户名',
        action: 'type',
        selector: '#username',
        value: 'admin'
      },
      {
        name: '填充密码',
        action: 'type',
        selector: '#password',
        value: '123456'
      },
      {
        name: '提交',
        action: 'click',
        selector: '#submit',
        waitForAfter: 1000
      },
    ],
    it: {
      name: '测试验证',
      selector: '#content',
      condition: 'hasText'
    },
    afterIt: [
        // 同actions
    ]
  }
];
```

**options:**

|属性|说明|类型|默认值|
|--|--|--|--|
| dev | 决定是否打开调试日志、是否headless | boolean | false |
| sandBox | 是否沙盒模式 | boolean | false |
| clientWidth | 默认视口宽度 | number | 1024 |
| clientHeight | 默认视口高度 | number | 768 |
| screenshotPrePath | 截图存放目录，需要保证其写入权限没问题。目录不存在，会自动创建。 | string | 无 |

**describle：**

|字段|解释|
|--|--|
|newBrowser|一般连续写多个 describe，而且后面的 describe 依赖前面的 describe （比如在之前的 action 中本地记录过cookie、localStorage、sessionStorage），所以默认一个完整测试中，新的 describe 不重新打开浏览器。反之，将会销毁之前的浏览器，重新打开浏览器。|
| newPage | 一般连续写多个 describe，而且后面的 describe 依赖前面的 describe （比如在之前的 action 中已经登陆过，进入到了某个页面），所以默认一个完整测试中，新的 describe 不重新打开新的页面。反之，将会关闭之前的page，重新打开一个新的page（这时候往往需要重新 open 一个 url） |
| actions | 执行的动作 |
| it | 执行的验证 |
| afterIt | 数据格式和actions是一样的，其作用一般是用来清除前面actions带来的副作用。比如，测试过程中建立了一条数据，我们就可以在afterIt里面定义action，把这条数据删除掉。 |

**actions && afterIt字段定义：**

| 字段 | 解释 | 值 |
|--|--|--|
| name | 动作名称 | - |
| value | 动作可能涉及到的内容，比如打开的url、填充的值 | - |
| action | 执行动作，后续会逐步扩展 | 详情见action管理表格 |
| selector | 选择器 | 支持css选择器和xpath |
| screenshot | 产品报告中是否截图（初始化不传screenshotPrePath，则不会截图） | 默认false |
| waitFor | 等待当前selector出现 | 超时时间，ms，默认1000ms |
| waitBefore | 动作前延时 | ms |
| waitAfter | 动作后延时 | ms |
| delay | 延时 | ms,type输入的时候会用到 |
| frameName | 测试对象切换到iframe | iframe的name属性值 |
| frameUrl | 测试对象切换到iframe | iframe的src属性值 |
| frameTitle | 测试对象切换到iframe | iframe的title属性值 |

> 当action===frame的时候，可以通过iframe的 frameName、frameUrl、frameTitle属性来定位（只需要一个字段即可，frameName > frameUrl > frameTitle）

**action管理：**

| name | 说明 |
|--|--|
| open | 打开一个页面 |
| click | 点击一个元素 |
| type | 表单输入 |
| frame | 切换到 iframe  |
| mainframe | （切换到 iframe 之后）切换到父窗口 |
| setCookie | 设置 cookie |
| script | 执行原生脚本， string: script 或者 promise: fun |
| screenshot | 仅截图 |

setCookie时，其value示例：

```javascript
{
  name: string,
  value: string,
  url: string,
  domain: string,
  path: string,
  expires: string|number,
  httpOnly: boolean,
  secure: boolean,
  sameSite: boolean
}
```

**it字段定义：**

| 字段 | 说明 | 类型 |
|--|--|--|
| name | 验证器名称 | string |
| selector | 选择器 | string |
| condition | 条件, 参考下边 **“it.condition字段定义”** | string |
| value | 参考下边 **“it.condition字段定义”** | boolean \| string \| number |
| screenshot | 是否截图 | false |

**it.condition字段定义：**

| name | 说明 | 对应value类型 |
|--|--|--|
| isEmpty | 无innerText | boolean |
| isEmptyHtml | 无innerHTML | boolean |
| isNotEmpty | 有innerText | boolean |
| isNotEmptyHtml | 有innerHTML | boolean |
| equal | innerText全等 | boolean |
| equalHtml | innerHTML全等 | boolean |
| notEqual | innerText不全等 | boolean |
| startWith | innerText以value开始 | string |
| endWith | innerText中以value结束 | string |
| notStartWith | innerText不以value开始 | string |
| notEndWith | innerText中不以value结束 | string |
| contain | innerText中含有value | string |
| notContain | innerText中不含有value | string |
| countEqual | selectors的长度为value | string |
| countNotEqual | selectors的长度不为value | string |
| countMore | selectors的长度大于value | number |
| countLess | selectors的长度小于value | number |
