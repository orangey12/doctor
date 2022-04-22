"use strict";
//开发环境
let hisdev = {
  NODE_ENV: '"production"',
  ENV_CONFIG: '"hisdev"',
  finderName: '"dist"',
  appid: '"wxa44359c5ebfba07f"',
  agoraAppID: '"45bc5769f3c74fa28346a7561657d179"',
  firmId: '"dev"',
  name: '"医小鹿"',
  patientImg: '"@/assets/img/index/admin.png"',
  downColor: '"#14A0E6"',
  logoSrc: '"@/assets/img/my/fit_logo.png"',
  jpushVip: '"1"',
  baseURL: '"https://dev.llootong.net/"' //线上环境 https://llootong.net/hisdev/
}
//测试
let test = {
  NODE_ENV: '"production"',
  ENV_CONFIG: '"test"',
  firmId: '"test"',
  finderName: '"dist"',
  appid: '"wxa44359c5ebfba07f"',
  agoraAppID: '"45bc5769f3c74fa28346a7561657d179"',
  name: '"医小鹿"',
  patientImg: '"@/assets/img/index/admin.png"',
  logoSrc: '"@/assets/img/my/fit_logo.png"',
  jpushVip: '"1"',
  baseURL: '"https://test.llootong.net/"' //线上环境
}
//正式环境
let prod = {
  NODE_ENV: '"production"',
  ENV_CONFIG: '"prod"',
  firmId: '"YiXiaoLu"',
  finderName: '"dist"',
  agoraAppID: '"45bc5769f3c74fa28346a7561657d179"',
  appid: '"wxe1d5f70e314b9f58"',
  name: '"医小鹿"',
  patientImg: '"@/assets/img/index/admin.png"',
  logoSrc: '"@/assets/img/my/fit_logo.png"',
  jpushVip: '"1"',
  baseURL: '"https://llootong.cn/"', //线上环境  192.168.0.107:8300
}
//鹰眼智能
let yyzn = {
  NODE_ENV: '"production"',
  firmId: '"yzy"',//正式的
  // firmId: '"testyzy"',//测试的
  ENV_CONFIG: '"yyzn"',
  appid: '"wx1227833536f46c0d"',
  iosappId: "1535751271",
  name: '"鹰眼智能"',
  patientImg: '"@/assets/img/yyzn_logo.png"',
  logoSrc: '"@/assets/img/yyzn.png"',
  jpushVip: '"0"',
  finderName: '"yyzn"',
  agoraAppID: '"bd1c1a306b8d4b2c9c1521a2b47ce2bb"',
  baseURL: '"http://10.11.16.150/"',
  // baseURL: '"https://care.aiyzy.com/"',//线上环境
  // baseURL: '"https://testyzy.imizan.cn/"' ,//开发测试用线上环境
}
//金益康
let jyk = {
  NODE_ENV: '"production"',
  ENV_CONFIG: '"jyk"',
  firmId: '"JinYiKang"',
  finderName: '"jyk"',
  appid: '"wx900b84b59740b8d4"',
  agoraAppID: '"a270edbdb1ae4947b29d41e40f4ce32c"',
  iosappId: "1559000822",
  name: '"金益康"',
  patientImg: '"@/assets/img/jykLogo2.png"',
  logoSrc: '"@/assets/img/jykLogo.png"',
  jpushVip: '"1"',
  baseURL: '"https://jykzs.com/"', //线上环境
}
//演示环境
let YanShi = {
  NODE_ENV: '"production"',
  ENV_CONFIG: '"YanShi"',
  firmId: '"YanShi"',
  finderName: '"YanShi"',
  appid: '"wxfed1f1e2839756e9"',
  agoraAppID: '"45bc5769f3c74fa28346a7561657d179"',
  name: '"鹿鹿通"',
  patientImg: '"@/assets/img/index/admin.png"',
  logoSrc: '"@/assets/img/my/fit_logo.png"',
  jpushVip: '"1"',
  baseURL: '"https://yanshi.llootong.net/"',//线上环境
}
//tang
let tang = {
  NODE_ENV: '"production"',
  ENV_CONFIG: '"tang"',
  firmId: '"tang"',
  finderName: '"tang"',
  agoraAppID: '"45bc5769f3c74fa28346a7561657d179"',
  appid: '"wx692ff6889382806e"',
  name: '"鹿鹿通"',
  patientImg: '"@/assets/img/index/admin.png"',
  logoSrc: '"@/assets/img/my/fit_logo.png"',
  jpushVip: '"1"',
  baseURL: '"https://tang.imizan.cn/"' //线上环境
}
//海大夫（易诺为）
let yinuowei = {
  NODE_ENV: '"production"',
  ENV_CONFIG: '"yinuowei"',
  firmId: '"yinuowei"',
  finderName: '"yinuowei"',
  appid: '"wx3e501c41b0e38096"',
  agoraAppID: '"45bc5769f3c74fa28346a7561657d179"',
  name: '"海大夫"',
  patientImg: '"@/assets/img/yinuowei_logo.png"',
  logoSrc: '"@/assets/img/yinuowei_logo.png"',
  jpushVip: '"0"',
  baseURL: '"https://medical.hi-dr.com/"', //线上环境
}
//和信康互联网医院
let hexinkang = {
  NODE_ENV: '"production"',
  ENV_CONFIG: '"hexinkang"',
  firmId: '"hexinkang"',
  finderName: '"hexinkang"',
  appid: '"wx299da2eacf254b76"',
  agoraAppID: '"45bc5769f3c74fa28346a7561657d179"',
  name: '"和信康互联网医院"',
  patientImg: '"@/assets/img/hexinkang_logo.png"',
  logoSrc: '"@/assets/img/hexinkang_logo.png"',
  jpushVip: '"0"',
  baseURL: '"https://hexinkang.imizan.cn/"', //线上环境
}
//智众医信
let zhizhong = {
  NODE_ENV: '"production"',
  ENV_CONFIG: '"zhizhong"',
  firmId: '"zhizhong"',
  finderName: '"zhizhong"',
  appid: '"wx9390904a6dc6c377"',
  agoraAppID: '"45bc5769f3c74fa28346a7561657d179"',
  name: '"智众医信"',
  patientImg: '"@/assets/img/zhizhong_logo.png"',
  logoSrc: '"@/assets/img/zhizhong_logo.png"',
  jpushVip: '"0"',
  baseURL: '"https://hospital.zz-med.com/"', //线上环境
}
//生命历
let shengji = {
  NODE_ENV: '"production"',
  ENV_CONFIG: '"shengji"',
  firmId: '"shengji"',
  finderName: '"shengji"',
  agoraAppID: '"45bc5769f3c74fa28346a7561657d179"',
  appid: '"wx993b9eb44d00e4bb"',
  name: '"生命历"',
  patientImg: '"@/assets/img/shengji_logo.png"',
  logoSrc: '"@/assets/img/shengji_logo.png"',
  jpushVip: '"0"',
  baseURL: '"https://sjo2o.com/"' //线上环境
}
//葫芦简医
let hulujianyi = {
  NODE_ENV: '"production"',
  ENV_CONFIG: '"hulujianyi"',
  firmId: '"hulujianyi"',
  finderName: '"hulujianyi"',
  agoraAppID: '"45bc5769f3c74fa28346a7561657d179"',
  appid: '"wxefd38fa12c64629e"',
  name: '"葫芦简医"',
  patientImg: '"@/assets/img/hulujianyi_logo.png"',
  logoSrc: '"@/assets/img/hulujianyi_logo.png"',
  jpushVip: '"0"',
  baseURL: '"https://hulujianyi.imizan.cn/"' //线上环境
}
//天津九吉互联网医院
let jiuji = {
  NODE_ENV: '"production"',
  ENV_CONFIG: '"jiuji"',
  firmId: '"jiuji"',
  finderName: '"jiuji"',
  agoraAppID: '"45bc5769f3c74fa28346a7561657d179"',
  appid: '"wx1820b821bdef2a92"',
  name: '"天津九吉互联网医院"',
  patientImg: '"@/assets/img/jiuji_logo.png"',
  logoSrc: '"@/assets/img/jiuji_logo.png"',
  jpushVip: '"0"',
  baseURL: '"https://jiuji.imizan.cn/"' //线上环境
}
//丹丹狮
let dandanshi = {
  NODE_ENV: '"production"',
  ENV_CONFIG: '"dandanshi"',
  firmId: '"dandanshi"',
  finderName: '"dandanshi"',
  appid: '"wxf5771e551cf6cd99"',
  agoraAppID: '"45bc5769f3c74fa28346a7561657d179"',
  name: '"丹丹狮"',
  patientImg: '"@/assets/img/dandanshi_logo.png"',
  logoSrc: '"@/assets/img/dandanshi_logo.png"',
  jpushVip: '"0"',
  baseURL: '"https://ddlion-api.chic-health.com/"', //线上环境
}
//国康中健
let gookang = {
  NODE_ENV: '"production"',
  ENV_CONFIG: '"gookang"',
  firmId: '"gookang"',
  finderName: '"gookang"',
  agoraAppID: '"45bc5769f3c74fa28346a7561657d179"',
  appid: '"wxafe451fe439a5bcb"',
  name: '"国康中健"',
  patientImg: '"@/assets/img/gookang_logo.png"',
  logoSrc: '"@/assets/img/gookang_logo.png"',
  jpushVip: '"0"',
  baseURL: '"https://his.gookang.com/"' //线上环境
}
//易赋诊
let yifuzheng = {
  NODE_ENV: '"production"',
  ENV_CONFIG: '"yifuzheng"',
  firmId: '"yifuzhen"',
  finderName: '"yifuzheng"',
  agoraAppID: '"45bc5769f3c74fa28346a7561657d179"',
  appid: '"wx004614b5f9bb7848"',
  name: '"易赋诊"',
  patientImg: '"@/assets/img/yifuzheng_logo.png"',
  logoSrc: '"@/assets/img/yifuzheng_logo.png"',
  jpushVip: '"0"',
  baseURL: '"https://yifuzheng.imizan.cn/"', //线上环境
}
//馥方堂
let fft = {
  NODE_ENV: '"production"',
  ENV_CONFIG: '"fft"',
  firmId: '"fft"',
  finderName: '"fft"',
  appid: '"wxfed1f1e2839756e9"',
  agoraAppID: '"45bc5769f3c74fa28346a7561657d179"',
  name: '"馥方堂"',
  patientImg: '"@/assets/img/fft_logo.png"',
  logoSrc: '"@/assets/img/fft_logo.png"',
  jpushVip: '"0"',
  baseURL: '"https://fufangtang.imizan.cn/"',//线上环境
}
//千寻健康
let lanmi = {
  NODE_ENV: '"production"',
  ENV_CONFIG: '"lanmi"',
  firmId: '"lanmi"',
  finderName: '"lanmi"',
  appid: '"wxfefe5f093ccf0910"',
  name: '"千寻健康"',
  agoraAppID: '"45bc5769f3c74fa28346a7561657d179"',
  patientImg: '"@/assets/img/lanmi_logo.png"',
  logoSrc: '"@/assets/img/lanmi_logo.png"',
  jpushVip: '"0"',
  baseURL: '"https://lanmi.imizan.cn/"',//线上环境
}
//医享慧
let huiyi = {
  NODE_ENV: '"production"',
  ENV_CONFIG: '"huiyi"',
  firmId: '"huiyi"',
  finderName: '"huiyi"',
  agoraAppID: '"45bc5769f3c74fa28346a7561657d179"',
  appid: '"wx58fdf24245cd51c8"',
  name: '"医享慧"',
  patientImg: '"@/assets/img/huiyi_logo.png"',
  logoSrc: '"@/assets/img/huiyi_logo.png"',
  jpushVip: '"0"',
  baseURL: '"https://huiyi.manbingyisheng.com/"',//线上环境
}
//德康堂
let dkt = {
  NODE_ENV: '"production"',
  ENV_CONFIG: '"dkt"',
  firmId: '"dkt"',
  finderName: '"dkt"',
  appid: '"wx900b84b59740b8d4"',
  agoraAppID: '"45bc5769f3c74fa28346a7561657d179"',
  name: '"德康堂"',
  patientImg: '"@/assets/img/dktLogo.png"',
  logoSrc: '"@/assets/img/dktLogo.png"',
  jpushVip: '"0"',
  baseURL: '"https://dekangtang.imizan.cn/his/"',//线上环境
}

module.exports = {
  prod: prod,
  test: test,
  hisdev: hisdev,
  jyk: jyk,
  yyzn: yyzn,
  YanShi: YanShi,
  tang: tang,
  yinuowei: yinuowei,
  dkt: dkt,
  huiyi: huiyi,
  lanmi: lanmi,
  fft: fft,
  yifuzheng: yifuzheng,
  gookang: gookang,
  dandanshi: dandanshi,
  hulujianyi: hulujianyi,
  hexinkang: hexinkang,
  jiuji: jiuji,
  shengji: shengji,
  zhizhong: zhizhong,
};
