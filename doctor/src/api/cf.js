import request from "@/axios/request";
import myJsTools from "../utils/myJsTools";

const user = {};

/**
 * 获取临床诊断列表
 */
export function findByName(data) {
  return request({
    url: "dictionary/dicdiagnosis/findAll",
    method: "post",
    data: data
  });
}

/**
 * 获取临床诊断列表分页
 */
export function findAllListPage(data) {
  return request({
    url: "dictionary/dicdiagnosis/findAllListPage",
    method: "post",
    data: data
  });
}

/**
 * 获取检验检查诊断列表分页
 */
export function getPacsLisDiagnosisList(data) {
  return request({
    url: "dictionary/dicdiagnosis/getPacsLisDiagnosisList",
    method: "post",
    data: data
  });
}
/**
 * 查询草药特殊煎法
 */
export function getDicDrugDecoction(data) {
  return request({
    url: "dictionary/dicdrugdecoction/getDicDrugDecoction",
    method: "post",
    data: data
  });
}

/**
 * 查询全部药品，收藏标志
 */
export function findAllDrug(data) {
  return request({
    url: "basic/dicDrugController/findAllDrug",
    method: "post",
    data: data
  });
}

/**
 * 查询药品详情
 */
export function findDrugById(data) {
  return request({
    url: "/basic/dicDrugController/findDrugById",
    method: "post",
    data: data
  });
}

/**
 * 查询全部西药品，收藏标志
 */
export function findAllDrugNoPage(data) {
  return request({
    url: "basic/dicDrugController/findAllDrugNoPage",
    method: "post",
    data: data
  });
}

/**
 * 获取频次
 */
export function findAll(data) {
  return request({
    url: "basic/dicdrugfrequency/findAll",
    method: "post",
    data: data
  });
}

/**
 * 服用方法
 */
export function dicdrugusage(data) {
  return request({
    url: "basic/dicdrugusage/findAll",
    method: "post",
    data: data
  });
}

/**
 * 保存处方
 */
export function savePrescription(data) {
  return request({
    url: "business/proPrescriptionController/savePrescription",
    method: "post",
    data: data
  });
}

/**
 * 患者获取处方信息
 */
export function getPatientPrescriptionInfo(data) {
  return request({
    url: "business/proPrescriptionController/getPatientPrescriptionInfo",
    method: "post",
    data: data,
    headers: {
      hosId: myJsTools.getItem("hosId")
    }
  });
}

/**
 * 删除医生诊疗笔记
 */
export function deleteDocMedicalRecordById(data) {
  return request({
    url: "business/docmedicalrecord/deleteDocMedicalRecordById",
    method: "post",
    data: data
  });
}

/**
 * 获取医生诊疗笔记详情
 */
export function getDocMedicalRecordById(data) {
  return request({
    url: "business/docmedicalrecord/getDocMedicalRecordById",
    method: "post",
    data: data
  });
}

/**
 * 添加收藏常用药
 */
export function addDoccommondrug(data) {
  return request({
    url: "basic/doccommondrug/add",
    method: "post",
    data: data
  });
}

/**
 * 添加收藏常用药
 */
export function cancelDoccommondrug(data) {
  return request({
    url: "basic/doccommondrug/cancel",
    method: "post",
    data: data
  });
}

/**
 * 医生app 查医生常用药
 */
export function findDrugByDocId(data) {
  return request({
    url: "basic/dicDrugController/findDrugByDocId",
    method: "post",
    data: data
  });
}

/**
 * 医生app 查询医生常用处方
 */
export function findDocCommonPrescription(data) {
  return request({
    url: "basic/doccommonprescription/findDocCommonPrescription",
    method: "post",
    data: data
  });
}

/**
 * 医生app 查询医生常用处方详情
 */
export function findDocCommonPrescriptionDetail(data) {
  return request({
    url: "basic/doccommonprescription/findDocCommonPrescriptionDetail",
    method: "post",
    data: data
  });
}

/**
 * 医生app 查询医生关联药店列表
 */
export function getDoctorLinkDrugstoreList(data) {
  return request({
    url: "basic/doctor/getDoctorLinkDrugstoreList",
    method: "post",
    data: data
  });
}

/**
 * 查询患者的历史处方
 */
export function findDocPrescriptionHistory(data) {
  return request({
    url: "business/proPrescriptionController/findDocPrescriptionHistory",
    method: "post",
    data: data
  });
}

/**
 * 查询历史处方明细
 */
export function findPatientPrescriptionHistoryDetail(data) {
  return request({
    url:
      "business/proPrescriptionController/findPatientPrescriptionHistoryDetail",
    method: "post",
    data: data
  });
}

/**
 * 添加常用处方
 */
export function addDoccommonprescription(data) {
  return request({
    url: "basic/doccommonprescription/edit",
    method: "post",
    data: data
  });
}

/**
 * 删除常用处方
 */
export function deleteDoccommonprescription(data) {
  return request({
    url: "basic/doccommonprescription/delete",
    method: "post",
    data: data
  });
}

/**
 * 验证药品库存是否满足
 */
