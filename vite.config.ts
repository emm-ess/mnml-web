import {fileURLToPath, URL} from 'node:url'

import vue from '@vitejs/plugin-vue'
import {defineConfig} from 'vite'
import checker from 'vite-plugin-checker'

// https://vitejs.dev/config/
export default defineConfig({
    server: {
        open: true,
    },
    plugins: [
        process.env.VITEST
            ? undefined
            : checker({
                vueTsc: true,
                eslint: {
                    lintCommand:
                          'eslint --ext .vue,.js,.jsx,.cjs,.mjs,.ts,.tsx,.cts,.mts,.json --fix --ignore-path .gitignore .',
                },
                stylelint: {
                    lintCommand: 'stylelint \'**/*.{vue,htm,html,sass}\' --cache --fix',
                },
            }),
        vue(),
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('src', import.meta.url)),
        },
    },
})
