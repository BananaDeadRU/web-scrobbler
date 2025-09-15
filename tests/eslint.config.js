// eslint.config.js
import { defineConfig } from 'eslint-define-config';

export default defineConfig({
  root: true,
  languageOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
  },
  env: {
    browser: true,
    node: true,
    es2021: true,
  },
  plugins: {
    react: 'eslint-plugin-react',
    '@typescript-eslint': '@typescript-eslint/eslint-plugin',
    prettier: 'eslint-plugin-prettier',
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended'
  ],
  rules: {
    // примеры твоих правил
    'quotes': ['error', 'single'],
    'semi': ['error', 'always'],
    'curly': ['error', 'all'],
    '@typescript-eslint/no-unused-vars': ['warn'],
    '@typescript-eslint/no-explicit-any': ['off'],
    '@typescript-eslint/no-unsafe-assignment': ['off'],
    '@typescript-eslint/no-unsafe-member-access': ['off'],
    '@typescript-eslint/no-unsafe-call': ['off'],
    '@typescript-eslint/no-unsafe-return': ['off'],
  },
  settings: {
    react: {
      version: 'detect', // автоматически подбирает версию React
    },
  },
});
