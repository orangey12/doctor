<template>
  <div class="newsConnect">
    <navbar title="选择"></navbar>
    <span
      class="nav font-login-color-blue"
      @click="confire"
      :style="{ top: topHeight }"
    >完成</span
    >
    <div class="head">
      <van-form action="/">
        <van-search
          v-model="value"
          background="rgba(0,0,0,0.03)"
          :left-icon="require('../../assets/img/index/search.png')"
          placeholder="请输入想要搜索的内容"
          :clearable="true"
          @search="getPatientList"
        />
      </van-form>
    </div>
    <div class="new display-div" @click="goSort">
      <span>选择分组</span>
      <img src="@/assets/img/my/my_back.png" alt=""/>
    </div>
    <div class="box">
      <van-index-bar :index-list="indexList" :sticky="false">
        <div v-for="(item, key, index) in patientList" :key="index">
          <van-index-anchor
            :index="key != '☆' ? key : '☆ 星标用户'"
            style="background: #f5f5f5"
          ></van-index-anchor>
          <div class="list" v-for="(val, i) in item" :key="i">
            <van-checkbox-group v-model="result">
              <van-checkbox :name="val">
                <template>
                  <div class="item">
                    <img v-zlazy="val.patientImg" alt=""/>
                    <span>{{ val.patientName }}</span>
                  </div>
                </template>
              </van-checkbox>
            </van-checkbox-group>
          </div>
        </div>
      </van-index-bar>
    </div>
    <!-- 提示信息（单人转发文字/图片） -->
    <van-popup v-model="show" class="show">
      <p class="p_title">发送给</p>
      <div class="p_box" @click="lookHead">
        <div
          style="display: flex"
          v-for="(item, index) in result"
          :key="index"
          class="img-width-height-spe"
        >
          <img v-zlazy="item.patientImg" :key="index" style="display: block"/>
          <!--          <span v-if="result.length==1" style="width: 100px">{{ item.patientName }}</span>-->
        </div>
        <div class="patName" v-if="result.length==1">{{result[0].patientName }}</div>

        <img
          src="@/assets/img/my/my_back.png"
          style="
            width: 22px;
            height: 22px;
            position: absolute;
            right: 0;
            z-index: 1;
          "
          v-if="result.length > 1"
        />
      </div>
      <div class="p_message">
        <span v-if="itemType == 'text'">{{ content }}</span>
        <img v-zlazy="content" alt="" v-if="itemType == 'image'"/>
        <div v-if="itemType == 'scale'" class="scaleDiv">
          <li class="title">{{ title }}</li>
          <li class="updateTime">创建时间：{{ updateTime }}</li>
          <li class="total">共{{ total }}题</li>
        </div>
      </div>
      <div class="btns">
        <button class="publicWhiteBtn" @click="cancel">取消</button>
        <button class="publicBtn twoBtn" @click="sure">确定</button>
      </div>
    </van-popup>
  </div>
</template>
<script>
import $api from "@/utils/api.js";
import navbar from "@/common/navbar";
import Pinyin from "@/utils/pinYin.js";
import myJsTools from "../../utils/myJsTools";
import {Toast} from "vant";
import {getLabFromOssImgByImageUrl} from "@/api/oss";
import {
  findPatientListByGroup,
  doctorToPatientSendMessageToMq,
} from "@/api/pictrue";
import ossUpDown from "../../utils/ossUpDown";
import {saveProFlockSend} from "../../api/scale";
import sendMsg from "../../utils/eschat";
import eschatUnit from "../../utils/eschat";

