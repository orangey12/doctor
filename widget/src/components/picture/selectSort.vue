<template>
  <div class="selectSort">
    <navbar title="选择分组"></navbar>
    <span
      class="nav font-login-color-blue"
      @click="confire"
      :style="{ top: topHeight }"
    >完成</span
    >
    <div class="header">
      <img
        src="../../assets/img/index/search.png"
        class="icon-width-height-sm"
      />
      <input
        type="text"
        placeholder="搜索联系人"
        v-model="name"
        @keyup.enter="getSeatchList"
      />
    </div>
    <van-collapse v-model="activeNames">
      <div
        class="grouoList"
        v-for="(val, keys, index) in groupList"
        :key="index"
      >
        <van-checkbox
          v-model="val.isCheckedAll"
          @click="isCheckedAll(val, keys)"
          class="checkBoxVan"
        >
        </van-checkbox>
        <van-collapse-item :name="index" style="width: 90%; margin-left: 6%">
          <template #title>
            <div class="title">
              <span>{{ val.groupName }}（已选{{ val.result.length }}）</span>
            </div>
          </template>
          <van-checkbox-group v-model="val.result">
            <div class="list" v-for="(vals, i) in val.list" :key="i">
              <van-checkbox :name="vals" @click="isCheck(val)">
                <template>
                  <div class="list_item">
                    <img v-zlazy="vals.patientImg" alt="" />
                    <span>{{ vals.patientName }}</span>
                  </div>
                </template>
              </van-checkbox>
            </div>
          </van-checkbox-group>
        </van-collapse-item>
      </div>
    </van-collapse>
    <div v-if="groupList.length == 0">
      <div class="pitera">
        <img src="@/assets/img/my/pitera.png" alt />
        <span>暂无分组消息，点击新建分组去创建</span>
      </div>
    </div>

    <!-- 提示信息（单人转发文字/图片） -->
    <van-popup v-model="shows" class="shows">
      <p class="p_title">发送给</p>
      <div class="p_box" @click="lookHead">
        <div
          style="display: flex"
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
        <img v-zlazy="content" alt="" v-if="itemType == 'image'" />
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
import { Toast } from "vant";
import myJsTools from "../../utils/myJsTools";
import {
  findPatientInfoGroupByGroup,
  doctorToPatientSendMessageToMq,
} from "@/api/pictrue";
import { getLabFromOssImgByImageUrl } from "../../api/oss";
import eschatUnit from "../../utils/eschat";
import ossUpDown from "../../utils/ossUpDown";
import { saveProFlockSend } from "../../api/scale";

