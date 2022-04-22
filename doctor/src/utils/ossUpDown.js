import {downOssImg, uploadOssImg, uploadOssImgMany} from "../api/oss";
import myJsTools from "./myJsTools";
import {Toast} from "vant";

let ossUpDown = {};

ossUpDown.upImg = function(type, base64, otherId,path) {
  uploadOssImg({
    folderType: type,
    imgBody: base64,
    otherId: otherId
  }).then(res => {
    api.sendEvent({
      name: "upImg",
      extra: {
        url: res.data.url,
        src:path
      }
    });
    Toast.clear();
  });
};

ossUpDown.downImg = function(fileName) {
  downOssImg({
    imgName:fileName
  }).then(res=>{
    let herfUrl = res.data.url.split("-internal").join("");
    let url = herfUrl.split("?")[0];
    api.imageCache(
      {
        url: herfUrl,
        thumbnail:false,
      },
      function(ret, err) {
        if (ret) {
          url = ret.url;
          myJsTools.setItem(fileName,url);
          api.sendEvent({
            name: "downImg",
            extra: {
              url: url,
            }
          });
        }
      }
    );

  })
};
export default ossUpDown;
