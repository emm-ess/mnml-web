const stylusBuiltinFunctions = ['percentage']

export default {
    root: true,

    fix: false,

    extends: ['stylelint-config-standard', 'stylelint-stylus/standard', 'stylelint-config-outside-in-order'],

    plugins: [
        // sass is still not working with stylelint :(
        // 'stylelint-no-unsupported-browser-features',
        '@stylistic/stylelint-plugin',
        'stylelint-high-performance-animation',
        'stylelint-declaration-block-no-ignored-properties',
        'stylelint-declaration-strict-value',
    ],

    reportInvalidScopeDisables: true,
    reportNeedlessDisables: true,

    rules: {
        /* these rules aren't compatible with SASS in .vue files and therefore turned off on
           global level */
        // '@stylistic/block-opening-brace-space-before': null,
        // '@stylistic/block-opening-brace-space-after': null,
        // '@stylistic/block-closing-brace-space-before': null,
        // '@stylistic/block-closing-brace-newline-before': null,
        // '@stylistic/declaration-block-trailing-semicolon': null,

        '@stylistic/indentation': 4,
        'stylus/indentation': 4,
        '@stylistic/string-quotes': 'single',
        '@stylistic/max-empty-lines': 3,

        'selector-pseudo-class-no-unknown': [
            true,
            {
                ignorePseudoClasses: ['deep', 'slotted', 'global'],
            },
        ],
        'function-no-unknown': [
            true,
            {
                ignoreFunctions: ['v-bind', ...stylusBuiltinFunctions],
            },
        ],
        'declaration-property-value-no-unknown': [
            true,
            {
                ignoreProperties: {
                    '/.+/': stylusBuiltinFunctions.map((funcName) => {
                        return `/^${funcName}(.*)$/`
                    }),
                },
            },
        ],

        'at-rule-no-vendor-prefix': true,
        'media-feature-name-no-vendor-prefix': true,
        'property-no-vendor-prefix': true,
        'selector-no-vendor-prefix': true,
        'value-no-vendor-prefix': true,
        'max-nesting-depth': 3,
        'selector-max-id': 1,
        'selector-no-qualifying-type': null,
        'no-descending-specificity': null,
        'font-family-name-quotes': 'always-where-recommended',
        'font-family-no-missing-generic-family-keyword': null,

        // 'plugin/no-unsupported-browser-features': [true, {
        //     ignorePartialSupport: true,
        //     severity: 'warning',
        // }],
        'plugin/no-low-performance-animation-properties': true,
        'plugin/declaration-block-no-ignored-properties': true,

        'number-max-precision': 5,
    },

    overrides: [
        {
            files: ['**/*.html'],
            customSyntax: 'postcss-html',
        },
        {
            files: ['**/*.vue'],
            customSyntax: 'postcss-html',
        },
        {
            files: ['**/*.scss', '*.scss'],
            customSyntax: 'postcss-scss',
            extends: ['stylelint-config-standard-scss'],
            rules: {
                'stylus/at-rule-no-unknown': null,
            },
        },
        {
            files: ['**/*.styl', '*.styl'],
            rules: {
                'nesting-selector-no-missing-scoping-root': null,
            },
        },
    ],
}
