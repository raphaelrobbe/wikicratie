module.exports = {
  root: true,
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  // ecmaFeatures:  {
  //   jsx:  true,  // Allows for the parsing of JSX
  // },
  extends: [
    // 'eslint:recommended',
    // 'plugin:@typescript-eslint/recommended',
    // 'plugin:@typescript-eslint/eslint-recommended',
    // 'plugin:react/recommended',
    // 'prettier',
    // 'airbnb',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: [
    '@typescript-eslint',
    'react-hooks',
  ],
  rules: {
    'array-bracket-spacing': ['warn', 'never'],
    'arrow-parens': 'off',
    'interface-name': 'off',
    'interface-over-type-literal': 'off',
    'jsx-no-multiline-js': 'off',
    'key-spacing': 'off',
    'max-classes-per-file': 'off',
    'max-len': ['warn', { 'code': 120 }],
    'member-ordering': 'off',
    'new-parens': 'warn',
    'no-angle-bracket-type-assertion': 'off',
    'no-bitwise': 'warn',
    'no-consecutive-blank-lines': 'off',
    'no-console': 'off',
    'no-empty': 'warn',
    'no-extra-semi': 'off',
    'no-multi-spaces': 'off',
    'no-return-await': 'off',
    'no-shadowed-variable': 'off',
    'no-trailing-whitespace': 'off',
    'object-curly-spacing': ['warn', 'always'],
    'object-literal-sort-keys': 'off',
    'ordered-imports': 'off',
    'prefer-const': 'warn',
    'react-hooks/exhaustive-deps': 'warn',
    'react/destructuring-assignment': 'warn',
    'react/prop-types': 'off',
    'react/jsx-filename-extension': [1, { "extensions": [".tsx", ".jsx"] }],
    'quotemark': 'off',
    'trailing-comma': 'off',
    'variable-name': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/type-annotation-spacing': 'off',
    '@typescript-eslint/camelcase': 'off',
    // Customize rules here.
  },
  settings: {
    react: {
      "createClass": "createReactClass", // Regex for Component Factory to use,
      // default to "createReactClass"
      "pragma": "React",  // Pragma to use, default to "React"
      "version": "detect", // React version. "detect" automatically picks the version you have installed.
      // You can also use `16.0`, `16.3`, etc, if you want to override the detected value.
      // default to latest and warns if missing
      // It will default to "detect" in the future
      "flowVersion": "0.53" // Flow version
    },
    // "propWrapperFunctions": [
    //   // The names of any function used to wrap propTypes, e.g. `forbidExtraProps`. If this isn't set, any propTypes wrapped in a function will be skipped.
    //   "forbidExtraProps",
    //   { "property": "freeze", "object": "Object" },
    //   { "property": "myFavoriteWrapper" }
    // ],
    "linkComponents": [
      // Components used as alternatives to <a> for linking, eg. <Link to={ url } />
      "Hyperlink",
      { "name": "Link", "linkAttribute": "to" }
    ]
  }
};
