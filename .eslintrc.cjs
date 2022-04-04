/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution');

module.exports = {
  root: true,
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/eslint-config-typescript/recommended',
    'plugin:vue/vue3-recommended',
    'plugin:tailwindcss/recommended'
  ],
  env: {
    'vue/setup-compiler-macros': true,
    'browser': true,
    'amd': true,
    'node': true
  },
  plugins: ['tailwindcss'],
  rules: {
    '@typescript-eslint/ban-ts-ignore': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/no-use-before-define': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/ban-types': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    'no-var': 'error',
    // 使用单引号
    quotes: [2, 'single', 'avoid-escape'],
    // 使用 === 替代 ==
    eqeqeq: [2, 'allow-null'],
    //强制使用分号结尾
    semi: ['error', 'always'],
    // 强制使用两个空格执行一致的缩进样式
    indent: ['error', 2],
    //禁止出现多个空格
    'no-multi-spaces': 'error',
    // 禁止多行字符串 
    'no-multi-str': 'error',
    //要求使用一致的 return 语句 
    'consistent-return': 'error',
    //在数组开括号后和闭括号前强制换行
    'array-bracket-newline': [
      'error', { 'minItems': 4,
        multiline: true }
    ],
    // 大括号后必须换行
    'brace-style': 'error',
    // 强制使用骆驼拼写法命名约定
    'camelcase': 'error',
    // 不允许多个空行 
    'no-multiple-empty-lines': 'error',
    // 禁止或强制在代码块中开括号前和闭括号后有空格
    'block-spacing': 'error',
    // 强制在对象字面量的键和值之间使用一致的空格
    'key-spacing': ['error', { 'mode': 'strict' }],
    // 强制在函数括号内使用一致的换行, 函数参数超过三个换行
    'function-paren-newline': ['error', { 'minItems': 3 }],
    // 强制回调函数最大嵌套深度
    'max-nested-callbacks': ['warn', 3],
    // 强制关键字周围空格的一致性 关键字前后必须有空格
    'keyword-spacing': [
      'error', { 'before': true,
        'after': true }
    ],
    // 强制分号之后有空格，禁止分号之前有空格。
    'semi-spacing': 'error',
    //强制在块之前使用一致的空格
    'space-before-blocks': 'error',
    //强制在花括号中使用一致的空格
    'object-curly-spacing': ['error', 'always'],
    // 强制在圆括号内使用一致的空格
    'space-in-parens': 'error',
    // 强制在一元操作符前后使用一致的空格
    'space-unary-ops': 'error',
    'arrow-spacing': 'error',
    // 强制在逗号周围使用空格
    'comma-spacing': [
      'error', { 'before': false,
        'after': true }
    ],
    // 'object-property-newline': 'error',
    // 禁止出现空函数
    'no-empty-function': 'warn',
    // 禁止多余的 return 语句
    'no-useless-return': 'error',
    // 强制可嵌套的块的最大深度4
    'max-depth': 'warn',
    // 要求方法链中每个调用都有一个换行符
    'newline-per-chained-call': ['warn', { ignoreChainWithDepth: 3 }],
    'tailwindcss/no-custom-classname': ['off'],
    // 禁止使用拖尾逗号 
    'comma-dangle': ['error', 'never']
  }
};
