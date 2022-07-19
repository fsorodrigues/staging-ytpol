const sveltePreprocess = require('svelte-preprocess');

module.exports = {
    preprocess: sveltePreprocess({
        scss: {
            prependData: `@import './src/styles/global.scss';`
        },
        postcss: {
            plugins: [require('autoprefixer')]
        }
    })
};
