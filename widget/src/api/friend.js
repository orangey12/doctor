import request from '@/axios/request'

/**
 * 医生端查询我所在团队分页
 */
export function getMyTeamPage(data) {
  return request({
    url: 'basic/doctorTeam/getMyTeamPage',
    method: 'post',
    data: data
  })
}

/**
 *医生端查询我的团队信息
 */
export function getMyTeamInfo(data) {
  return request({
    url: 'basic/doctorTeam/getMyTeamInfo',
    method: 'post',
    data: data
  })
}

/**
 *查询医生基本信息，患者评价
 */
export function searchDocInfoEvaluation(data) {
  return request({
    url: 'basic/doctor/searchDocInfoEvaluation',
    method: 'post',
    data: data
  })
}

/**
 * 医生端请求添加好友关系
 */
export function askAddDocFriendRelation(data) {
  return request({
    url: 'basic/docFriendRelation/askAddDocFriendRelation',
    method: 'post',
    data: data
  })
}

/**
 * 医生端确认添加好友关系
 */
export function confirmAddDocFriendRelation(data) {
  return request({
    url: 'basic/docFriendRelation/confirmAddDocFriendRelation',
    method: 'post',
    data: data
  })
}


/**
 * 医生端查询待验证好友列表
 */
export function getToBeVerifiedList(data) {
  return request({
    url: 'basic/docFriendRelation/getToBeVerifiedList',
    method: 'post',
    data: data
  })
}

/**
 * 医生批量设置谁是否可对自己转诊
 */
export function batchSetReferralForDoc(data) {
  return request({
    url: 'basic/dicReferralDoc/batchSetReferralForDoc',
    method: 'post',
    data: data
  })
}



/**
 * 医生端给好友设置备注
 */
export function setRemarksToFriend(data) {
  return request({
    url: 'basic/docFriendRelation/setRemarksToFriend',
    method: 'post',
    data: data
  })
}

/**
 * 医生端删除好友
 */
export function deleteFriend(data) {
  return request({
    url: 'basic/docFriendRelation/deleteFriend',
    method: 'post',
    data: data
  })
}

/**
 * 医生端查询我的好友列表
 */
export function findMyBuddyPage(data) {
  return request({
    url: 'basic/docFriendRelation/findMyBuddyPage',
    method: 'post',
    data: data
  })
}

/**
 * 查询两个医生的状态，是否好友
 */
export function getTwoDocFriendStatus(data) {
  return request({
    url: 'basic/docFriendRelation/getTwoDocFriendStatus',
    method: 'post',
    data: data
  })
}

/**
 * 查询医生评价列表
 */
export function findDocEvaluateListPage(data) {
  return request({
    url: 'order/payOrder/findDocEvaluateListPage',
    method: 'post',
    data: data
  })
}




