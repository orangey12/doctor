import request from '@/axios/request'

/**
 * 咨询小结
 */
export function updateinterrogationSummary(data) {
    return request({
        url: 'business/proreceive/updateinterrogationSummary',
        method: 'post',
        data: data
    })
}

/**
 * 结束问诊
 */
export function updateEndReceive(data) {
    return request({
        url: 'business/proreceive/updateEndReceive',
        method: 'post',
        data: data
    })
}

/**
 * 退诊和投诉
 */
export function updateReturnReceive(data) {
    return request({
        url: 'business/proreceive/updateReturnReceive',
        method: 'post',
        data: data
    })
}
