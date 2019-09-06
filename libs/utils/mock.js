var Mock = require('mockjs');
var _ = require('lodash');

module.exports = (_list, global = {}) => {
  const list = _.cloneDeep(_list);

  const replace = (value = '') => {
    const mockRep = /<mock:\s*(@.+)>/g;
    const globalRep = /<global:\s(.+)>/g;
    let mockExecs = mockRep.exec(value);
    let globalExecs = globalRep.exec(value);
    if (mockExecs) {
      let expression = mockExecs[1];
      let mockValue = Mock.mock(expression);
      mockValue = mockValue === expression ? '' : mockValue;
      value = value.replace(mockRep, mockValue);
    } else if (globalExecs) {
      let variable = globalExecs[1];
      let variableValue = global[variable] || '';
      value = value.replace(globalRep, variableValue);
    }
    return value;
  };

  // global 中数据 mock 替换
  for (let key in global) {
    global[key] = replace(global[key]);
  }

  // list 的 value 值替换
  for (let describle of list) {
    for (let item of describle.actions) {
      item.value = replace(item.value);
    }
    for (let item of describle.its) {
      item.value = replace(item.value);
    }
    for (let item of describle.afterIt || []) {
      item.value = replace(item.value);
    }
  }
  return list;
};

