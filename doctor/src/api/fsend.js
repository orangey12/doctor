import request from "@/axios/request";
import Qs from "qs";
const user = {};

/**
 * 查询医生群发历史记录
 */
export function findDocBulkList(data) {
  return request({
    url: "basic/proflocksend/findDocBulkList",
    method: "post",
    data: data
  });
}
/**
 * 医生群发，保存群以及所发图文信息
 */
export function saveDocBulkInfo(data) {
  return request({
    url: "basic/proflocksend/saveDocBulkInfo",
    method: "post",
    data: data
  });
}
/**
 * 医生给患者，向mq推送消息
 */
export function doctorToPatientSendMessageToMq(data) {
  return request({
    url: "basic/sendMessageToMq/doctorToPatientSendMessageToMq",
    method: "post",
    data: data
  });
}
/**
 * 根据患者id查询用户id，appid，openid
 */
export function findAppidAndOpenidAndUseridByPatientId(data) {
  return request({
    url: "basic/propatient/findAppidAndOpenidAndUseridByPatientId",
    method: "post",
    data: data
  });
}


/**
 * 根据群发id查询医生群发详情
 */
export function getDocBulkDetails(data) {
  return request({
    url: "basic/proflocksend/getDocBulkDetails",
    method: "post",
    data: data
  });
}
