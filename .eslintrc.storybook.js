/* eslint-env node */
module.exports = {
  extends: ['./.eslintrc.cjs'],
  rules: {
    'no-console': 'off',
    'react-hooks/rules-of-hooks': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
  },
  overrides: [
    {
      files: ['**/*.stories.*', '.storybook/**/*'],
      rules: {
        'no-console': 'off',
        'react-hooks/rules-of-hooks': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
      },
    },
  ],
};