export function checkDrugStorage(data) {
  return request({
    url: "basic/dicDrugController/checkDrugStorage",
    method: "post",
    data: data
  });
}

/**
 * 根据ID获取处方卡片明细信息
 */
export function getPrescriptionCardDetailInfo(data) {
  return request({
    url: "business/proPrescriptionController/getPrescriptionCardDetailInfo",
    method: "post",
    data: data,
    headers: {
      hosId: myJsTools.getItem("hosId")
    }
  });
}

/**
 * 根据ID获取处方卡片信息
 */
export function getPrescriptionCardInfo(data) {
  return request({
    url: "business/proPrescriptionController/getPrescriptionCardInfo",
    method: "post",
    data: data
  });
}

/**
 * 查询医生的历史处方
 */
export function findDocPrescriptionhistory(data) {
  return request({
    url: "business/proPrescriptionController/findDocPrescriptionhistory",
    method: "post",
    data: data
  });
}

/**
 * 查询处方订单清单
 */
export function getPrescriptionOrderList(data) {
  return request({
    url: "business/proPrescriptionController/getPrescriptionOrderList",
    method: "post",
    data: data
  });
}

/**
 * 根据ID获取处方业务信息
 */
export function getPrescriptionInfoById(data) {
  return request({
    url: "business/proPrescriptionController/getPrescriptionInfoById",
    method: "post",
    data: data,
    headers: {
      hosId: myJsTools.getItem("hosId")
    }
  });
}

/**
 * 根据ID获取处方订单信息
 */
export function getPatientPrescriptionOrderInfoById(data) {
  return request({
    url:
      "business/proPrescriptionController/getPatientPrescriptionOrderInfoById",
    method: "post",
    data: data,
    headers: {
      hosId: myJsTools.getItem("hosId")
    }
  });
}

/**
 * 查询医生药品费用统计
 */
export function getDocDrugCostStatistics(data) {
  return request({
    url: "business/prescriptionStatisticsController/getDocDrugCostStatistics",
    method: "post",
    data: data
  });
}

/**
 * 查询医生处方和订单费用统计
 */
export function getDocPreAndOrderStatistics(data) {
  return request({
    url:
      "business/prescriptionStatisticsController/getDocPreAndOrderStatistics",
    method: "post",
    data: data
  });
}

/**
 * 修改诊断业务状态
 */
export function updateBussStatus(data) {
  return request({
    url: "business/proPrescriptionController/updateBussStatus",
    method: "post",
    data: data,
    headers: {
      hosId: myJsTools.getItem("hosId")
    }
  });
}

/**
 * 获取不同状态下审核处方的数量
 */
export function getCheckPrescriptionStatusNum(data) {
  return request({
    url: "business/proCheckPrescription/getCheckPrescriptionStatusNum",
    method: "post",
    data: data
  });
}

/**
 *
 保存医生诊疗笔记
 */
export function saveDocMedicalRecord(data) {
  return request({
    url: "business/docmedicalrecord/saveDocMedicalRecord",
    method: "post",
    data: data
  });
}

/**
 * 获取待审方列表
 */
export function getNotCheckPrescriptionList(data) {
  return request({
    url: "business/proCheckPrescription/getNotCheckPrescriptionList",
    method: "post",
    data: data
  });
}

/**
 * 获取未通过审核的处方详情
 */
export function getNotPassCheckPrescriptionInfo(data) {
  return request({
    url: "business/proCheckPrescription/getNotPassCheckPrescriptionInfo",
    method: "post",
    data: data,
    headers: {
      hosId: myJsTools.getItem("hosId")
    }
  });
}

/**
 * 获取审方列表
 */
export function getCheckPrescriptionList(data) {
  return request({
    url: "business/proCheckPrescription/getCheckPrescriptionList",
    method: "post",
    data: data
  });
}

/**
 * 查询审方中患者病情
 */
export function getCheckPatientRecords(data) {
  return request({
    url: "business/proCheckPrescription/getCheckPatientRecords",
    method: "post",
    data: data
  });
}

/**
 *  查询药品分类
 */
export function getDicDrugType(data) {
  return request({
    url: "basic/dicDrugType/getDicDrugType",
    method: "post",
    data: data
  });
}

/**
 *  查询是否有本次处方
 */
export function getIsPre(data) {
  return request({
    url: "business/proPrescriptionController/getIsPre",
    method: "post",
    data: data,
    headers: {
      hosId: myJsTools.getItem("hosId")
    }
  });
}

/**
 * 查询本次挂号的检验单ID
 */
export function getPlmId(data) {
  return request({
    url: "business/proLab/getPlmId",
    method: "post",
    data: data,
    headers: {
      hosId: myJsTools.getItem("hosId")
    }
  });
}

/**
 * 获取处方pdf名称
 */
export function getPrescriptionPdfName(data) {
  return request({
    url: "business/diagnosisforweb/getPrescriptionPdfName",
    method: "post",
    data: data
  });
}

/**
 * 医生端-药品销售额汇总
 */
export function getDocDrugSalesSummary(data) {
  return request({
    url: "order/webquery/getDocDrugSalesSummary",
    method: "post",
    data: data
  });
}

/**
 *  医生端-药品销售额明细
 */
