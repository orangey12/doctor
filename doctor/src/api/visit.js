
import request from '@/axios/request'
/**
 * 查询医生的出诊信息
 */
export function docVisit(data) {
  return request({
      url: 'basic/provisitreal/docVisit',
      method: 'post',
      data: data
  })
}

/**
 * 查询医生线下的出诊信息
 */
export function docVisitOffline(data) {
  return request({
      url: 'basic/provisitreal/docVisitOffline',
      method: 'post',
      data: data
  })
}

/**
 * 查询医生的出诊信息排班标志
 */
export function docVisitFlag(data) {
  return request({
      url: 'basic/provisitreal/docVisitFlag',
      method: 'post',
      data: data
  })
}

/**
 * 查询医生线下的出诊信息排班标志
 */
export function offlineFlag(data) {
  return request({
      url: 'basic/provisitreal/OfflineFlag',
      method: 'post',
      data: data
  })
}

/**
 * 查询医生的出诊模板信息排班标志
 */
export function tempFlag(data) {
  return request({
      url: 'basic/dicvisitrealtemp/tempFlag',
      method: 'post',
      data: data
  })
}




/**
* 医生自定义出诊信息-添加
*/
export function addProVisitReal(data) {
  return request({
      url: 'basic/provisitreal/addProVisitReal',
      method: 'post',
      data: data
  })
}

/**
* 医生自定义出诊信息-修改
*/
export function updateProVisitReal(data) {
  return request({
      url: 'basic/provisitreal/updateProVisitReal',
      method: 'post',
      data: data
  })
}



/**
* 医生自定义出诊信息-删除
*/
export function deleteProVisitReal(data) {
  return request({
      url: 'basic/provisitreal/deleteProVisitReal',
      method: 'post',
      data: data
  })
}


/**
* 查询医生自定义模板信息
*/
export function findVisitTemp(data) {
  return request({
      url: 'basic/dicvisitrealtemp/findVisitTemp',
      method: 'post',
      data: data
  })
}
/**
* 添加排班模板
*/
export function addTemplate(data) {
  return request({
      url: 'basic/dicvisitrealtemp/add',
      method: 'post',
      data: data
  })
}

/**
* 删除排班模板
*/
export function deleteTemplate(data) {
  return request({
      url: 'basic/dicvisitrealtemp/delete',
      method: 'post',
      data: data
  })
}

/**
* 修改排班模板
*/
export function updateTemplate(data) {
  return request({
      url: 'basic/dicvisitrealtemp/update',
      method: 'post',
      data: data
  })
}

/**
* 修改排班模板可提前预约天数
*/
export function updateAppointDay(data) {
  return request({
      url: 'basic/dicvisitrealtemp/updateAppointDay',
      method: 'post',
      data: data
  })
}

/**
* 医生问诊信息图文问诊开关
*/
export function isOpenTuWen(data) {
  return request({
      url: 'basic/provisitreal/isOpenTuWen',
      method: 'post',
      data: data
  })
}

/**
* 查询图文问诊开关状态
*/
export function tuWenFlag(data) {
  return request({
      url: 'basic/dicvisitrealtemp/tuwenFlag',
      method: 'post',
      data: data
  })
}

/**
 * 医生端-出诊信息-线下-查询医生某天的出诊信息(不查图文)
 */
export function queryInformationOfDoctorOneDayVisit(data) {
  return request({
    url: 'basic/provisitreal/queryInformationOfDoctorOneDayVisit',
    method: 'post',
    data: data
  })
}

/**
 * 医生端面诊签到
 */
export function doctorEndClinicalSignIn(data) {
  return request({
    url: 'business/prooutpatientappointment/doctorEndClinicalSignIn',
    method: 'post',
    data: data
  })
}

/**
 * 新增线下出诊模板表
 */
export function saveDocDicVisitRealTempOffline(data) {
  return request({
    url: 'basic/dicVisitRealTempOffline/saveDocDicVisitRealTempOffline',
    method: 'post',
    data: data
  })
}


/**
 * 医生端按周查询线下出诊模板
 */
export function selectDocVisitRealTempOfflineList(data) {
  return request({
    url: 'basic/dicVisitRealTempOffline/selectDocVisitRealTempOfflineList',
    method: 'post',
    data: data
  })
}


/**
 * 医生端查询周几线下出诊模板
 */
export function selectDocVisitRealTempOfflineListByWeekList(data) {
  return request({
    url: 'basic/dicVisitRealTempOffline/selectDocVisitRealTempOfflineListByWeekList',
    method: 'post',
    data: data
  })
}

/**
 * 医生端删除线下出诊模板
 */
export function deleteDocDicVisitRealTempOffline(data) {
  return request({
    url: 'basic/dicVisitRealTempOffline/deleteDocDicVisitRealTempOffline',
    method: 'post',
    data: data
  })
}


/**
 * 医生端修改线下出诊模板
 */
export function updateDocDicVisitRealTempOffline(data) {
  return request({
    url: 'basic/dicVisitRealTempOffline/updateDocDicVisitRealTempOffline',
    method: 'post',
    data: data
  })
}

/**
 * 医生端新增线下排班
 */
export function saveDicDocVisitRealOffline(data) {
  return request({
    url: 'basic/dicDocVisitRealOffline/saveDicDocVisitRealOffline',
    method: 'post',
    data: data
  })
}

/**
 * 查询医生实际线下出诊信息列表
 */
export function selectDicDocVisitRealOfflineList(data) {
  return request({
    url: 'basic/dicDocVisitRealOffline/selectDicDocVisitRealOfflineList',
    method: 'post',
    data: data
  })
}



/**
 * 查询指定日期医生实际线下出诊信息列表
 */
export function selectDicDocVisitRealOfflineListByDate(data) {
  return request({
    url: 'basic/dicDocVisitRealOffline/selectDicDocVisitRealOfflineListByDate',
    method: 'post',
    data: data
  })
}

/**
 * 编辑医生实际线下出诊信息
 */
export function updateDicDocVisitRealOffline(data) {
  return request({
    url: 'basic/dicDocVisitRealOffline/updateDicDocVisitRealOffline',
    method: 'post',
    data: data
  })
}


/**
 * 删除医生实际线下出诊信息
 */
export function deleteDicDocVisitRealOffline(data) {
  return request({
    url: 'basic/dicDocVisitRealOffline/deleteDicDocVisitRealOffline',
    method: 'post',
    data: data
  })
}

/**
 * 查询线下排班列表
 */
export function getDocVisitListOffline(data) {
  return request({
    url: 'basic/provisitreal/getDocVisitListOffline',
    method: 'post',
    data: data
  })
}

/**
 * 查询系统参数开启的咨询或者复诊
 */
export function getSystemZiXunFuZhen(data) {
  return request({
    url: 'basic/provisitreal/getSystemZiXunFuZhen',
    method: 'post',
    data: data
  })
}

/**
 * 查询医生默认科室所拥有的的语音视频
 */
export function getDocDefaultDeptVisitType(data) {
  return request({
    url: 'basic/provisitreal/getDocDefaultDeptVisitType',
    method: 'post',
    data: data
  })
}


