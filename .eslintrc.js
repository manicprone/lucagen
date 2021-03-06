// http://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  env: {
    browser: true,
  },
  extends: 'airbnb-base',
  // required to lint *.vue files
  plugins: [
    'html'
  ],
  // check if imports actually resolve
  'settings': {
    'import/resolver': {
      'webpack': {
        'config': 'build/webpack.base.conf.js'
      }
    }
  },
  'rules': {
    // don't require .vue extension when importing
    'import/extensions': ['error', 'always', { 'js': 'never', 'vue': 'never' }],
    // allow optionalDependencies
    'import/no-extraneous-dependencies': ['error', { 'optionalDependencies': ['test/unit/index.js'] }],
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    'max-len': 'off',
    'no-plusplus': ['error', { 'allowForLoopAfterthoughts': true }],
    'no-use-before-define': ['error', { 'functions': false, 'classes': false }],
    'arrow-body-style': 'off',
    'no-console': 'off',
    'default-case': 'off',
    'dot-notation': 'off',
    'import/prefer-default-export': 'off',
  },
}
