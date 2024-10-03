import path from 'node:path'
import {fileURLToPath} from 'node:url'

import baseConfig from '@emm-ess-configs/eslint-config-vue'
import {includeIgnoreFile} from '@eslint/compat'
import globals from 'globals'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const gitignorePath = path.resolve(__dirname, '.gitignore')

export default [
    includeIgnoreFile(gitignorePath),
    ...baseConfig,
    {
        name: 'vue-stuff',
        files: ['src/**/*'],
        languageOptions: {
            globals: {
                ...globals.browser,
            },
            parserOptions: {
                project: './tsconfig.app.json',
                projectService: true,
            },
        },
    },
    {
        name: 'config-stuff',
        files: ['*.ts'],
        ignores: ['src/**/*.*'],
        languageOptions: {
            globals: {
                ...globals.node,
            },
            parserOptions: {
                project: './tsconfig.node.json',
                projectService: true,
            },
        },
    },
]
