module.exports = {
  'isEmpty': {
    type: 'text',
    fn: data => data === ''
  },
  'isEmptyHtml': {
    type: 'html',
    fn: data => data === ''
  },
  'isNotEmpty': {
    type: 'text',
    fn: data => !(data === '')
  },
  'isNotEmptyHtml': {
    type: 'html',
    fn: data => !(data === '')
  },
  'equal': {
    type: 'text',
    fn: (data, value) => data === value
  },
  'equalHtml': {
    type: 'html',
    fn: (data, value) => data === value
  },
  'notEqual': {
    type: 'text',
    fn: (data, value) => !(data === value)
  },
  'startWith': {
    type: 'text',
    fn: (data, value) => data.startsWith(value)
  },
  'endWith': {
    type: 'text',
    fn: (data, value) => data.endsWith(value)
  },
  'notStartWith': {
    type: 'text',
    fn: (data, value) => !data.startsWith(value)
  },
  'notEndWith': {
    type: 'text',
    fn: (data, value) => !data.endsWith(value)
  },
  'contain': {
    type: 'text',
    fn: (data, value) => data.includes(value)
  },
  'notContain': {
    type: 'text',
    fn: (data, value) => !data.includes(value)
  },
  'countEqual': {
    type: 'elements',
    fn: (data, value) => data === value
  },
  'countNotEqual': {
    type: 'elements',
    fn: (data, value) => !(data === value)
  },
  'countMore': {
    type: 'elements',
    fn: (data, value) => data > value
  },
  'countLess': {
    type: 'elements',
    fn: (data, value) => data < value
  }
};
