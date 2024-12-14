import svelte from 'rollup-plugin-svelte';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import livereload from 'rollup-plugin-livereload';
import css from 'rollup-plugin-css-only';
import terser from '@rollup/plugin-terser';
import replace from '@rollup/plugin-replace';

const production = !process.env.ROLLUP_WATCH;

export default {
  input: 'src/main.js',
  output: {
    sourcemap: true,
    format: 'iife',
    name: 'app',
    file: 'public/build/bundle.js',  // Ensure this matches your public folder setup
  },
  plugins: [
    replace({
      preventAssignment: true,
      values: {
        '%BASE%': production ? '/recurring-asset-analysis' : '',  // Update base path for GitHub Pages
      },
    }),
    svelte({
      compilerOptions: {
        dev: !production,
      },
      emitCss: true,
    }),
    css({ output: 'bundle.css' }),  // Output CSS bundle
    resolve({
      browser: true,
      dedupe: ['svelte'],
    }),
    commonjs(),
    !production && livereload({
      watch: 'public',
      port: 35731,
    }),
    production && terser(),
  ],
  watch: {
    clearScreen: false,
  },
};
