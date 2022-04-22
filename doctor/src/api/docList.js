import request from '@/axios/request'
import myJsTools from "../utils/myJsTools";

// /**
//  * 获取医生列表
//  */
// export function getDocChatListNew(data) {
//   return request({
//     url: 'basic/proPatientBusiness/getDocChatListNew',
//     method: 'post',
//     data: data
//   })
// }

/**
 * 操作聊天列表 删除 置顶 标为未读
 */
export function updateChatOperation(data) {
  return request({
    url: 'business/proregister/updateChatOperation',
    method: 'post',
    data: data
  })
}

/**
 * 预约列表
 */
export function getPatientAppointByDocPage(data) {
  return request({
    url: 'business/proregister/getPatientAppointByDocPage',
    method: 'post',
    data: data
  })
}

/**
 * 待接诊列表
 */
export function getNotReceiveByDocPage(data) {
  return request({
    url: 'business/proregister/getNotReceiveByDocPage',
    method: 'post',
    data: data
  })
}

/**
 * 接诊中/已结束列表
 */
export function getReceiveByDocPage(data) {
  return request({
    url: 'business/proregister/getReceiveByDocPage',
    method: 'post',
    data: data
  })
}

/**
 * 根据ID查询病历资料
 */
export function getPatientRecords(data) {
  return request({
    url: 'business/patientrecords/getPatientRecords',
    method: 'post',
    data: data,
    headers: {
      hosId: myJsTools.getItem("hosId")
    }
  })
}

/**
 * 接诊
 */
export function saveProReceive(data) {
  return request({
    url: 'business/proreceive/saveProReceive',
    method: 'post',
    data: data
  })
}


/**
 * 获取选项配置信息
 */
export function getSysOptionConfig(data) {
  return request({
    url: 'basic/sysoptionconfig/getSysOptionConfig',
    method: 'post',
    data: data
  })
}

/**
 * 诊疗记录
 */
export function getRegListByDoc(data) {
  return request({
    url: 'business/proregister/getRegListByDoc',
    method: 'post',
    data: data
  })
}

/**
 * 结束问诊接口
 */
export function updateEndReceive(data) {
  return request({
    url: 'business/proreceive/updateEndReceive',
    method: 'post',
    data: data
  })
}

/**
 * 退诊接口
 */
export function updateReturnReceive(data) {
  return request({
    url: 'business/proreceive/updateReturnReceive',
    method: 'post',
    data: data
  })
}

/**
 * 拒诊接口
 */
export function updateRegisterRefuseCause(data) {
  return request({
    url: 'business/proregister/updateRegisterRefuseCause',
    method: 'post',
    data: data
  })
}


/**
 * 关闭聊天问诊时间提醒接口
 */
export function updateCloseChatTime(data) {
  return request({
    url: 'business/proreceive/updateCloseChatTime',
    method: 'post',
    data: data
  })
}

/**
 * 查询是否关闭问诊时间
 */
export function getIsCloseChatTime(data) {
  return request({
    url: 'business/proreceive/getIsCloseChatTime',
    method: 'post',
    data: data
  })
}

/**
 * 获取快捷回复信息
 */
export function getQuickInputInfo(data) {
  return request({
    url: 'basic/dicquickinput/getQuickInputInfo',
    method: 'post',
    data: data
  })
}

/**
 * 添加快捷回复
 */
export function saveQuickInput(data) {
  return request({
    url: 'basic/dicquickinput/saveQuickInput',
    method: 'post',
    data: data
  })
}

/**
 * 修改快捷回复
 */
export function updateQuickInput(data) {
  return request({
    url: 'basic/dicquickinput/updateQuickInput',
    method: 'post',
    data: data
  })
}

/**
 * 获取预约数和待接诊数
 */
export function getAppointAndNotReceiveNum(data) {
  return request({
    url: 'business/proregister/getAppointAndNotReceiveNum',
    method: 'post',
    data: data
  })
}

/**
 * 医生端主页搜索患者，根据患者姓名，历史诊断，历史用药
 */
export function homeSearchPatient(data) {
  return request({
    url: 'basic/propatient/homeSearchPatient',
    method: 'post',
    data: data
  })
}

// 查询医生职称列表
export function findDoctorProfType(data) {
  return request({
    url: 'basic/doctor/findDoctorProfType',
    method: 'post',
    data: data
  })
}

//  查询所有问诊类型
export function findAllVisitType(data) {
  return request({
    url: 'basic/dicvisittype/findAllVisitType',
    method: 'post',
    data: data
  })
}

//  所有的科室
export function findAllDept(data) {
  return request({
    url: 'basic/dept/dept/findAllDept',
    method: 'post',
    data: data
  })
}

// 生成动态二维码
export function createWxQrCode(data) {
  return request({
    url: '/chat/wx/createWxQrCode',
    method: 'post',
    data: data
  })
}

// 获取微信临时二维码 (codeType)
export function createAutoWxQrCode(data) {
  return request({
    url: '/chat/wx/createAutoWxQrCode',
    method: 'post',
    data: data
  })
}

//查询患者是否绑定用户
export function getPatientIsBindingUser(data) {
  return request({
    url: 'basic/dicPatientUser/getPatientIsBindingUser',
    method: 'post',
    data: data
  })
}

//医生聊天列表
export function getDocChatListNew(data) {
  return request({
    url: 'business/proregister/getDocChatListNew',
    method: 'post',
    data: data
  })
}


