module.exports = {
    root: true,
    env: {
        // "browser": true,
        node: true
    },
    extends: ['plugin:vue/essential', 'eslint:recommended'],
    globals: {
        Atomics: 'readonly',
        SharedArrayBuffer: 'readonly',
        // 支持全局变量GLOBAL的引用
        GLOBAL: true
    },
    plugins: ['html', 'json'],
    parserOptions: {
        parser: 'babel-eslint'
    },
    plugins: ['vue'],
    rules: {
        'no-console': 'off',
        'vue/require-v-for-key': 'off',
        'no-unused-vars': 'off'
    }
}
