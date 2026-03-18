import js from '@eslint/js';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import importPlugin from 'eslint-plugin-import';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import prettier from 'eslint-plugin-prettier';
import globals from 'globals';

export default [
  // Global ignore patterns
  {
    ignores: ['dist/**', 'node_modules/**', '*.config.js', '.*.js'],
  },
  // JavaScript and JSX files
  {
    files: ['**/*.{js,jsx,mjs,cjs}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node, // for config files like vite.config.js
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      react,
      'react-hooks': reactHooks,
      import: importPlugin,
      'jsx-a11y': jsxA11y,
      prettier,
    },
    rules: {
      // Prettier integration
      'prettier/prettier': 'error',

      // React rules
      'react/react-in-jsx-scope': 'off', // Not needed with new JSX transform
      'react/jsx-uses-react': 'off',      // Not needed
      'react/prop-types': 'off',           // Disable prop-types (we don't use them)
      'react/jsx-uses-vars': 'error',      // Prevent variables used in JSX from being marked as unused

      // React Hooks rules
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      // Import rules
      'import/no-unresolved': 'error',
      'import/named': 'error',
      'import/default': 'error',
      'import/namespace': 'error',
      'import/export': 'error',

      // Accessibility rules (optional)
      'jsx-a11y/alt-text': 'warn',

      // General JavaScript rules
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'no-console': 'warn',
    },
    settings: {
      react: {
        version: 'detect',
      },
      'import/resolver': {
        node: {
          extensions: ['.js', '.jsx'],
        },
      },
    },
  },
  // Special handling for configuration files (if needed)
  {
    files: ['*.config.js', '.*.js'],
    languageOptions: {
      sourceType: 'module', // Allow import/export in config files
    },
    rules: {
      'import/no-anonymous-default-export': 'off', // Allow default export
    },
  },
];