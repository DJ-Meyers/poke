// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from 'eslint-plugin-storybook';

import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import eslintConfigPrettier from 'eslint-config-prettier';
import eslintPluginPrettier from 'eslint-plugin-prettier/recommended';
import noRelativeImportPaths from 'eslint-plugin-no-relative-import-paths';
import unicorn from 'eslint-plugin-unicorn';
import preferArrow from 'eslint-plugin-prefer-arrow';
import reactPreferFunctionComponent from 'eslint-plugin-react-prefer-function-component';
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
      eslintConfigPrettier,
      eslintPluginPrettier,
    ],
    plugins: {
      'no-relative-import-paths': noRelativeImportPaths,
      unicorn,
      'prefer-arrow': preferArrow,
      'react-prefer-function-component': reactPreferFunctionComponent,
    },
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    rules: {
      '@typescript-eslint/no-unused-vars': 'error',
      'no-relative-import-paths/no-relative-import-paths': [
        'error',
        {
          allowSameFolder: true,
          rootDir: 'src',
          prefix: '~',
        },
      ],
      // Prefer arrow functions over function declarations
      'prefer-arrow/prefer-arrow-functions': [
        'error',
        {
          disallowPrototype: true,
          singleReturnOnly: false,
          classPropertiesAllowed: false,
        },
      ],
      // Prefer functional components over class components
      'react-prefer-function-component/react-prefer-function-component': [
        'error',
        {
          allowErrorBoundary: true,
        },
      ],
      // Enforce kebab-case for non-component files
      'unicorn/filename-case': [
        'error',
        {
          cases: {
            kebabCase: true,
          },
          ignore: [
            // Allow common React component file patterns
            /^[A-Z].*\.tsx$/,
            /\.stories\.tsx$/,
            /\.test\.tsx?$/,
            // Allow index files
            /^index\.tsx?$/,
            // Allow view/container patterns
            /^(view|container)\.tsx$/,
          ],
        },
      ],
    },
  },
  ...storybook.configs['flat/recommended'],
]);
