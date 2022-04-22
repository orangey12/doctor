import request from '@/axios/request'

/**
 * 添加医生自定义服务字典
 */
export function addDicCustomBusiness(data) {
  return request({
    url: 'dictionary/dicCustomBusiness/addDicCustomBusiness',
    method: 'post',
    data: data
  })
}


/**
 * 查询医生自定义服务列表
 */
export function getListDicCustomBusiness(data) {
  return request({
    url: 'dictionary/dicCustomBusiness/getListDicCustomBusiness',
    method: 'post',
    data: data
  })
}


/**
 * 修改医生自定义业务完成状态
 */
export function updateDocCustomBusinessComplete(data) {
  return request({
    url: 'business/proCustomBusiness/updateDocCustomBusinessComplete',
    method: 'post',
    data: data
  })
}

/**
 * 删除医生自定义服务
 */
export function deleteDicCustomBusiness(data) {
  return request({
    url: 'dictionary/dicCustomBusiness/deleteDicCustomBusiness',
    method: 'post',
    data: data
  })
}

/**
 * 查询医生自定义服务详情
 */
export function getDetailsDicCustomBusiness(data) {
  return request({
    url: 'dictionary/dicCustomBusiness/getDetailsDicCustomBusiness',
    method: 'post',
    data: data
  })
}


/**
 * 修改医生自定义服务
 */
export function updateDicCustomBusiness(data) {
  return request({
    url: 'dictionary/dicCustomBusiness/updateDicCustomBusiness',
    method: 'post',
    data: data
  })
}

/**
 * 保存自定义服务业务表信息
 */
export function saveCustomServiceInfo(data) {
  return request({
    url: 'business/proCustomBusiness/saveCustomServiceInfo',
    method: 'post',
    data: data
  })
}

/**
 * 查询自定义服务支付状态
 */
export function findCustomServicePayStatus(data) {
  return request({
    url: 'business/proCustomBusiness/findCustomServicePayStatus',
    method: 'post',
    data: data
  })
}

/**
 * 查询自定义服务订单信息
 */
export function findCustomService(data) {
  return request({
    url: 'business/proCustomBusiness/findCustomService',
    method: 'post',
    data: data
  })
}

/**
 * 查询医生给这个患者发过的所有的自定义服务列表以及总额
 */
export function getCustomBusinessListByPatientIdAndDocId(data) {
  return request({
    url: 'business/proCustomBusiness/getCustomBusinessListByPatientIdAndDocId',
    method: 'post',
    data: data
  })
}

/**
 * 查询医生开关
 */
export function getDocSwitch(data) {
  return request({
    url: 'basic/docBusinessSwitch/getDocSwitch',
    method: 'post',
    data: data
  })
}