export default {
  name: "selectSort",
  components: { navbar },
  data() {
    return {
      groupList: [],
      result: [],
      //是否显示弹窗(多人人转发文字/图片)
      shows: false,
      activeNames: [],
      itemType: "",
      content: "",
      topHeight: "",
      updateTime: "",
      title: "",
      total: "",
      didId: "",
      docId: "",
      name: "",
    };
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
    this.getGroupList();
    this.topHeight = parseInt(api.safeArea.top) + 1 + "px";
  },
  beforeCreate() {
    this.$store.commit("UPDATE_KEEP_ALIVE", {
      keepAlive: "selectSort",
    });
  },
  beforeRouteLeave(to, from, next) {
    if (to.name == "pictureLook" || to.name == "lookHead") {
      from.meta.keepAlive = true;
    } else {
      from.meta.keepAlive = false;
      this.$store.commit("UPDATE_KEEP_ALIVE", {
        keepAlive: "selectSort",
        type: 1,
      });
    }
    next();
  },
  methods: {
    //初始化获取分组列表
    getGroupList() {
      findPatientInfoGroupByGroup({
        docId: this.docId,
        filterNoUserIdPatient: "1",
      }).then(async (res) => {
        let data = res.data;
        let arr = [];
        data.map((item) => {
          item.list.map((val) => {
            arr.push(val);
          });
        });
        data.map((item) => {
          item.result = [];
          item.isCheckedAll = false;
          item.list.map((val, i) => {
            arr.map((ele) => {
              if (ele.patientId == val.patientId) {
                val.patientImg = ele.patientImg;
              }
            });
          });
        });
        this.groupList = res.data;
      });
    },
    //点击完成
    confire() {
      let arr = this.groupList,
        arrId = [];
      this.result = [];
      arr.forEach((element) => {
        if (element.result.length > 0) {
          element.result.forEach((item) => {
            if (arrId.indexOf(item.patientId) == -1) {
              arrId.push(item.patientId);
              this.result.push(item);
            }
          });
        }
      });
      this.result.map((item) => {
        if (item.length != 0) {
          this.shows = true;
        }
      });
    },
    //点击查看头像详情
    lookHead() {
      this.$router.push({
        name: "lookHead",
        query: { result: this.result },
      });
    },
    //点击确定
    sure() {
      let patientList = [],
        receiverIdArray = [];
      this.result.map((val) => {
        if (this.itemType == "text") {
          this.sendMsg(val.patientId, val.userId.toLowerCase());
        } else if (this.itemType == "image") {
          this.sendImg(val.patientId, val.userId.toLowerCase());
        }
        patientList.push({ patientId: val.patientId });
        receiverIdArray.push(val.patientId);
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
            this.sendScale(item.patientId, item.userId, res.data.sendId);
            if (index == this.result.length - 1) {
              this.$router.go(-3);
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
      this.$router.go(-3);
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
    //点击取消
    cancel() {
      this.show = false;
      this.shows = false;
    },
    //全选
    isCheckedAll(val, keys) {
      if (val.isCheckedAll == true) {
        val.result = [];
        val.list.forEach((item) => {
          val.result.push(item);
        });
      } else {
        val.list.forEach((item) => {
          val.result = [];
        });
      }
    },
    //是否选中
    isCheck(val) {
      if (val.result.length == val.list.length) {
        val.isCheckedAll = true;
      } else {
        val.isCheckedAll = false;
      }
    },
  },
};
</script>
<style scoped lang="less">
.img-width-height-spe {
  margin-right: 4px;
}

.header {
  width: calc(100% - 32px);
  background: @white;
  display: flex;
  align-items: center;
  padding: 11px 16px;

  input {
    line-height: 18px;
    margin-left: 9px;
    width: 80%;
  }
}

.grouoList {
  display: flex;
  position: relative;
  align-items: center;
}

.checkBoxVan {
  position: absolute;
  left: 16px;
  top: 22px;
  z-index: 2;
}

.pitera {
  width: 61%;
  margin: 0 auto;
  font-size: 14px;
  font-weight: 400;
  color: rgba(51, 51, 51, 1);
  line-height: 20px;
  text-align: center;
  padding-top: 126px;

  img {
    width: 193px;
    height: 162px;
    margin: 0 auto;
    margin-bottom: 20px;
  }
}

.selectSort {
  padding-top: 10px;
  padding-bottom: 50px;
  background: @white;
  box-sizing: border-box;

  .nav {
    position: fixed;
    top: 0;
    right: 16px;
    .font-size-sm;
    z-index: 9999;
    line-height: 44px;
  }

  /deep/ .van-cell {
    padding: 20px 16px;
    align-items: center;
  }

  .title {
    display: flex;
    align-items: center;
    .font-size-md;
    .black-font;
    line-height: 20px;

    span {
      display: block;
      margin-left: 16px;
    }
  }

  .list {
    background: @white;
    padding: 0 4%;

    &_item {
      display: flex;
      align-items: center;

      img {
        .img-width-height-sm;
        margin: 0 16px 0 6px;
        padding: 14px 0;
      }

      span {
        .black-font;
        .font-size-md;
        line-height: 20px;
      }
    }
  }
}

.shows {
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
    //position: relative;
    width: 100%;

    div {
      //width: 11.111111%;
      position: relative;

      img {
        position: absolute;
        top: 0;
        width: 100%;
        height: 100%;
      }
    }

    div::before {
      content: "";
      padding-top: 100%;
      display: block;
    }

    span {
      .font-size-md;
      .black-font;
      line-height: 20px;
    }
  }

  .p_box_2 {
    position: absolute !important;
    right: 0;
    z-index: 2;
    background: @white;
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
.patName{
  display: block!important;
  margin-left: 10px!important;
  width: 300px!important;
}
</style>
