// https://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  env: {
    browser: true,
  },
  // https://github.com/standard/standard/blob/master/docs/RULES-en.md
  extends: 'standard',
  // required to lint *.vue files
  plugins: [
    'html'
  ],
  // add your custom rules here
  /**
   * "off" 或 0 - 关闭规则
   * "warn" 或 1 - 开启规则，使用警告级别的错误：warn (不会导致程序退出),
   * "error" 或 2 - 开启规则，使用错误级别的错误：error (当被触发的时候，程序会退出)
   */
  rules: {
    // 开启4个空格缩进规则
    "indent": [2, 2, { "SwitchCase": 1 }],
    "semi": [2, "always"],//语句强制分号结尾
    "no-undef": [0],//不能有未定义的变量
    "no-extra-parens": 2,//禁止非必要的括号
    "no-caller": 0,//禁止使用arguments.caller或arguments.callee
    "no-var": 0,//禁用var，用let和const代替
    "curly": [2, "all"],//必须使用 if(){} 中的{}
    "radix": 1,//parseInt必须指定第二个参数
    "valid-jsdoc": 0,//jsdoc规则
    "id-match": 0,//命名检测
    "no-unused-vars": 0,  // 变量是否使用过
    // allow async-await
    'generator-star-spacing': 'off',
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off'
  }
}
