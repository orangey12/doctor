import request from "@/axios/request";
const user = {};

/**
 * 发送验证码
 */
export function sendCaptcha(data) {
  return request({
    url: "basic/hisLogin/sendCaptcha",
    method: "post",
    data: data
  });
}

/**
 * 医生第一次登陆时设置密码
 */
export function hisDoctorFirstLogSetPassword(data) {
  return request({
    url: "basic/hisLogin/hisDoctorFirstLogSetPassword",
    method: "post",
    data: data
  });
}



/**
 * HIS医生根据手机号和验证码登录
 */
export function hisDoctorLoginByTelPhoneAndCaptcha(data) {
  return request({
    url: "basic/hisLogin/hisDoctorLoginByTelPhoneAndCaptcha",
    method: "post",
    data: data
  });
}

/**
 * HIS医生根据手机号和密码登录
 */
export function hisDoctorLoginByTelPhoneAndPassword(data) {
  return request({
    url: "basic/hisLogin/hisDoctorLoginByTelPhoneAndPassword",
    method: "post",
    data: data
  });
}

/**
 * HIS医生根据手机号和验证码，设置密码
 */
export function hisDoctorSetPasswordByTelPhoneAndCaptcha(data) {
  return request({
    url: "basic/hisLogin/hisDoctorSetPasswordByTelPhoneAndCaptcha",
    method: "post",
    data: data
  });
}

/**
 * HIS医生修改密码
 */
export function hisDoctorUpdatePassword(data) {
  return request({
    url: "basic/hisLogin/hisDoctorUpdatePassword",
    method: "post",
    data: data
  });
}

/**
 * 查询全局参数
 */
export function getConfigInfo(data) {
  return request({
    url: "business/sysconfig/getConfigInfo",
    method: "post",
    data: data
  });
}

/**
 * 环信在线心跳接口
 */
export function keepHeartbeat(data) {
  return request({
    url: "chat/hxMessages/keepHeartbeat",
    method: "post",
    data: data
  });
}

/**
 * 校验验证码是否正确
 */
export function verificationCode(data) {
  return request({
    url: "basic/commonUtil/verificationCode",
    method: "post",
    data: data
  });
}

/**
 * 校验验证码是否正确
 */
export function verificationTelNoAndPassword(data) {
  return request({
    url: "basic/commonUtil/verificationTelNoAndPassword",
    method: "post",
    data: data
  });
}

/**
 * 获取医生身份信息 是否包含药师身份
 */
export function getUserIdentityInfo(data) {
  return request({
    url: "basic/identity/getUserIdentityInfo",
    method: "post",
    data: data
  });
}

/**
 * 医生注册手机号
 */
export function docRegisterTelNo(data) {
  return request({
    url: "basic/doctor/docRegisterTelNo",
    method: "post",
    data: data
  });
}

/**
 * 医生根据手机号设置密码
 */
export function docSetPasswordByTelNo(data) {
  return request({
    url: "basic/doctor/docSetPasswordByTelNo",
    method: "post",
    data: data
  });
}

/**
 * 医生根据手机号设置密码
 */
export function docAppLogOneDataChangeTelNo(data) {
  return request({
    url: "basic/doctor/docAppLogOneDataChangeTelNo",
    method: "post",
    data: data
  });
}


/**
 * 医生修改环信注册状态
 */
export function docUpdateHxStatus(data) {
  return request({
    url: "basic/doctor/docUpdateHxStatus",
    method: "post",
    data: data
  });
}




/**
 * 埋点
 */
export function buriedPointAdd(data) {
  return request({
    url: "buriedPoint/add",
    method: "post",
    data: data
  });
}


/**
 * 根据主键查询平台全局参数
 */
export function getSysPlatformConfigBykey(data) {
  return request({
    url: "basic/sysPlatformConfig/getSysPlatformConfigBykey",
    method: "post",
    data: data
  });
}




