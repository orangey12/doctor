import request from "../axios/requestUpload";

/**
 * 上传图片
 */
export function uploadOssImg(data) {
  data.type = "oss";
  return request({
    url: "ossUpload/uploadOssImg",
    method: "post",
    data: data
  });
}
/**
 * 下载图片
 */
export function downOssImg(data) {
  data.type = "oss";
  return request({
    url: "ossDownLoad/downOssImg",
    method: "post",
    data: data
  });
}

// 下载多个pdf
export function downMergePDF(data) {
  data.type = "oss";
  return request({
    url: "ossDownLoad/downMergePDF",
    method: "post",
    data: data
  });
}
/**
 * 下载图片
 */
export function getLabPresentationOssImg(data) {
  return request({
    url: "ossPresentationService/getLabPresentationOssImg",
    method: "post",
    data: data
  });
}

/**
 * 下载图片
 */
export function getLabFromOssImgByImageUrl(data) {
  return request({
    url: "ossDownLoad/downAndReturnBase64",
    method: "post",
    data: data
  });
}

/**
 * 根据文件名下载图片
 */
export function getLabFromOssImgByImageName(data) {
  return request({
    url: "ossPresentationService/getLabFromOssImgByImageName",
    method: "post",
    data: data
  });
}
/**
 * 多文件下载接口
 */
export function downLoadFileMany(data) {
  return request({
    url: "ossDownLoad/downLoadFileMany",
    method: "post",
    data: data
  });
}


/**
 * oss上传图片接口多张
 */
export function uploadOssImgMany(data) {
  return request({
    url: "ossUpload/uploadOssImgMany",
    method: "post",
    data: data
  });
}


