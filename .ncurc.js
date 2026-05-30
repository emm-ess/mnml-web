export default {
    reject: [
        // should match locally installed node version
        '@types/node',
        // due to neostandard
        'eslint',
        // due to stylus plugin for stylelint being not compatible with latest stylelint
        '*stylelint*',
    ],
}
