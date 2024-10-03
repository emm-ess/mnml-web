import {fileURLToPath, URL} from 'node:url'

import vue from '@vitejs/plugin-vue'
import browserslistToEsbuild from 'browserslist-to-esbuild'
import {defineConfig} from 'vite'
import checker from 'vite-plugin-checker'
import mkcert from 'vite-plugin-mkcert'

// https://vitejs.dev/config/
export default defineConfig({
    build: {
        target: browserslistToEsbuild(),
    },
    server: {
        open: true,
        https: true,
    },
    plugins: [
        mkcert(),
        process.env.VITEST
            ? undefined
            : checker({
                vueTsc: true,
                eslint: {
                    lintCommand: 'eslint .',
                    useFlatConfig: true,
                },
                stylelint: {
                    lintCommand: 'stylelint \'**/*.{vue,htm,html,sass}\' --cache',
                },
            }),
        vue(),
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('src', import.meta.url)),
        },
    },
    css: {
        preprocessorOptions: {
            sass: {
                quietDeps: true,
            },
        },
    },
})
