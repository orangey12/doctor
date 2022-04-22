import request from "@/axios/request";

/**
 * 保存发送群
 */
export function createDocFlockDetail(data) {
  return request({
    url: "basic/docFollowPlan/createDocFlockDetail",
    method: "post",
    data: data
  });
}

/**
 *新增医生随访计划表
 */
export function saveFollow(data) {
  return request({
    url: "basic/docFollowPlan/save",
    method: "post",
    data: data
  });
}

/**
 *查询随访计划列表
 */
export function followupQueryPlanList(data) {
  return request({
    url: "basic/docFollowPlan/followupQueryPlanList",
    method: "post",
    data: data
  });
}

/**
 *查询随访计划执行历史列表
 */
export function followupQueryPlanExecutionHistoryList(data) {
  return request({
    url: "basic/docFollowPlan/followupQueryPlanExecutionHistoryList",
    method: "post",
    data: data
  });
}

/**
 *删除,开启,取消所有随访计划
 */
export function updateAll(data) {
  return request({
    url: "basic/docFollowPlan/updateAll",
    method: "post",
    data: data
  });
}
/**
 *查询随访计划明细
 */
export function followupQueryPlanDetails(data) {
  return request({
    url: "basic/docFollowPlan/followupQueryPlanDetails",
    method: "post",
    data: data
  });
}
/**
 *根据群id查询患者列表
 */
export function getPatientListByFlockId(data) {
  return request({
    url: "basic/proflocksend/getPatientListByFlockId",
    method: "post",
    data: data
  });
}

/**
 *修改医生随访计划表
 */
export function updatePlan(data) {
  return request({
    url: "basic/docFollowPlan/update",
    method: "post",
    data: data
  });
}

/**
 *执行随访计划
 */
export function performFollowupPlan(data) {
  return request({
    url: "basic/docFollowPlan/performFollowupPlan",
    method: "post",
    data: data
  });
}
/**
 * 查询随访计划执行明细
 */
export function followupQueryPlanImplementationDetails(data) {
  return request({
    url: "basic/docFollowPlan/followupQueryPlanImplementationDetails",
    method: "post",
    data: data
  });
}

/**
 * 查询某月的随访计划
 */
export function findUponAFollowupPlan(data) {
  return request({
    url: "basic/docFollowPlan/findUponAFollowupPlan",
    method: "post",
    data: data
  });
}
/**
 * 查询某天的随访计划
 */
export function findOfFollowupPlanOneDay(data) {
  return request({
    url: "basic/docFollowPlan/findOfFollowupPlanOneDay",
    method: "post",
    data: data
  });
}
/**
 * 开启,取消指定日期随访计划
 */
export function updateDateOf(data) {
  return request({
    url: "basic/docFollowPlan/updateDateOf",
    method: "post",
    data: data
  });
}

/**
 * 医生查询某个患者随访计划列表
 */
export function queryAPatientFollowupPlanList(data) {
  return request({
    url: "basic/docFollowPlan/queryAPatientFollowupPlanList",
    method: "post",
    data: data
  });
}

/**
 * 查询某个患者随访计划执行明细(已执行明细传执行主键pls_id)
 */
export function followupQueryPatientPlanImplementationDetails(data) {
  return request({
    url: "basic/docFollowPlan/followupQueryPatientPlanImplementationDetails",
    method: "post",
    data: data
  });
}


/**
 * 终止某个患者的随访计划
 */
export function stopDocFlockDetail(data) {
  return request({
    url: "basic/docFollowPlan/stopDocFlockDetail",
    method: "post",
    data: data
  });
}





