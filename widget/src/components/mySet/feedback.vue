<template>
  <div>
    <navbar title="意见反馈"></navbar>
    <div>
      <li class="title">请选择您想反馈的问题点(必选)</li>
      <van-radio-group v-model="radio">
        <van-radio :name="item.val" :key="index" v-for="(item,index) in reason">{{ item.name }}</van-radio>
      </van-radio-group>
      <li class="title">请补充详细问题和意见</li>
      <div class="otherReason">
        <van-field
          v-model="message"
          rows="3"
          maxlength="200"
          autosize
          type="textarea"
          show-word-limit
          placeholder="请输入反馈内容"
        />
        <img src="../../assets/img/my/upImg.png" class="upImg" @click="selectPic" v-if="!imgSrc">
        <img v-zlazy="imgSrc" class="upImg" @click="selectPic" v-if="imgSrc">
      </div>
    </div>
    <div class="bottomBtn">
      <button class="publicBtn" @click="commit">提交</button>
    </div>
  </div>
</template>

<script>
import Navbar from "../../common/navbar";
import {Toast} from "vant";
import myJsTools from "../../utils/myJsTools";

export default {
  name: "feedback",
  components: {Navbar},
  data() {
    return {
      radio:0,
      reason: [{"name": "功能异常：功能故障或者不可用", "val": 0}, {
        "name": "产品建议：功能用得不爽想提建议",
        "val": 1
      }, {"name": "安全问题：密码、数据、隐私等", "val": 2}, {"name": "其他问题", "val": 3}],
      imgSrc:"",
      message:"",
    }
  },
  methods: {
    //选择图片
    async selectPic() {
      if (api.systemType != 'ios') {
        let s = await myJsTools.getPromise("camera");
        if(!s){
          Toast("请开启相机权限")
          return;
        }
      }
      let me = this;
      var UIAlbumBrowser = api.require("UIAlbumBrowser");
      UIAlbumBrowser.open(
        {
          max: 1,
          type: "image",
          selectedAll: false,
          styles: {
            bg: "#fff",
            mark: {
              icon: "",
              position: "bottom_left",
              size: 20,
            },
            nav: {
              bg: "rgba(0,0,0,0.6)",
              titleColor: "#fff",
              titleSize: 18,
              cancelColor: "#fff",
              cancelSize: 16,
              finishColor: "#fff",
              finishSize: 16,
            },
          },
          rotation: true,
        },
        function (ret, err) {
          if (ret) {
            for (let i = 0; i < ret.list.length; i++) {
              const element = ret.list[i];
              if (api.systemType == 'ios') {
                me.transPath(element);
              } else {
                me.sendImgMsg(element);
              }

            }
          }
        }
      );
    },
    transPath: function (element) {
      var me = this;
      var UIAlbumBrowser = api.require('UIAlbumBrowser');
      UIAlbumBrowser.transPath({
        path: element.path
      }, function (ret, err) {
        if (ret) {
          var iospath = ret.path;
          element.path = iospath;
          me.sendImgMsg(element);
        } else {
          console.log(JSON.stringify(err));
        }
      });
    },
    sendImgMsg(element){
      console.log(JSON.stringify(element) + "=======elem");
      this.imgSrc = element.path
    },
    commit(){
      console.log(this.radio);
      if(this.radio == '3'){
        if(!this.message){
          Toast("请填写意见反馈内容");
          return ;
        }
      }
      Toast("反馈成功");
      this.$router.replace({
        name:"feedbackFinish"
      })
    }
  }
}
</script>

<style scoped lang="less">

.upImg{
  width: 108px;
  height: 108px;
  margin: 12px 16px 0px;
}
.title{
  .font-color-2;
  .font-size-md;
  padding: 4px 16px;
  line-height: 22px;
}
.van-radio-group{
  background: @white;
  .van-radio{
    padding: 12px;
    .black-font;
    .font-size-md;
  }
}
.otherReason{
  background: white;
  padding-bottom: 12px;
}
</style>
