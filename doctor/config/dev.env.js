/*
 * @Date: 2022-04-21 10:55:47
 * @LastEditors: yanmin
 * @LastEditTime: 2022-04-21 13:31:26
 * @FilePath: \lulutong-yunyiyuan-html_cloudHosForDoctor-yzy\config\dev.env.js
 */
"use strict";
const merge = require("webpack-merge");
const prodEnv = require("./prod.env");

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  baseURL: '"http://10.11.16.150/"',
  // baseURL: '"/proxy"',
  firmId: '"dev"',
  appid: '"wx900b84b59740b8d4"',
  iosappId: "1535751271",
  finderName: '"dist"',
  agoraAppID: '"45bc5769f3c74fa28346a7561657d179"'
});
