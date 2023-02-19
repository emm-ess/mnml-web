module.exports = {
    root: true,

    fix: false,

    extends: ['stylelint-config-standard', 'stylelint-config-sass-guidelines', 'stylelint-config-outside-in-order'],

    plugins: [
        'stylelint-no-unsupported-browser-features',
        'stylelint-high-performance-animation',
        'stylelint-declaration-block-no-ignored-properties',
        'stylelint-declaration-strict-value',
    ],

    reportInvalidScopeDisables: true,
    reportNeedlessDisables: true,

    rules: {
        /* these rules aren't compatible with SASS in .vue files and therefore turned off on
           global level */
        'block-opening-brace-space-before': null,
        'block-opening-brace-space-after': null,
        'block-closing-brace-space-before': null,
        'block-closing-brace-newline-before': null,
        'declaration-block-trailing-semicolon': null,

        indentation: 4,
        'string-quotes': 'single',
        'at-rule-no-vendor-prefix': true,
        'media-feature-name-no-vendor-prefix': true,
        'property-no-vendor-prefix': true,
        'selector-no-vendor-prefix': true,
        'value-no-vendor-prefix': true,
        'max-nesting-depth': 3,
        'selector-max-id': 1,
        'selector-no-qualifying-type': null,
        'max-empty-lines': 3,
        'no-descending-specificity': null,
        'font-family-name-quotes': 'always-where-recommended',
        'font-family-no-missing-generic-family-keyword': null,

        'plugin/no-unsupported-browser-features': [
            true,
            {
                ignorePartialSupport: true,
                severity: 'warning',
            },
        ],
        'plugin/no-low-performance-animation-properties': true,
        'plugin/declaration-block-no-ignored-properties': true,
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
            files: ['**/*.sass'],
            customSyntax: 'postcss-sass',
        },
    ],
}
