import request from '@/axios/request'

/**
 * 医生药品销售额统计
 */
export function getDocDrugSalesList(data) {
  return request({
    url: 'order/getDocDrugSalesList',
    method: 'post',
    data: data
  })
}

/**
 * 医生药品收益统计
 */
export function getDocDrugProfitList(data) {
  return request({
    url: 'order/getDocDrugProfitList',
    method: 'post',
    data: data
  })
}

/**
 * 医生累计收益统计
 */
export function getDocTotalProfit(data) {
  return request({
    url: 'order/getDocTotalProfit',
    method: 'post',
    data: data
  })
}

/**
 * 医生月收益统计-折线图
 */
export function getDocMonthProfit(data) {
  return request({
    url: 'order/getDocMonthProfit',
    method: 'post',
    data: data
  })
}

/**
 * 医生月收益明细
 */
export function getDocMonthProfitDetail(data) {
  return request({
    url: 'order/getDocMonthProfitDetail',
    method: 'post',
    data: data
  })
}

/**
 * 医生日收益统计-折线图
 */
export function getDocDayProfit(data) {
  return request({
    url: 'order/getDocDayProfit',
    method: 'post',
    data: data
  })
}


/**
 * 医生结算收益与未结算收益
 */
export function getDocUnsettledAndSettledMoneyProfit(data) {
  return request({
    url: 'order/getDocUnsettledAndSettledMoneyProfit',
    method: 'post',
    data: data
  })
}


