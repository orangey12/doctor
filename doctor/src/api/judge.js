import request from '@/axios/request'
const user = {}

/**
 * 获取审方列表
 */
export function getCheckPrescriptionList(data) {
    return request({
        url: 'business/proCheckPrescription/getCheckPrescriptionList',
        method: 'post',
        data: data
    })
}

/**
 * 获取待审方列表
 */
export function getNotCheckPrescriptionList(data) {
    return request({
        url: 'business/proCheckPrescription/getNotCheckPrescriptionList',
        method: 'post',
        data: data
    })
}

/**
 * 获取不同状态下审核处方的数量
 */
export function getCheckPrescriptionStatusNum(data) {
    return request({
        url: 'business/proCheckPrescription/getCheckPrescriptionStatusNum',
        method: 'post',
        data: data
    })
}

/**
* 获取待审核处方详情
*/
export function getNotCheckPrescriptionInfoById(data) {
    return request({
        url: 'business/proCheckPrescription/getNotCheckPrescriptionInfoById',
        method: 'post',
        data: data
    })
}

/**
* 获取未通过处方详情
*/
export function getNotPassCheckPrescriptionInfo(data) {
    return request({
        url: 'business/proCheckPrescription/getNotPassCheckPrescriptionInfo',
        method: 'post',
        data: data
    })
}

/**
* 保存审核通过信息
*/
export function saveCheckPrescriptionM(data) {
    return request({
        url: 'business/proCheckPrescription/saveCheckPrescriptionM',
        method: 'post',
        data: data
    })
}

/**
* 保存审核不通过信息
*/
export function saveNotPassCheckPrescription(data) {
    return request({
        url: 'business/proCheckPrescription/saveNotPassCheckPrescription',
        method: 'post',
        data: data
    })
}

/**
* 保存审核处方不合理
*/
export function getUnreasonableType(data) {
    return request({
        url: 'dictionary/getUnreasonableType',
        method: 'post',
        data: data
    })
}

/**
* 审方中药品列表
*/
export function getCheckPreDrugList(data) {
    return request({
        url: 'business/proPrescriptionController/getCheckPreDrugList',
        method: 'post',
        data: data
    })
}

/**
* 审方中患者病情
*/
export function getCheckPatientRecords(data) {
    return request({
        url: 'business/proCheckPrescription/getCheckPatientRecords',
        method: 'post',
        data: data
    })
}

/**
*  诊疗记录
*/
export function getDiagnosisTreat(data) {
    return request({
        url: 'business/proregister/getDiagnosisTreat',
        method: 'post',
        data: data
    })
}

/**
*  不通过改通过
*/
export function updateCheckPrePass(data) {
    return request({
        url: 'business/proCheckPrescription/updateCheckPrePass',
        method: 'post',
        data: data
    })
}
