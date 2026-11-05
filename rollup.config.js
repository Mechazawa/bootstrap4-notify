import terser from '@rollup/plugin-terser';

const output = {
    format: 'umd',
    name: 'BootstrapNotify',
    exports: 'named',
    globals: { jquery: 'jQuery' },
};

export default {
    input: 'src/bootstrap-notify.js',
    external: ['jquery'],
    output: [
        { ...output, file: 'dist/bootstrap-notify.umd.cjs' },
        { ...output, file: 'dist/bootstrap-notify.umd.min.js', plugins: [terser()] },
    ],
};
