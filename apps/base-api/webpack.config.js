const { NxAppWebpackPlugin } = require('@nx/webpack/app-plugin');
const { join } = require('path');

module.exports = {
  output: {
    path: join(__dirname, '../../dist/apps/base-api'),
  },
  plugins: [
    new NxAppWebpackPlugin({
      target: 'node',
      compiler: 'tsc',
      main: './src/main.ts',
      tsConfig: './tsconfig.app.json',
      assets: ['./src/assets'],
      watch: true,
      watchOptions: {
        ignored: ['node_modules'],
        poll: 1000,
      },
      optimization: process.env.APP_ENV === 'production',
      outputHashing: process.env.APP_ENV === 'production' ? 'all' : 'none',
    }),
  ],
};