export default {
  name: "newsConnect",
  components: {navbar},
  data() {
    return {
      value: "",
      indexList: [],
      result: [],
      patientList: [],
      //是否显示弹窗(单人转发文字/图片)
      show: false,
      itemType: "",
      content: "",
      topHeight: "", //头部距离
      updateTime: "",
      title: "",
      total: "",
      didId: "",
      docId: "",
    };
  },
  beforeCreate() {
    this.$store.commit("UPDATE_KEEP_ALIVE", {
      keepAlive: "newsConnect",
    });
  },
  beforeRouteLeave(to, from, next) {
    if (to.name == "pictureLook" || to.name == "lookHead") {
      from.meta.keepAlive = true;
    } else {
      from.meta.keepAlive = false;
      this.$store.commit("UPDATE_KEEP_ALIVE", {
        keepAlive: "newsConnect",
        type: 1,
      });
    }
    next();
  },
  created() {
    this.itemType = this.$route.query.itemType;
    this.content = this.$route.query.content;
    if (this.$route.query.itemType == "scale") {
      this.title = this.$route.query.title;
      this.total = this.$route.query.total;
      this.updateTime = this.$route.query.updateTime;
      this.didId = this.$route.query.didId;
    }
    this.docId = myJsTools.getItem("token_info").docId;
  },
  mounted() {
    this.getPatientList();
    this.topHeight = parseInt(api.safeArea.top) + 1 + "px";
  },

  methods: {
    //选择患者之后返回之前的页面
    prevPage() {
      console.log("dddd");
    },
    //初始化获取患者列表
    getPatientList() {
      findPatientListByGroup({
        patientName: this.value,
        filterNoUserIdPatient: "1",
        docId: myJsTools.getItem("token_info").docId,
      }).then((res) => {
        let arr = myJsTools.data_letter_sort(res.data.proPatientList, "py");
        this.patientList = arr;
        this.indexList = Object.keys(this.patientList);
      });
    },
    goSort() {
      this.$router.push({
        name: "selectSort",
        query: {
          itemType: this.itemType,
          content: this.content,
          title: this.title,
          total: this.total,
          updateTime: this.updateTime,
          didId: this.didId,
        },
      });
    },
    //点击完成
    confire() {
      console.log(this.result);
      this.show = true;
    },
    //点击确定
    sure() {
      let patientList = [],
        receiverIdArray = [];
      this.result.map((item) => {
        console.log("item-------------" + JSON.stringify(item));
        console.log("itemType" + this.itemType)
        if (this.itemType == "text") {
          this.sendMsg(item.patientId, item.userId.toLowerCase());
        } else if (this.itemType == "image") {
          this.sendImg(item.patientId, item.userId.toLowerCase());
        }
        patientList.push({patientId: item.patientId});
        receiverIdArray.push(item.patientId);
      });
      let content = "";
      if (this.itemType == "text") {
        content = this.content;
      } else if (this.itemType == "image") {
        content = "[图片]";
      } else if (this.itemType == "scale") {
        content = "医生给你发送了一张量表";
        saveProFlockSend({
          didId: this.$route.query.didId,
          docId: this.docId,
          patientList: patientList,
          sendType: "1",
        }).then((res) => {
          console.log(JSON.stringify(res));
          this.result.map((item, index) => {
            this.sendScale(item.patientId, item.userId, res.data.sendId);
            if (index == this.result.length - 1) {
              this.$router.go(-2);
            }
          });
        });
      }
    },
    sendImg(patientId, userId) {
      let me = this;
      let dataURL = "";
      console.log("dddddddd"+ JSON.stringify(me.content))
      if(me.content.indexOf("/storage/") > -1 || me.content.indexOf("/Application/") > -1){
        eschatUnit.sendImg(me.content, me.docId, patientId, userId);
        me.$router.go(-2);
      }else{
        getLabFromOssImgByImageUrl({
          imgUrl: me.content,
        }).then((res) => {
          console.log(
            "222222222222222222222222222222222222222",
            JSON.stringify(res)
          );
          var trans = api.require("trans");
          trans.saveImage(
            {
              base64Str: res.data.picBase64,
              imgPath: api.fsDir + "/img/",
              imgName: "ss.png",
            },
            function (ret, err) {
              console.log(api.fsDir);
              if (ret.status) {
                eschatUnit.sendImg(
                  api.fsDir + "/" + "img" + "/" + "ss.png",
                  me.docId,
                  patientId,
                  userId
                );
                me.$router.go(-2);
              }
            }
          );
        });
      }

    },
    // 发送文本消息和表情
    sendMsg(patientId, userId) {
      var me = this;
      eschatUnit.sendMsg(this.content, this.docId, patientId, userId);
      this.$router.go(-2);
    },
    sendScale(patientId, userId, sendId) {
      let ext = {
        sendId: sendId,
        title: this.title,
        type: "lb",
        isFeedback: "0",
      };
      eschatUnit.sendMsg("[量表]", this.docId, patientId, userId, ext);
    },
    //点击查看
    look() {
      this.$router.push({
        name: "pictureLook",
      });
    },
    //点击查看头像详情
    lookHead() {
      this.$router.push({
        name: "lookHead",
        query: {result: this.result},
      });
    },
    //点击取消
    cancel() {
      this.show = false;
    },
  },
};
</script>
<style scoped lang="less">
.img-width-height-spe {
  margin-right: 4px;
}

