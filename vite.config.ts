import {fileURLToPath, URL} from 'node:url'

import vue from '@vitejs/plugin-vue'
import browserslistToEsbuild from 'browserslist-to-esbuild'
import {defineConfig} from 'vite'
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
    plugins: [mkcert(), vue()],
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
