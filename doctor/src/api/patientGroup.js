import request from '@/axios/request'

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
 * 根据组id查询列表
 */
export function findPatientByGroupId(data) {
    return request({
        url: 'basic/usergroup/findPatientByGroupId',
        method: 'post',
        data: data
    })
}



  

