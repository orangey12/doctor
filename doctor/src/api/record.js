import request from "../axios/request";

/**
 * 医生端添加电子病历接口
 */
export function addProElectronicMedical(data) {
  return request({
    url: "business/proElectronicMedicalRecord/addProElectronicMedical",
    method: "post",
    data: data
  });
}

/**
 * 医生端查询此次挂号的电子病历历史记录
 */
export function getElectronicMedicalRegPage(data) {
  return request({
    url: "business/proElectronicMedicalRecord/getElectronicMedicalRegPage",
    method: "post",
    data: data
  });
}

/**
 * 医生端查询某个挂号最新一次的电子病历详情
 */
export function getLatestDetail(data) {
  return request({
    url: "business/proElectronicMedicalRecord/getLatestDetail",
    method: "post",
    data: data
  });
}

/**
 * 医生端查询某一条电子病历的详情
 */
export function getOneDetail(data) {
  return request({
    url: "business/proElectronicMedicalRecord/getOneDetail",
    method: "post",
    data: data
  });
}
/**
 * 医生端查询某个挂号最新一次的电子病历详情或者患者本身的四史
 */
export function getLatestDetailOrPatientSelfForHistory(data) {
  return request({
    url:
      "/business/proElectronicMedicalRecord/getLatestDetailOrPatientSelfForHistory",
    method: "post",
    data: data
  });
}
//电子病历查询验证
export async function medicalRecord() {
  try {
    let res = await fetch(
      "https://llootong.cn/staticJson/his/medicalRecord.json"
    );

    res = await res.json();
    return res;
  } catch (error) {
    return Promise.reject(new Error(error));
  }
}
