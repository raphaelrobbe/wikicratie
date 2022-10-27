import run from '@rollup/plugin-run';
import typescript from '@rollup/plugin-typescript';

const dev = process.env.NODE_ENV !== 'production';

export default {
  input: './src/server.ts',
  output: {
    file: 'bundle.js',
    format: 'cjs',
  },
  plugins: [
    typescript({
      include: [
        // Project files
        './**/*.ts+(|x)',
        // Files from outside of the project
        '../common/**/*.ts+(|x)',
        '../client/src/**/*.ts+(|x)'
      ]
    }),
    dev && run(),
  ],
  external: ['mysql'],
};
