const path = require('path');

let webbpackConfig;

if (process.env.WEBPACK_ENV.toLowerCase() === 'lib') {
  webbpackConfig = {
    mode: 'production',
    entry: {
      'moip-sdk-js.js': [
        path.resolve(__dirname, 'lib/jsencrypt.min.js'),
        path.resolve(__dirname, 'src/index.js')
      ]
    },
    output: {
      filename: '[name]',
      path: path.resolve(__dirname, 'dist'),
      library: 'MoipSdkJs',
      libraryTarget: 'global',
    },
  };
} else {
  webbpackConfig = {
    mode: 'production',
    entry: path.resolve(__dirname, 'src/index.js'),
    output: {
      filename: 'index.js',
      path: path.resolve(__dirname),
      libraryTarget: 'commonjs',
    }
  };
}


module.exports = webbpackConfig;