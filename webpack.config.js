const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const outputDir = path.resolve(__dirname, "build");
const template = path.resolve(__dirname, "templates/index.html");
const publicPath = process.env.PUBLIC_PATH || "/";

module.exports = {
  entry: "./src/index.tsx",
  output: {
    path: outputDir,
    publicPath: publicPath,
    filename: "main.bundle.js",
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: ["ts-loader"],
        exclude: /node_modules/,
      },
      {
        test : /\.geojson$/,
        use : ["json-loader"],
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx"],
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: template,
    }),
  ],
  devtool: "source-map",
  devServer: {
    static: {
      directory: outputDir,
    },
    port: 9999,
    historyApiFallback: true,
  },
};
