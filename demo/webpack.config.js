
module.exports = {
  mode: 'development',
  entry: './index.tsx',
  output: {
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loaders: ['awesome-typescript-loader']
      }
    ]
  }
};
