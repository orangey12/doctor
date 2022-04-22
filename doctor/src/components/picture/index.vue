<template>
  <div class="pictureIndex">
    <navbar title="选择"></navbar>
    <div class="head">
      <van-form action="/">
        <van-search
          v-model="value"
          background="rgba(0,0,0,0.03)"
          :left-icon="require('../../assets/img/index/search.png')"
          placeholder="请输入想要搜索的内容"
          :clearable="true"
          @search="getList"
        />
      </van-form>
    </div>
    <div class="new" @click="goNewsConnect">
      <img src="@/assets/img/picture/new.png" class="icon-width-height-sm"/>
      <span class="font-login-color-blue">创建新的聊天</span>
    </div>
    <div class="title">正在问诊中的患者</div>
    <div class="list">
      <van-checkbox-group v-model="result">
        <div v-for="(val, index) in groupList" :key="index">
          <van-checkbox :name="val">
            <template>
              <div class="item">
                <img v-zlazy="val.patientImg" class="img-width-height-spe"/>
                <span>{{ val.patientName }}</span>
              </div>
            </template>
          </van-checkbox>
        </div>
      </van-checkbox-group>
    </div>
    <div class="bottomBtn" @click="confire">
      <button class="publicBtn">发送</button>
    </div>
    <!-- 提示信息（单人转发文字/图片） -->
    <van-popup v-model="show" class="show">
      <p class="p_title">发送给</p>
      <div class="p_box" @click="lookHead">
        <div
          style="display: flex;"
          v-for="(item, index) in result"
          :key="index"
          class="img-width-height-spe"
        >
          <img v-zlazy="item.patientImg" :key="index" style="display: block"/>
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
import myJsTools from "@/utils/myJsTools";
import {Popup} from "vant";
import {Toast} from "vant";
import {
  getDocChatListReceive,
  doctorToPatientSendMessageToMq,
} from "@/api/pictrue";
import {getLabFromOssImgByImageUrl} from "../../api/oss";
import eschatUnit from "../../utils/eschat";
import ossUpDown from "../../utils/ossUpDown";
import {saveProFlockSend} from "../../api/scale";

export default {
  name: "pictureIndex",
  components: {navbar},
  data() {
    return {
      value: "",
      result: [],
      //是否显示弹窗(单人转发文字/图片)
      show: false,
      groupList: [],
      itemType: "",
      content: "",
      docId: "",
      updateTime: "",
      title: "",
      total: "",
      didId: "",
    };
  },
  beforeCreate() {
    this.$store.commit("UPDATE_KEEP_ALIVE", {
      keepAlive: "pictureIndex",
    });
  },
  beforeRouteLeave(to, from, next) {
    if (to.name == "pictureLook" || to.name == "lookHead") {
      from.meta.keepAlive = true;
    } else {
      from.meta.keepAlive = false;
      this.$store.commit("UPDATE_KEEP_ALIVE", {
        keepAlive: "pictureIndex",
        type: 1,
      });
    }
    next();
  },
  created() {
    this.itemType = this.$route.query.itemType;
    console.log(this.$route.query);
    if (this.$route.query.itemType == "scale") {
      this.title = this.$route.query.title;
      this.total = this.$route.query.total;
      this.updateTime = this.$route.query.updateTime;
      this.didId = this.$route.query.didId;
    }
    this.content = this.$route.query.content;
    this.docId = myJsTools.getItem("token_info").docId;
  },
  mounted() {
    this.getList();
  },

  methods: {
    //初始化获取列表
    getList() {
      getDocChatListReceive({
        page: 1,
        limit: 1000,
        docId: this.docId,
        patientName: this.value,
      }).then((res) => {
        this.groupList = res.data.rows;
      });
    },
    goNewsConnect() {
      this.$router.push({
        name: "newsConnect",
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
    // 点击发送
    confire() {
      console.log(JSON.stringify(this.result));
      this.show = true;
    },
    //点击查看
    look() {
      this.$router.push({
        name: "pictureLook",
      });
    },
    //点击查看头像详情
    lookHead() {
      if (this.result.length > 1) {
        this.$router.push({
          name: "lookHead",
          query: {result: this.result},
        });
      }
    },
    //点击确定
    sure() {
      let patientList = [];
      let receiverIdArray = this.result.map((item) => {
        if (this.itemType == "text") {
          this.sendMsg(item.patientId, item.userId.toLowerCase());
        } else if (this.itemType == "image") {
          this.sendImg(item.patientId, item.userId.toLowerCase());
        }
        patientList.push({patientId: item.patientId});
        return item.patientId;
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
          this.result.map((item, index) => {
            console.log(item, "item");
            this.sendScale(item.patientId, item.userId, res.data.sendId);
            if (index == this.result.length - 1) {
              this.$router.go(-1);
            }
          });
        });
      }
    },
    //点击取消
    cancel() {
      this.show = false;
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
      this.$router.go(-1);
    },
    sendScale(patientId, userId, sendId) {
      console.log(patientId, userId);
      let ext = {
        sendId: sendId,
        title: this.title,
        type: "lb",
        isFeedback: "0",
      };
      eschatUnit.sendMsg("[量表]", this.docId, patientId, userId, ext);
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

.pictureIndex {
  min-height: 100vh;
  background: @white;

  .head {
    position: relative;

    img {
      display: block;
      position: absolute;
      left: 4%;
      top: 11px;
    }
  }

  .new {
    display: flex;
    align-items: center;
    padding: 11px 4%;
    background: @white;

    img {
      margin-right: 8px;
    }

    span {
      .font-size-md;
      line-height: 22px;
    }
  }

  .list {
    background: @white;
    padding: 0 4%;
    height: calc(100vh - 223px);
    overflow-y: scroll;

    .item {
      display: flex;
      align-items: center;

      img {
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

  .bottomBtn {
    box-shadow: none;
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

.title {
  padding: 12px 16px;
}

.scaleDiv {
  .title {
    .black-font;
    .font-size-md;
    line-height: 22px;
    padding: 0;
    font-weight: 600;
  }

  .updateTime {
    .font-login-color;
    .font-size-md;
    line-height: 18px;
    margin-top: 10px;
    padding-bottom: 12px;
    border-bottom: 0.5px solid @back-border;
  }

  .total {
    .font-color-2;
    .font-size-md;
    line-height: 16px;
    margin-top: 12px;
  }
}

.patName{
  display: block!important;
  margin-left: 10px!important;
  width: 300px!important;
}
</style>
