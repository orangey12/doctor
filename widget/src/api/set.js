

import request from '@/axios/request'

/**
 * 查询医院对医生的开关，医生的开关，时长和价格（咨询，复诊）
 */
export function getTwoSwitchAndPrice(data) {
  return request({
    url: 'basic/docBusinessDefault/getTwoSwitchAndPrice',
    method: 'post',
    data: data
  })
}


/**
 * 医生修改自己的开关状态（咨询，复诊）
 */
export function changeDocSwitch(data) {
  return request({
    url: 'basic/docBusinessDefault/changeDocSwitch',
    method: 'post',
    data: data
  })
}

/**
 *保存医生默认服务设置数据（咨询，复诊）
 */
export function saveDicCustomBusiness(data) {
  return request({
    url: 'basic/docBusinessDefault/saveDicCustomBusiness',
    method: 'post',
    data: data
  })
}

/**
 *查询自定义个性化信息
 */
export function getPersonalityInfo(data) {
  return request({
    url: 'basic/docBusinessPersonality/getPersonalityInfo',
    method: 'post',
    data: data
  })
}


/**
 *开自定义个性化开关
 */
export function savePersonalitySwitchInfo(data) {
  return request({
    url: 'basic/docBusinessPersonality/savePersonalitySwitchInfo',
    method: 'post',
    data: data
  })
}

/**
 *修改自定义个性化价格
 */
export function updatePersonalityPriceInfo(data) {
  return request({
    url: 'basic/docBusinessPersonality/updatePersonalityPriceInfo',
    method: 'post',
    data: data
  })
}


/**
 *关自定义个性化开关
 */
export function updatePersonalitySwitchInfo(data) {
  return request({
    url: 'basic/docBusinessPersonality/updatePersonalitySwitchInfo',
    method: 'post',
    data: data
  })
}

/**
 *查询转诊信息
 */
export function getReferralInfo(data) {
  return request({
    url: 'basic/docBusinessDefault/getReferralInfo',
    method: 'post',
    data: data
  })
}

/**
 *医生开转诊开关
 */
export function saveReferralSwitchInfo(data) {
  return request({
    url: 'basic/docBusinessDefault/saveReferralSwitchInfo',
    method: 'post',
    data: data
  })
}

/**
 * 医生修改转诊价格
 */
export function updateReferralPriceInfo(data) {
  return request({
    url: 'basic/docBusinessDefault/updateReferralPriceInfo',
    method: 'post',
    data: data
  })
}

/**
 * 关闭修改转诊开关
 */
export function updateReferralSwitchInfo(data) {
  return request({
    url: 'basic/docBusinessDefault/updateReferralSwitchInfo',
    method: 'post',
    data: data
  })
}

/**
 * 保存药师自动审方开关
 */
export function saveMedicinePrescriptionsSwitchAutomatically(data) {
  return request({
    url: '/basic/doctor/saveMedicinePrescriptionsSwitchAutomatically',
    method: 'post',
    data: data
  })
}

/**
 * 查询药师自动审方开关
 */
export function selectMedicinePrescriptionsSwitchAutomatically(data) {
  return request({
    url: '/basic/doctor/selectMedicinePrescriptionsSwitchAutomatically',
    method: 'post',
    data: data
  })
}


/**
 * 查询轮播图信息表列表
 */
export function queryDicCarouselMapList(data) {
  return request({
    url: '/dictionary/DicCarouselMap/queryDicCarouselMapList',
    method: 'post',
    data: data
  })
}


/**
 * 根据主键查询轮播图信息表
 */
export function queryDicCarouselMapbyId(data) {
  return request({
    url: '/dictionary/DicCarouselMap/queryDicCarouselMapbyId',
    method: 'post',
    data: data
  })
}

/**
 * 查询症型字典
 */
export function getSymptomaticTypeList(data) {
  return request({
    url: '/dictionary/dicSymptomaticType/getSymptomaticTypeList',
    method: 'post',
    data: data
  })
}

/**
 * 修改医生开处方是否实名认证
 */
export function editDoctorPrescriptionAuthenticate(data) {
  return request({
    url: 'basic/doctor/editDoctorPrescriptionAuthenticate',
    method: 'post',
    data: data
  })
}

/**
 * 查询医生开处方是否实名认证和医院配置
 */
export function getDoctorPrescriptionAuthenticate(data) {
  return request({
    url: 'basic/doctor/getDoctorPrescriptionAuthenticate',
    method: 'post',
    data: data
  })
}

/**
 * 医生端关闭实名认证按钮时进行实名认证
 */
export function docBeforeThePrescriptionPrescriptionAuthenticate(data) {
  return request({
    url: 'basic/doctor/docBeforeThePrescriptionPrescriptionAuthenticate',
    method: 'post',
    data: data
  })
}

/**
 * 医生端开方前查询是否需要实名认证
 */
export function docBeforeThePrescriptionNeedCheck(data) {
  return request({
    url: 'basic/doctor/docBeforeThePrescriptionNeedCheck',
    method: 'post',
    data: data
  })
}

/**
 * 查询医生设置未支付是查看药品
 */
export function getDoctordidNotPayDrugs(data) {
  return request({
    url: 'basic/doctor/getDoctordidNotPayDrugs',
    method: 'post',
    data: data
  })
}

/**
 * 修改医生设置未支付是查看药品
 */
export function editDoctorDidNotPayDrugs(data) {
  return request({
    url: 'basic/doctor/editDoctorDidNotPayDrugs',
    method: 'post',
    data: data
  })
}


/**
 * 查询医生对某个患者是否可以允许其查看药品的设置
 */
export function getDocToOnePatientCanLookDrugSetting(data) {
  return request({
    url: 'basic/doctor/getDocToOnePatientCanLookDrugSetting',
    method: 'post',
    data: data
  })
}


/**
 * 修改医生对患者设置未支付是查看药品
 */
export function editDoctorToPatientDidNotPayDrugs(data) {
  return request({
    url: 'basic/doctor/editDoctorToPatientDidNotPayDrugs',
    method: 'post',
    data: data
  })
}

/**
 * 查询医生对患者的开关
 */
export function getDocPatientSwitch(data) {
  return request({
    url: 'basic/doctor/getDocPatientSwitch',
    method: 'post',
    data: data
  })
}


/**
 * 保存医生对患者的开关
 */
export function saveDocPatientSwitch(data) {
  return request({
    url: 'basic/doctor/saveDocPatientSwitch',
    method: 'post',
    data: data
  })
}