export function getDocDrugSalesDetail(data) {
  return request({
    url: "order/webquery/getDocDrugSalesDetail",
    method: "post",
    data: data
  });
}

/**
 *  根据挂号id查询患者基本信息与主诉
 */
export function getPatientInfoRecordTitleByRegId(data) {
  return request({
    url: "business/patientrecords/getPatientInfoRecordTitleByRegId",
    method: "post",
    data: data
  });
}

/**
 *  根据医生id和患者id查询患者本次以及上次病情
 */
export function getNowAndLastTimeRecord(data) {
  return request({
    url: "business/patientrecords/getNowAndLastTimeRecord",
    method: "post",
    data: data
  });
}

/**
 *  查询经典处方列表
 */
export function getClassicPrescriptionList(data) {
  return request({
    url: "basic/doccommonprescription/getClassicPrescriptionList ",
    method: "post",
    data: data
  });
}

/**
 *  查询处方模板详情
 */
export function getDrugPrescriptionPreInfo(data) {
  return request({
    url: "basic/doccommonprescription/getDrugPrescriptionPreInfo",
    method: "post",
    data: data
  });
}

/**
 *  查询历史处方导入信息
 */
export function getHistoryDetailPrescriptionImportInfo(data) {
  return request({
    url:
      "business/proPrescriptionController/getHistoryDetailPrescriptionImportInfo",
    method: "post",
    data: data
  });
}

/**
 *  查询处方是否有下架药品
 */
export function getDiagPrescriptionIsNoUseDrug(data) {
  return request({
    url: "business/proPrescriptionController/getDiagPrescriptionIsNoUseDrug",
    method: "post",
    data: data
  });
}

/**
 *  根据ID获取处方业务信息(续方)
 */
export function getPrescriptionInfoByIdContinuation(data) {
  return request({
    url:
      "business/proPrescriptionController/getPrescriptionInfoByIdContinuation",
    method: "post",
    data: data
  });
}

/**
 *  医生端-处方记录
 */
export function getPrescriptionNotesByPlmId(data) {
  return request({
    url: "business/proElectronicMedicalRecord/getPrescriptionNotesByPlmId",
    method: "post",
    data: data
  });
}

/**
 *  查询医生是否支持处方池
 */
export function getDocHavePrescriptionPoolVisible(data) {
  return request({
    url: "basic/doctor/getDocHavePrescriptionPoolVisible",
    method: "post",
    data: data
  });
}

/**
 *  查询处方池信息表分页列表
 */
export function queryProPrescriptionPoolListPage(data) {
  return request({
    url: "basic/proPrescriptionPool/queryProPrescriptionPoolListPage",
    method: "post",
    data: data
  });
}

/**
 *  根据主键查询处方池列表详情
 */
export function queryProPrescriptionPoolListDetail(data) {
  return request({
    url: "basic/proPrescriptionPool/queryProPrescriptionPoolListDetail",
    method: "post",
    data: data
  });
}

/**
 *  查询处方池已接单分页列表
 */
export function queryProPrescriptionPoolReceivingListPage(data) {
  return request({
    url:
      "business/prescriptionPoolController/queryProPrescriptionPoolReceivingListPage",
    method: "post",
    data: data
  });
}
/**
 *  修改处方池订单状态
 */
export function updateProPrescriptionPoolStatus(data) {
  return request({
    url: "basic/proPrescriptionPool/updateProPrescriptionPoolStatus",
    method: "post",
    data: data
  });
}

/**
 *  根据主键查询处方池处方信息
 */
export function queryProPrescriptionPoolPrescriptionInfo(data) {
  return request({
    url: "basic/proPrescriptionPool/queryProPrescriptionPoolPrescriptionInfo",
    method: "post",
    data: data
  });
}

/**
 *  验证医生是否可以接单
 */
export function checkDocIfReceivingOrder(data) {
  return request({
    url: "basic/proPrescriptionPool/checkDocIfReceivingOrder",
    method: "post",
    data: data
  });
}

/**
 *  医生查看处方业务信息(已支付/未支付)
 */
export function getPrescriptionInfoByPayment(data) {
  return request({
    url: "business/proPrescriptionController/getPrescriptionInfoByPayment",
    method: "post",
    data: data
  });
}

/**
 *  验证扫码开方
 */
export function checkScanCodePrescription(data) {
  return request({
    url: "basic/dicDrugController/checkScanCodePrescription",
    method: "post",
    data: data
  });
}

/**
 *  获取复购确认列表
 */
export function getRepurchaseConfirmList(data) {
  return request({
    url: "business/proPrescriptionController/getRepurchaseConfirmList",
    method: "post",
    data: data
  });
}

/**
 *   复购确认接口
 */
export function updateRepurchaseConfirm(data) {
  return request({
    url: "business/proPrescriptionController/updateRepurchaseConfirm",
    method: "post",
    data: data
  });
}

/**
 *   查询复购处方是否待确认
 */
export function getPreBussIsRepurchaseWaitConfirm(data) {
  return request({
    url: "business/proPrescriptionController/getPreBussIsRepurchaseWaitConfirm",
    method: "post",
    data: data
  });
}
