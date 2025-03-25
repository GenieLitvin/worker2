import eslintJs from '@eslint/js'; // Use single quotes as per Prettier
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import prettierPlugin from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';
import globals from 'globals';

const { configs: jsConfigs } = eslintJs; // Destructure the `configs` property

export default [
    {
        ignores: ['node_modules'], // Ignore node_modules
    },
    {
        files: ['**/*.{js,mjs,cjs,ts}'], // Target JavaScript and TypeScript files
        languageOptions: {
            parser: tsParser, // Use TypeScript parser
            ecmaVersion: 'latest', // Use the latest ECMAScript version
            sourceType: 'module', // Use ES modules
            globals: {
                ...globals.node,
                ...globals.jest,
            },
        },
        plugins: {
            '@typescript-eslint': tsPlugin,
            prettier: prettierPlugin,
        },
        linterOptions: {
            reportUnusedDisableDirectives: true, // Report unused ESLint disable comments
        },
        rules: {
            ...jsConfigs.recommended.rules, // Use recommended JavaScript rules
            ...tsPlugin.configs.recommended.rules, // Use recommended TypeScript rules
            ...prettierConfig.rules, // Include Prettier rules
            'prettier/prettier': 'error', // Enforce Prettier formatting
            '@typescript-eslint/no-unused-vars': ['warn'], // Warn on unused variables
            '@typescript-eslint/no-explicit-any': 'off', // Allow the `any` type
            indent: 'off', // Let Prettier handle indentation
            quotes: 'off', // Let Prettier handle quotes
            semi: 'off', // Let Prettier handle semicolons
        },
    },
];
