import request from "@/axios/request";

/**
 * 查询用户分组信息
 */
export function findGroupNameAndPatientCountByGroup(data) {
  return request({
    url: "basic/usergroup/findGroupNameAndPatientCountByGroup",
    method: "post",
    data: data
  });
}
/**
 * 删除分组
 */
export function doctorDeleteUserGroup(data) {
  return request({
    url: "basic/usergroup/doctorDeleteUserGroup",
    method: "post",
    data: data
  });
}
/**
 *
 */
export function doctorUpdateUserGroup(data) {
  return request({
    url: "basic/usergroup/doctorUpdateUserGroup",
    method: "post",
    data: data
  });
}
/**
 * 编辑分组(获取分组下的所有患者)
 */
export function findPatientByGroupId(data) {
  return request({
    url: "basic/usergroup/findPatientByGroupId",
    method: "post",
    data: data
  });
}
/**
 * 编辑分组(删除分组的患者)
 */
export function doctorDeletePatientByGroupId(data) {
  return request({
    url: "basic/usergroup/doctorDeletePatientByGroupId",
    method: "post",
    data: data
  });
}
/**
 * 查询该医生所有患者
 */
export function findAllUserIdAndNameAndHead(data) {
  return request({
    url: "basic/usergroup/findAllUserIdAndNameAndHead",
    method: "post",
    data: data
  });
}
/**
 * 医生把某个患者，或者某几个患者，添加至某个组内
 */
export function doctorAddPatientToSomeOneGroup(data) {
  return request({
    url: "basic/usergroup/doctorAddPatientToSomeOneGroup",
    method: "post",
    data: data
  });
}
/**
 * 医生添加用户分组
 */
export function doctorAddUserGroup(data) {
  return request({
    url: "basic/usergroup/doctorAddUserGroup",
    method: "post",
    data: data
  });
}
/**
 * 筛选(用户分组)
 */
export function findPatientList(data) {
  return request({
    url: "basic/propatient/findPatientList",
    method: "post",
    data: data
  });
}
/**
 * 筛选(分组列表)
 */
export function findGroupNameAndPatientCountByGroupIdNotGroup(data) {
  return request({
    url: "basic/usergroup/findGroupNameAndPatientCountByGroupIdNotGroup",
    method: "post",
    data: data
  });
}

/**
 * 医生给患者修改备注和星标标志
 */
export function doctorUpdatePatientRemarkAndAsterisk(data) {
  return request({
    url: "basic/propatient/doctorUpdatePatientRemarkAndAsterisk",
    method: "post",
    data: data
  });
}

/**
 * 根据患者id查询患者的星标状态和备注
 */
export function findAttentionAndRemarkByPatientId(data) {
  return request({
    url: "basic/propatient/findAttentionAndRemarkByPatientId",
    method: "post",
    data: data
  });
}

/**
 * 添加患者至一个或多个组
 */
export function addPatientToGroups(data) {
  return request({
    url: "basic/usergroup/addPatientToGroups",
    method: "post",
    data: data
  });
}

/**
 * 根据医生Id查询分组名称和组内人员
 */
export function getGroupIdAndGroupNameAndPatientNameStrListPage(data) {
  return request({
    url: "basic/usergroup/getGroupIdAndGroupNameAndPatientNameStrListPage",
    method: "post",
    data: data
  });
}

/**
 * 根据患者id医生id查询是否是黑名单
 */
export function getPullBlackByPatientDocId(data) {
  return request({
    url: "/basic/propatient/getPullBlackByPatientDocId",
    method: "post",
    data: data
  });
}

/**
 * 根据医生Id查询分组名称和组内人员
 */
export function editPullBlackByPatientDocId(data) {
  return request({
    url: "/basic/propatient/editPullBlackByPatientDocId",
    method: "post",
    data: data
  });
}
