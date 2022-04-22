import request from "@/axios/request";

/**
 * 查询所有内容限制 正则
 */
export function getAnswerLimit(data) {
  return request({
    url: "basic/dicanswerlimit/getAnswerLimit",
    method: "post",
    data: data
  });
}
/**
 * 获取字典
 */
export function getSysCodeByType(data) {
  return request({
    url: "basic/syscode/getSysCodeByType",
    method: "post",
    data: data
  });
}

/**
 * 新建问诊单
 */
export function saveInquiringDiagnosis(data) {
  return request({
    url: "basic/docinquiringdiagnosis/saveInquiringDiagnosis",
    method: "post",
    data: data
  });
}

/**
 * 查询问诊单列表
 */
export function getInquiringDiagnosisList(data) {
  return request({
    url: "basic/docinquiringdiagnosis/getInquiringDiagnosisList",
    method: "post",
    data: data
  });
}

/**
 * 患者的资料服务问诊单记录列表接口
 */
export function getDiagnosisListPageByPatientIdAndDocId(data) {
  return request({
    url: "basic/replyInquiringDiagnosis/getDiagnosisListPageByPatientIdAndDocId",
    method: "post",
    data: data
  });
}


/**
 * 删除问诊单
 */
export function deleteInquiringDiagnosisById(data) {
  return request({
    url: "basic/docinquiringdiagnosis/deleteInquiringDiagnosisById",
    method: "post",
    data: data
  });
}
/**
 * 问诊单详情
 */
export function getInquiringDiagnosisDetail(data) {
  return request({
    url: "basic/docinquiringdiagnosis/getInquiringDiagnosisDetail",
    method: "post",
    data: data
  });
}

/**
 * 修改问诊单
 */
export function updateInquiringDiagnosis(data) {
  return request({
    url: "basic/docinquiringdiagnosis/updateInquiringDiagnosis",
    method: "post",
    data: data
  });
}

/**
 * 保存发送记录
 */
export function saveProFlockSend(data) {
  return request({
    url: "basic/proflocksend/saveProFlockSend",
    method: "post",
    data: data
  });
}

/**
 * 保存发送记录
 */
export function getInquiringDiagnosisSendList(data) {
  return request({
    url: "basic/proflocksend/getInquiringDiagnosisSendList",
    method: "post",
    data: data
  });
}

/**
 * 查询一次发送患者列表
 */
export function getSendPatientList(data) {
  return request({
    url: "basic/proflocksend/getSendPatientList",
    method: "post",
    data: data
  });
}

/**
 * 查询问诊单以及答案详情
 */
export function getReplyDiagnosisAnswer(data) {
  return request({
    url: "basic/replyInquiringDiagnosis/getReplyDiagnosisAnswer",
    method: "post",
    data: data
  });
}

/**
 * 查询患者是否反馈问诊单
 */
export function getPatientFeedback(data) {
  return request({
    url: "basic/proflocksend/getPatientFeedback",
    method: "post",
    data: data
  });
}

/**
 * 问诊单统计
 */
export function getInquiringDiagnosisStatistics(data) {
  return request({
    url: "basic/proflocksend/getInquiringDiagnosisStatistics",
    method: "post",
    data: data
  });
}
/**
 *
 根据问诊单查询发送患者
 */
export function getSendPatientByDidOnlyId(data) {
  return request({
    url: "basic/proflocksend/getSendPatientByDidOnlyId",
    method: "post",
    data: data
  });
}

/**
 *根据患者查询问诊单发送记录
 */
export function getInquiringDiagnosisSendListByPatient(data) {
  return request({
    url: "basic/proflocksend/getInquiringDiagnosisSendListByPatient",
    method: "post",
    data: data
  });
}

/**
 *查询答题的患者
 */
export function getAnswerPatient(data) {
  return request({
    url: "basic//proflocksend/getAnswerPatient",
    method: "post",
    data: data
  });
}
