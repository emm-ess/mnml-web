/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
    root: true,
    parserOptions: {
        ecmaVersion: 'latest',
    },

    extends: [
        'plugin:vue/vue3-essential',
        'eslint:recommended',
        '@vue/eslint-config-typescript',
        '@vue/eslint-config-prettier',
        'plugin:promise/recommended',

        // imports & import-sorting
        'plugin:import/recommended',

        // misc
        'plugin:eslint-comments/recommended',
        'plugin:json/recommended',

        // compatibility
        'plugin:compat/recommended',

        // code-smell-detection / code-quality
        'plugin:unicorn/recommended',
        'plugin:sonarjs/recommended',
        'plugin:import/typescript',
    ],
    plugins: ['@typescript-eslint', 'deprecation', 'simple-import-sort'],

    reportUnusedDisableDirectives: true,

    rules: {
        'no-console': process.env.NODE_ENV === 'production'
            ? 'error'
            : 0,
        'no-debugger': process.env.NODE_ENV === 'production'
            ? 'error'
            : 0,
        indent: [
            'error',
            4,
            {
                // 0 would be nicer but somehow eslint is not working with that
                SwitchCase: 1,
            },
        ],
        'brace-style': [
            'error',
            'stroustrup',
            {
                allowSingleLine: true,
            },
        ],
        'space-before-function-paren': [
            'error',
            {
                anonymous: 'never',
                named: 'never',
                asyncArrow: 'always',
            },
        ],
        'no-multi-spaces': [
            'error',
            {
                exceptions: {
                    VariableDeclarator: true,
                    ImportDeclaration: true,
                },
            },
        ],
        'comma-dangle': ['error', 'always-multiline'],
        'key-spacing': [
            'error',
            {
                mode: 'minimum',
            },
        ],
        'object-property-newline': [
            'error',
            {
                allowAllPropertiesOnSameLine: true,
            },
        ],
        semi: [
            'error',
            'never',
            {
                beforeStatementContinuationChars: 'always',
            },
        ],
        'no-use-before-define': 'off',
        'no-unused-vars': 'off',
        'no-undef': 'off',
        'multiline-ternary': ['warn', 'always'],
        'operator-linebreak': ['warn', 'before'],
        quotes: ['error', 'single'],
        'prettier/prettier': ['off'],

        '@typescript-eslint/consistent-type-imports': [
            'error',
            {
                prefer: 'type-imports',
            },
        ],

        // we define those explicitly because react-config has other defaults
        'quote-props': ['error', 'as-needed'],
        'object-curly-spacing': ['error', 'never'],
        'arrow-parens': ['error', 'always'],

        'import/no-unresolved': 0,

        // import sorting
        'sort-import': 0,
        'import/order': 0,
        'simple-import-sort/imports': 'error',
        'simple-import-sort/exports': 'error',
    },

    overrides: [
        {
            files: ['*.vue', '*.spec.ts'],
            rules: {
                'unicorn/filename-case': 0,
                'unicorn/no-null': 0,
            },
        },
        {
            files: ['env.d.ts'],
            rules: {
                'unicorn/prevent-abbreviations': 0,
            },
        },
    ],
}
