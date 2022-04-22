
import request from '@/axios/request'

/**
 * 查询所有检查分类数据
 */
export function findAllDicPacsType(data) {
  return request({
    url: 'basic/pacsLinkItemController/findAllDicPacsType',
    method: 'post',
    data: data
  })
}

/**
 * 保存检查单
 */
export function saveProPacsInfo(data) {
  return request({
    url: 'basic/proPacsInfoController/saveProPacsInfo',
    method: 'post',
    data: data
  })
}

/**
 * 查询检查单状态
 */
export function getProPacsStatus(data) {
  return request({
    url: 'basic/proPacsInfoController/getProPacsStatus',
    method: 'post',
    data: data
  })
}


/**
 * 根据ID查询检查单信息
 */
export function getProPacsInfoByID(data) {
  return request({
    url: 'basic/proPacsInfoController/getProPacsInfoByID',
    method: 'post',
    data: data
  })
}

/**
 * 医生端开检查单-查询检查项目列表
 */
export function getPacsItmeList(data) {
  return request({
    url: 'basic/pacsLinkItemController/getPacsItmeList',
    method: 'post',
    data: data
  })
}

/**
 * 医生端开检查单-查询检查项目部位列表
 */
export function getPacsItmePositionList(data) {
  return request({
    url: 'basic/pacsLinkItemController/getPacsItmePositionList',
    method: 'post',
    data: data
  })
}

/**
 * 医生端开检查单-查询可以响应的检查机构列表
 */
export function getPacsOrganizationList(data) {
  return request({
    url: 'basic/pacsLinkItemController/getPacsOrganizationList',
    method: 'post',
    data: data
  })
}

/**
 * 医生端开检查单-查询是否有响应的检查机构
 */
export function getIsResponsePacsOrganization(data) {
  return request({
    url: 'basic/pacsLinkItemController/getIsResponsePacsOrganization',
    method: 'post',
    data: data
  })
}

/**
 * 查询检查机构项目价格
 */
export function getPaceItemPrice(data) {
  return request({
    url: 'basic/pacsLinkItemController/getPaceItemPrice',
    method: 'post',
    data: data
  })
}

/**
 * 查询本次检查单
 */
export function getProPacsList(data) {
  return request({
    url: 'basic/proPacsInfoController/getProPacsList',
    method: 'post',
    data: data
  })
}

/**
 * 我的检查
 */
export function myPacsList(data) {
  return request({
    url: 'basic/proPacsInfoController/myPacsList',
    method: 'post',
    data: data
  })
}



