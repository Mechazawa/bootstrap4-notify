import js from '@eslint/js';
import globals from 'globals';

export default [
    { ignores: ['dist/', 'scratchpad/'] },
    js.configs.recommended,
    {
        languageOptions: {
            globals: { ...globals.browser },
        },
    },
    {
        files: ['*.config.js'],
        languageOptions: {
            globals: { ...globals.node },
        },
    },
];
