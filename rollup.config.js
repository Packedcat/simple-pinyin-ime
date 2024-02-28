import esbuild from 'rollup-plugin-esbuild'
import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'

/**
 * @type {import('rollup').RollupOptions}
 */
const config = {
  input: 'src/index.ts',
  output: {
    file: 'dist/lib.js',
    format: 'umd',
    name: 'EinsIME',
  },
  plugins: [esbuild(), commonjs(), resolve({ browser: true })],
}

export default config
