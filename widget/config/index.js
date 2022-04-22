/*
 * @Date: 2022-04-21 10:55:47
 * @LastEditors: yanmin
 * @LastEditTime: 2022-04-21 13:21:39
 * @FilePath: \lulutong-yunyiyuan-html_cloudHosForDoctor-yzy\config\index.js
 */
"use strict";
// Template version: 1.3.1
// see http://vuejs-templates.github.io/webpack for documentation.

const path = require("path");
let indexPath, assetsPathDir;
if(process.env.env_config=='test'||process.env.env_config=='hisdev'||process.env.env_config=='prod'){
  indexPath = path.resolve(__dirname, "../../dist/indexVue.html");
  assetsPathDir = path.resolve(__dirname, "../../dist/");
}else{
  indexPath = path.resolve(__dirname, "../../" + process.env.env_config + "/indexVue.html");
  assetsPathDir = path.resolve(__dirname, "../../" + process.env.env_config + "/");
}

module.exports = {
  dev: {
    // Paths
    assetsSubDirectory: "static",
    assetsPublicPath: "/",
    proxyTable: {
      "/proxy": {
        // target: "http://192.168.0.113:8101/",
        // target: "https://llootong.cn/his/",
        target: 'http://10.11.16.150/',
        // target: "http://jykzs.com/his/", // 接口域名设置  https://llootong.net/his/
        // target: "https://dev.llootong.net/", // 接口域名设置  https://llootong.net/hisdev/
        changeOrigin: true,
        pathRewrite: {
          "^/proxy": "",
        },
      },
    },

    // Various Dev Server settings
    host: "10.20.51.121", // can be overwritten by process.env.HOST
    // host: "localhost", // can be overwritten by process.env.HOST
    port: 8080, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
    autoOpenBrowser: false,
    errorOverlay: true,
    notifyOnErrors: true,
    poll: false, // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-

    /**
     * Source Maps
     */

    // https://webpack.js.org/configuration/devtool/#development
    devtool: "cheap-module-eval-source-map",

    // If you have problems debugging vue-files in devtools,
    // set this to false - it *may* help
    // https://vue-loader.vuejs.org/en/options.html#cachebusting
    cacheBusting: true,

    cssSourceMap: true,
  },

  build: {
    // Template for index.html
    index: indexPath,

    // Paths
    assetsRoot: assetsPathDir,
    assetsSubDirectory: "static",
    assetsPublicPath: "./",

    /**
     * Source Maps
     */

    productionSourceMap: false,
    // https://webpack.js.org/configuration/devtool/#production
    devtool: "#source-map",

    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ["js", "css"],

    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report,
  },
};
