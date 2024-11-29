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
    file: 'public/build/bundle.js',
  },
  plugins: [
    svelte({
      compilerOptions: {
        dev: !production, // Enable dev mode when not in production
      },
      emitCss: true, // Emit CSS to a separate file
    }),
    css({ output: 'bundle.css' }), // Write CSS to bundle.css
    resolve({
      browser: true, // Resolve browser-compatible modules
      dedupe: ['svelte'], // Avoid duplicate Svelte modules
    }),
    commonjs(), // Convert CommonJS modules to ES modules
    !production &&
  livereload({
    watch: 'public',
    port: 35731, // Use a different port
  }),
    production && terser(), // Minify JavaScript in production
  ],
  watch: {
    clearScreen: false, // Prevent clearing the console on rebuild
  },
};
