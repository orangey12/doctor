/*
 * @Date: 2022-04-21 10:55:47
 * @LastEditors: yanmin
 * @LastEditTime: 2022-04-21 13:30:46
 * @FilePath: \lulutong-yunyiyuan-html_cloudHosForDoctor-yzy\config\yzy.env.js
 */
"use strict";
const merge = require("webpack-merge");
const prodEnv = require("./yyzn.env");

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  // baseURL: '"https://care.aiyzy.com/"',
  baseURL: 'http://10.11.16.150/',
  // baseURL: '"https://testyzy.imizan.cn/"' ,//开发测试用线上环境
  firmId: '"yzy"',
  ENV_CONFIG: '"yyzn"',
  appid: '"wx1227833536f46c0d"',
  iosappId: "1535751271",
  finderName: '"yyzn"',
  agoraAppID: '"bd1c1a306b8d4b2c9c1521a2b47ce2bb"'
});
