import request from '@/axios/request'


/**
 * 医生查询个人中心基本信息接口
 */
export function getDoctorInfo(data) {
  return request({
    url: 'basic/docBasicInfo/getDoctorInfo',
    method: 'post',
    data: data
  })
}


/**
 * 获取医生互联网备案信息接口
 */
export function getDoctorRecordInfo(data) {
  return request({
    url: 'basic/docBasicInfo/getDoctorRecordInfo',
    method: 'post',
    data: data
  })
}


/**
 * 医生修改个人中心基本信息接口
 */
export function updateDoctorInfo(data) {
  return request({
    url: 'basic/docBasicInfo/updateDoctorInfo',
    method: 'post',
    data: data
  })
}


/**
 * 标签字典表，查询医生类型的标签名称集合
 */
export function findDocTypeLabelName(data) {
  return request({
    url: 'basic/dictionaryInfo/findDocTypeLabelName',
    method: 'post',
    data: data
  })
}


/**
 * 校验验证码是否正确
 */
export function verificationCode(data) {
  return request({
    url: 'basic/commonUtil/verificationCode',
    method: 'post',
    data: data
  })
}

