import request from '@/axios/request'

/**
 * 根据分组查询各组患者的信息
 */
export function findPatientInfoGroupByGroup(data) {
    return request({
        url: 'basic/usergroup/findPatientInfoGroupByGroup',
        method: 'post',
        data: data
    })
}

/**
 * 获取所有患者列表
 */
export function findPatientListByGroup(data) {
    return request({
        url: 'basic/propatient/findPatientListByGroup',
        method: 'post',
        data: data
    })
}

/**
 * 医生给患者推送消息
 */
export function doctorToPatientSendMessageToMq(data) {
    return request({
        url: 'basic/sendMessageToMq/doctorToPatientSendMessageToMq',
        method: 'post',
        data: data
    })
}
/**
 * 正再问诊患者列表
 */
export function getDocChatListReceive(data) {
    return request({
        url: 'business/proregister/getDocChatListReceive',
        method: 'post',
        data: data
    })
}



  

