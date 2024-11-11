const { NxWebpackPlugin, composePlugins, withNx } = require('@nx/webpack');
const { join } = require('path');

module.exports = composePlugins(withNx(),(config, {options, context }) => {
  return config;
});