/deep/ .van-search {
  padding: 0px !important;
}

/deep/ .van-cell {
  align-items: center;
}

/deep/ .van-index-anchor--sticky {
  position: relative;
  .font-login-color;
  transform: translate3d(0px, 0px, 0px);
  background-color: @white;
}

/deep/ .van-index-bar__index--active {
  .font-login-color;
}

/deep/ .van-index-bar__index {
  padding: 0 4px 0 16px;
  .font-blod;
  .font-size-sm;
  .font-login-color;
  line-height: 14px;
}

/deep/ .van-index-anchor {
  z-index: 0;
  box-sizing: border-box;
  padding: 0 16px;
  .font-blod;
  .font-size-sm;
  .font-login-color;
  line-height: 32px;
  background-color: transparent;
}

.newsConnect {
  background: @white;

  .nav {
    position: fixed;
    top: 0;
    right: 16px;
    .font-size-sm;
    z-index: 999999;
    line-height: 44px;
  }

  .head {
    position: relative;

    img {
      position: absolute;
      .icon-width-height-sm;
      left: 4%;
      top: 11px;
    }
  }

  .new {
    position: relative;
    z-index: 2;
    padding: 11px 4%;
    background: @white;

    img {
      .icon-width-height-sm;
    }

    span {
      .font-size-md;
      .black-font;
      line-height: 22px;
    }
  }

  .title {
    background: @field-back;
    padding: 4px 0;
    .font-size-sm;
    .black-font;
    line-height: 16px;
  }

  .box {
    height: calc(100vh - 142px);
    overflow-y: scroll;
  }

  .list {
    background: @white;
    padding: 0 4%;

    .item {
      display: flex;
      align-items: center;

      img {
        .img-width-height-spe;
        margin: 0 16px;
        padding: 14px 0;
      }

      span {
        .black-font;
        .font-size-md;
        line-height: 20px;
      }
    }
  }

  .show {
    width: calc(84% - 46px);
    padding: 16px 23px;
    background: @white;
    border-radius: 8px;

    .p_title {
      .font-size-lg;
      .font-blod;
      .black-font;
      line-height: 22px;
      margin-bottom: 10px;
    }

    .p_box {
      display: flex;
      align-items: center;
      margin-bottom: 12px;
      width: 100%;

      img {
        margin-right: 8px;
      }

      span {
        .font-size-md;
        .black-font;
        line-height: 20px;
      }
    }

    .p_message {
      padding: 16px;
      background: @field-back;
      border-radius: 8px;
      margin-bottom: 20px;

      span {
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }
    }
  }
}
patName{
  display: block!important;
  margin-left: 10px!important;
  width: 300px!important;
}
</style>
