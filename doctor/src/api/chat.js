import request from "@/axios/request";
import myJsTools from "../utils/myJsTools";
/**
 * 撤回消息
 */
export function cancelMessage(data) {
  return request({
    url: "chat/hxMessages/cancelMessage",
    method: "post",
    data: data
  });
}

/**
 * 根据患者id查询患者四史和身高体重
 */
export function getHeightWightAndFourHistory(data) {
  return request({
    url: "basic/propatient/getHeightWightAndFourHistory",
    method: "post",
    data: data
  });
}

/**
 * 是否有量表
 */
export function getIsInquiring(data) {
  return request({
    url: "basic/docinquiringdiagnosis/getIsInquiring",
    method: "post",
    data: data
  });
}

/**
 * 挂号量表记录
 */
export function getDiagnosisListPageByPatientIdAndRegId(data) {
  return request({
    url:
      "basic/replyInquiringDiagnosis/getDiagnosisListPageByPatientIdAndRegId",
    method: "post",
    data: data
  });
}

/**
 * 根据ID查询赠送次数
 */
export function getGiveTimesById(data) {
  return request({
    url: "business/progivechattimes/getGiveTimesById",
    method: "post",
    data: data
  });
}

/**
 * 赠送次数
 */
export function saveGiveTimes(data) {
  return request({
    url: "business/progivechattimes/saveGiveTimes",
    method: "post",
    data: data
  });
}

/**
 * 医生发送问诊单或者预约表时保存此次发送记录
 */
export function docSendTableSaveRecord(data) {
  return request({
    url: "basic/doctor/docSendTableSaveRecord",
    method: "post",
    data: data
  });
}

/**
 * 保存投诉记录
 */
export function saveProComplain(data) {
  return request({
    url: "business/procomplain/saveProComplain",
    method: "post",
    data: data
  });
}

/**
 * 查询咨询小结
 */
export function getInterrogationSummaryById(data) {
  return request({
    url: "business/proreceive/getInterrogationSummaryById",
    method: "post",
    data: data
  });
}

/**
 * 查询挂号信息
 */
export function getRegInfoByPatient(data) {
  return request({
    url: "business/proreceive/getRegInfoByPatient",
    method: "post",
    data: data
  });
}

/**
 * 新增转诊记录表
 */
export function saveReferralRecord(data) {
  return request({
    url: "business/proReferralRecord/saveReferralRecord",
    method: "post",
    data: data
  });
}

/**
 * 医生端查询可以转诊的医生列表
 */
export function queriesCanBeReferralDoctorsList(data) {
  return request({
    url: "basic/doctor/queriesCanBeReferralDoctorsList",
    method: "post",
    data: data
  });
}

/**
 * 获取转诊状态
 */
export function getReferralRecord(data) {
  return request({
    url: "business/proReferralRecord/getReferralRecord",
    method: "post",
    data: data
  });
}

/**
 * 获取医生信息及患者信息
 */
export function getLabInfo(data) {
  return request({
    url: "basic/labController/getLabInfo",
    method: "post",
    data: data
  });
}

/**
 *新增检验单记录表
 */
export function saveProLab(data) {
  return request({
    url: "business/proLab/saveProLab",
    method: "post",
    data: data
  });
}

/**
 *保存病历授权信息
 */
export function saveMedicalAuthorize(data) {
  return request({
    url: "basic/proMedicalAuthorize/saveMedicalAuthorize",
    method: "post",
    data: data
  });
}

/**
 *查询病历授权状态
 */
export function getMedicalAuthorizeStatus(data) {
  return request({
    url: "basic/proMedicalAuthorize/getMedicalAuthorizeStatus",
    method: "post",
    data: data
  });
}

/**
 *查询问诊详情
 */
export function getInquiryDetail(data) {
  return request({
    url: "business/proregister/getInquiryDetail",
    method: "post",
    data: data,
    headers: {
      hosId: myJsTools.getItem("hosId")
    }
  });
}

/**
 *查询问诊详情
 */
export function findAppidAndOpenidAndUseridByPatientId(data) {
  return request({
    url: "basic/propatient/findAppidAndOpenidAndUseridByPatientId",
    method: "post",
    data: data
  });
}

/**
 * 根据患者id查询患者所有信息
 */
export function findPatientInfoByPatientId(data) {
  return request({
    url: "basic/propatient/findPatientInfoByPatientId",
    method: "post",
    data: data
  });
}

/**
 * 根据患者id修改不重要的信息
 */
