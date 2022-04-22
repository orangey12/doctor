import request from '@/axios/request'
const user = {}

/**
 * 获取医生详细信息
 */
export function findDoctorByID(data) {
    return request({
        url: 'basic/doctor/findDoctorByID',
        method: 'post',
        data: data
    })
}

/**
 * 获取常用药列表
 */
export function findDrugByDocId(data) {
    return request({
        url: 'dictionary/doccommondrug/findDrugByDocId',
        method: 'post',
        data: data
    })
}

/**
 * 获取常用处方列表
 */
export function findDocCommonPrescription(data) {
    return request({
        url: 'dictionary/doccommonprescription/findDocCommonPrescription',
        method: 'post',
        data: data
    })
}

/**
 * 取消收藏常用药
 */
export function cancel(data) {
    return request({
        url: 'dictionary/doccommondrug/cancel',
        method: 'post',
        data: data
    })
}


/**
 * 条件查询就诊协议内容
 */
export function findVisitAgreement(data) {
  return request({
    url: 'basic/sysvisitagreement/findVisitAgreement',
    method: 'post',
    data: data
  })
}


/**
 * 获取药师详细信息
 */
export function getPharmacistInfo(data) {
  return request({
    url: 'basic/pharmacistInfo/getPharmacistInfo',
    method: 'post',
    data: data
  })
}


/**
 * 获取药师审核状态数量接口
 */
export function getPharmacistAuditCount(data) {
  return request({
    url: 'business/pharmacistAudit/getPharmacistAuditCount',
    method: 'post',
    data: data
  })
}

/**
 * 查询医生信息
 */
export function getDoctorInfoByDocId(data) {
  return request({
    url: 'basic/doctor/getDoctorInfoByDocId',
    method: 'post',
    data: data
  })
}


/**
 * 修改医生图文问诊开关
 */
export function modifyDoctorBySwitch(data) {
  return request({
    url: 'basic/doctor/modifyDoctorBySwitch',
    method: 'post',
    data: data
  })
}

/**
 * 医生修改新消息通知数据
 */
export function updateNewMessageSetUpInfo(data) {
  return request({
    url: 'basic/docBasicInfo/updateNewMessageSetUpInfo',
    method: 'post',
    data: data
  })
}

/**
 * 医生查询新消息通知数据
 */
export function getNewMessageSetUpInfo(data) {
  return request({
    url: 'basic/docBasicInfo/getNewMessageSetUpInfo',
    method: 'post',
    data: data
  })
}


/**
 * 查询所有科室
 */
export function getAllDept(data) {
  return request({
    url: 'basic/dept/getAllDept',
    method: 'post',
    data: data
  })
}

/**
 * 医生端-医生认证信息提交
 */
export function docAttestInfoSubmit(data) {
  return request({
    url: 'basic/doctor/docAttestInfoSubmit',
    method: 'post',
    data: data
  })
}

/**
 * 医生端-医生端修改认证信息
 */
export function docUpdateAttestInfo(data) {
  return request({
    url: 'basic/doctor/docUpdateAttestInfo',
    method: 'post',
    data: data
  })
}


/**
 * 医生端-查询医生填写的认证信息以及审核失败原因
 */
export function findDocFillInAttestInfo(data) {
  return request({
    url: 'basic/doctor/findDocFillInAttestInfo',
    method: 'post',
    data: data
  })
}


/**
 * 根据主键查询全局参数
 */
export function getConfigInfoByKey(data) {
  return request({
    url: 'business/sysconfig/getConfigInfoByKey',
    method: 'post',
    data: data
  })
}

/**
 * 医生添加到医生管理员主体下
 */
export function docAddToDocAdministrator(data) {
  return request({
    url: 'basic/docAddToDocAdministrator',
    method: 'post',
    data: data
  })
}





