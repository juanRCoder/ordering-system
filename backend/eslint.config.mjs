import eslint from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config({
  ignores: [
    'eslint.config.mjs',
    'dist/**',
    'node_modules/**',
    '*.spec.ts',
    '*.test.ts',
    '*.d.ts',
    'prisma.config.ts',
    'prisma/migrations',
  ],

  extends: [eslint.configs.recommended, ...tseslint.configs.recommended],

  languageOptions: {
    globals: {
      ...globals.node,
      ...globals.jest,
    },
    sourceType: 'commonjs',
    parserOptions: {
      tsconfigRootDir: import.meta.dirname,
    },
  },

  rules: {
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/no-explicit-any': 'warn',
  },
});
