import svelte from 'rollup-plugin-svelte';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import livereload from 'rollup-plugin-livereload';
import css from 'rollup-plugin-css-only';
import terser from '@rollup/plugin-terser';

const production = !process.env.ROLLUP_WATCH;

export default {
  input: 'src/main.js',
  output: {
    sourcemap: true,
    format: 'iife',
    name: 'app',
    file: 'public/build/bundle.js', // Output in public/build
  },
  plugins: [
    svelte({
      compilerOptions: {
        dev: !production,
      },
      emitCss: true,
    }),
    css({ output: 'bundle.css' }), // CSS output
    resolve({
      browser: true,
      dedupe: ['svelte'],
    }),
    commonjs(),
    !production &&
      livereload({
        watch: 'public', // Watch the public directory
        port: 35731,
      }),
    production && terser(),
  ],
  watch: {
    clearScreen: false,
  },
};