export function editUnimportantInfoByPatientId(data) {
  return request({
    url: "/basic/propatient/editUnimportantInfoByPatientId",
    method: "post",
    data: data
  });
}

/**
 * 挂断视频
 */
export function hangUpVideo(data) {
  return request({
    url: "business/proVideoTimeInfo/hangUpVideo",
    method: "post",
    data: data
  });
}

/**
 * 查询视频剩余时间
 */
export function queryVideoTimeRemaining(data) {
  return request({
    url: "business/proVideoTimeInfo/queryVideoTimeRemaining",
    method: "post",
    data: data
  });
}

/**
 * 删除极光别名
 */
export function deleteJPAliases(data) {
  return request({
    url: "chat/tools/deleteJPAliases",
    method: "post",
    data: data
  });
}

/**
 * 医生端开检验单-查询所有检验分类数据
 */
export function findAllDicLisType(data) {
  return request({
    url: "basic/lisItemInfoController/findAllDicLisType",
    method: "post",
    data: data
  });
}

/**
 * 医生端开检验单-查询检验项目列表
 */
export function getLisItmeList(data) {
  return request({
    url: "basic/lisItemInfoController/getLisItmeList",
    method: "post",
    data: data
  });
}

/**
 * 医生端开检验单-查询检验类型列表
 */
export function getLisSampleType(data) {
  return request({
    url: "basic/lisItemInfoController/getLisSampleType",
    method: "post",
    data: data
  });
}

/**
 * 医生端开检验单-查询检验部位列表
 */
export function getLisSampleBody(data) {
  return request({
    url: "basic/lisItemInfoController/getLisSampleBody",
    method: "post",
    data: data
  });
}

/**
 * 查询是否有响应的检验机构
 */
export function getIsResponseLisOrganization(data) {
  return request({
    url: "basic/lisItemInfoController/getIsResponseLisOrganization",
    method: "post",
    data: data
  });
}

/**
 *  查询检验机构列表
 */
export function getLisOrganizationList(data) {
  return request({
    url: "basic/lisItemInfoController/getLisOrganizationList",
    method: "post",
    data: data
  });
}

/**
 *  保存检验单
 */
export function saveProLisInfo(data) {
  return request({
    url: "basic/proLisInfoController/saveProLisInfo",
    method: "post",
    data: data
  });
}

/**
 *  查询检验机构项目价格
 */
export function getLisItemPrice(data) {
  return request({
    url: "basic/lisItemInfoController/getLisItemPrice",
    method: "post",
    data: data
  });
}

/**
 *  查询检验单状态
 */
export function getProLisStatus(data) {
  return request({
    url: "basic/proLisInfoController/getProLisStatus",
    method: "post",
    data: data
  });
}

/**
 *  根据ID查询检验单详情-医生端
 */
export function getProLisDetailInfoByID(data) {
  return request({
    url: "basic/proLisInfoController/getProLisDetailInfoByID",
    method: "post",
    data: data
  });
}

/**
 * 查询本次检验单
 */
export function getProLisList(data) {
  return request({
    url: "basic/proLisInfoController/getProLisList",
    method: "post",
    data: data
  });
}

/**
 * 我的检验
 */
export function myLisList(data) {
  return request({
    url: "basic/proLisInfoController/myLisList",
    method: "post",
    data: data
  });
}

/**
 * 医生端-诊疗记录-线上/线下问诊-查询挂号问诊详情
 */
export function getRegisterInquiryInfo(data) {
  return request({
    url: "/business/proregister/getRegisterInquiryInfo",
    method: "post",
    data: data
  });
}

/**
 * 查询挂号和患者信息
 */
export function getRegAndPatientInfoByPatient(data) {
  return request({
    url: "business/proreceive/getRegAndPatientInfoByPatient",
    method: "post",
    data: data
  });
}

/**
 * 获取声网token
 */
export function getAgoraToken(data) {
  return request({
    url: "chat/tools/getAgoraToken",
    method: "post",
    data: data
  });
}
/**
 * 获取声网视频开始录制
 */
export function getAgoraVideoRecordingStart(data) {
  return request({
    url: "chat/tools/getAgoraVideoRecordingStart",
    method: "post",
    data: data
  });
}
/**
 * 获取声网视频结束录制
 */
export function getAgoraVideoRecordingStop(data) {
  return request({
    url: "chat/tools/getAgoraVideoRecordingStop",
    method: "post",
    data: data
  });
}
/**
 * 查询某个就诊人信息
 */
export function getVisitingPersonInfo(data) {
  return request({
    url: "basic/proofpatient/getVisitingPersonInfo",
    method: "post",
    data: data
  });
}
