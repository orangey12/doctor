<template>
  <div class="newScaleContent">
    <div class="contentBody">
      <div class="scaleTitle">
        <li class="title">
          <van-field
            v-model="didName"
            disabled
            placeholder="请输入量表标题"
          ></van-field>
        </li>
        <li class="welMag">
          感谢您能抽出几分钟时间来参加量表，为了方便医生了解病情，请认真作答，谢谢！
        </li>
      </div>
      <div class="topicList">
        <div class="topic" v-for="(item, index) in topicOverList" :key="index">
          <li class="title">
            {{ index + 1 }}.{{ item.didtName }}
            <span v-if="item.didtType == '1'">(单选)</span>
            <span v-if="item.didtType == '2'">(多选)</span>
          </li>
          <div class="optionInfo">
            <div v-if="item.didtType == '1' || item.didtType == '2'">
              <li v-for="(optItem, optIndex) in item.radioOpt" :key="optIndex">
                <img
                  src="../../assets/img/scale/checkShow.png"
                  class="checkIcon icon-width-height-sm-16"
                  v-if="item.didtType == '2' && !optItem.checked"
                />
                <img
                  src="../../assets/img/scale/checkShow_1.png"
                  class="checkIcon icon-width-height-sm-16"
                  v-if="item.didtType == '2' && optItem.checked"
                />
                <img
                  src="../../assets/img/scale/radioShow.png"
                  class="radioIcon icon-width-height-sm-16"
                  v-if="item.didtType == '1' && !optItem.checked"
                />
                <img
                  src="../../assets/img/scale/radioShow_1.png"
                  class="radioIcon icon-width-height-sm-16"
                  v-if="item.didtType == '1' && optItem.checked"
                />
                {{ optItem.optionName }}
              </li>
            </div>
            <div class="borderDiv" v-if="item.didtType == '3'">
              <span v-if="item.answerInfo">{{ item.answerInfo }}</span>
            </div>
            <div class="selectImg dateTime" v-if="item.didtType == '4'">
              <span v-if="!item.answerText" @click="showPicker = true"
                >请选择时间</span
              >
              <span v-else @click="showPicker = true">{{
                item.answerText
              }}</span>
              <img src="../../assets/img/scale/down.png" class="addIcon" />

              <van-popup v-model="showPicker" round position="bottom">
                <van-picker :columns="columns" />
              </van-popup>
            </div>
            <div
              class="selectImg"
              v-if="item.didtType == '5' && !item.answerInfo"
            >
              <img src="../../assets/img/scale/imgIcon.png" class="imgIcon icon-width-height-sm-16" />
              <span>选择图片（2M以内）</span>
              <img src="../../assets/img/scale/add_3.png" class="addIcon" />
            </div>
            <div
              class="selectImg"
              v-if="item.didtType == '5' && item.answerInfo"
            >
              <img
                v-zlazy="item.answerInfo"
                class="answerInfoImg"
                @click.stop="getImgView(item.answerInfo, 0)"
              />
            </div>
            <div
              class="evaluation"
              v-if="item.didtType == '6' && !item.answerInfo"
            >
              <img
                src="../../assets/img/scale/xx.png"
                class="xxIcon"
                v-for="item in 5"
              />
            </div>
            <div
              class="evaluation"
              v-if="item.didtType == '6' && item.answerInfo"
            >
              <img
                src="../../assets/img/scale/start.png"
                class="xxIcon"
                v-for="item in parseInt(item.answerInfo)"
              />
              <img
                src="../../assets/img/scale/xx.png"
                class="xxIcon"
                v-for="item in 5 - parseInt(item.answerInfo)"
              />
            </div>
            <div class="selectImg dateTime" v-if="item.didtType == '7'">
              <span v-if="!item.answerInfo">选择时间</span>
              <span v-else>{{ item.answerInfo }}</span>
              <img src="../../assets/img/scale/down.png" class="addIcon" />
            </div>
            <div class="selectImg dateTime" v-if="item.didtType == '8'">
              <span v-if="!item.answerInfo">选择日期</span>
              <span v-else>{{ item.answerInfo }}</span>
              <img src="../../assets/img/scale/down.png" class="addIcon" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="bottomBtn" v-if="isFeedback == ''">
      <button class="publicWhiteBtn" @click="openSend">发送</button>
      <button class="publicBtn twoBtn" @click="editScale">去编辑</button>
    </div>
    <div class="bottomBtn" v-if="isFeedback == '0'">
      <button class="publicBtn" @click="openSend">催填</button>
    </div>
    <img-save
      v-if="show"
      :showPic="show"
      :index="index"
      :images="images"
      @changePreview="changePreview"
      @onClose="onClose"
    ></img-save>
  </div>
</template>

<script>
import {
  getInquiringDiagnosisDetail,
  getReplyDiagnosisAnswer
} from "../../api/scale";
import ossUpDown from "../../utils/ossUpDown";
import ImgSave from "../../common/imgSave";
import myJsTools from "../../utils/myJsTools";
import eschatUnit from "../../utils/eschat";
import {findAppidAndOpenidAndUseridByPatientId} from "../../api/chat";
import {Toast} from "vant";
export default {
  name: "detailCom",
  components: { ImgSave },
  props: {
    title: String,
    didOnlyId: String,
    sendId: String,
    patientId: {
      default: "", //detail 为聊天发送
      type: String
    },
    userId:{
      default: "", //detail 为聊天发送
      type: String
    },
    isFeedback: {
      default: "", //detail 为聊天发送
      type: String
    },
    isCt:{
      default:false
    }
  },
  data() {
    return {
      show: false,
      images: [],
      index: 0,
      topicList: [],
      updateTime: "",
      didName: "",
      showPicker: false,
      columns: [],
      didId: "",
      userInfo:{},
    };
  },
  computed: {
    topicOverList() {
      return this.$store.getters.getTopicList;
    }
  },
  created() {
    this.userInfo = myJsTools.getItem("patientInfo");
    this.getScaleDetail();
    if(!this.userId){
      this.getUserId();
    }
  },
  methods: {
    //根据患者id查询患者userID
    getUserId() {
      findAppidAndOpenidAndUseridByPatientId({
        patientId: this.patientId || this.userInfo.patientId
      }).then(res => {
        this.userInfo.userId = res.data.userId
      })
    },
    changePreview(index) {
      this.index = index;
    },
    onClose() {
      this.show = false;
    },
    // 预览图片
    getImgView(item, index) {
      this.images = [item];
      this.index = index;
      this.show = true;
    },
    //发送
    openSend() {
      if(this.isCt){
        let ext = {
          sendId: this.sendId,
          title: this.title,
          type: "lb",
          isFeedback: "0",
        };
        let userInfo = this.userInfo;
        let patientId = userInfo.patientId || this.patientId;
        let userId = userInfo.userId || this.userId;
        eschatUnit.sendMsg(
          "[量表]",
          myJsTools.getItem("token_info").docId,
          patientId,
          userId,
          ext
        );
        Toast("催填成功");
        this.$router.go(-1);
      }else{
        this.$router.push({
          name: "pictureIndex",
          query: {
            itemType: "scale",
            title: this.title,
            total: this.topicOverList.length,
            updateTime: this.updateTime,
            didId: this.didId
          }
        });
      }
    },
    //编辑
    editScale() {
      this.$router.push({
        name: "newScaleContent",
        query: {
          isEdit: true,
          didId: this.didId,
          didOnlyId: this.didOnlyId,
          title: this.title
        }
      });
    },
    //编辑获取详情
    getScaleDetail() {
      let param = {};
      if (this.sendId) {
        param.sendId = this.sendId;
      } else {
        param.didOnlyId = this.didOnlyId;
      }
      if (this.isFeedback == "1") {
        param.patientId = this.patientId || this.userInfo.patientId;
        getReplyDiagnosisAnswer(param).then(async res => {
          console.log(res);
          let data = res.data;
          this.didName = data.didName;
          this.didId = data.didId;
          for (let i = 0; i < data.answerList.length; i++) {
            let ele = data.answerList[i];
            if (
              ele.didtType == "1" ||
              ele.didtType == "2" ||
              ele.didtType == "4"
            ) {
              ele.radioOpt = JSON.parse(ele.answerInfo);
              if (ele.didtType == "4") {
                for (let j = 0; j < ele.radioOpt.length; j++) {
                  let obj = ele.radioOpt[j];
                  this.columns.push(obj.optionName);
                  if (obj.checked) {
                    ele.answerText = obj.optionName;
                  }
                }
              }
            }
          }
          this.$store.commit("setAllTopic", data.answerList);
        });
      } else {
        getInquiringDiagnosisDetail(param).then(res => {
          console.log(res);
          let data = res.data;
          for (let i = 0; i < data.docQuestionListVO.length; i++) {
            let ele = data.docQuestionListVO[i];
            ele.radioOpt = JSON.parse(ele.optionInfo);
            if (ele.didtType == "4") {
              for (let j = 0; j < ele.radioOpt.length; j++) {
                let obj = ele.radioOpt[j];
                this.columns.push(obj.optionName);
              }
            }
          }
          this.didName = data.didName;
          this.didId = data.didId;
          this.updateTime = data.updateTime;
          this.$store.commit("setAllTopic", data.docQuestionListVO);
        });
      }
    }
  }
};
</script>

<style scoped lang="less">

/deep/.van-popup {
  max-height: 100vh;
}
/deep/.van-field__control:disabled {
  .black-font;
}
.newScaleContent {
  padding-top: 10px;
}
.contentBody {
  padding: 0 16px 70px;
  .scaleTitle {
    box-shadow: 0 2px 10px rgba(198, 204, 206, 0.2);
    padding: 12px;
    .black-font;
    .font-size-md;
    line-height: 22px;
    border-radius: 8px;
    margin-bottom: 8px;
    background: @white;
    li {
      .div-overflow;
    }
    .title {
      margin-bottom: 6px;
      .font-blod-2;
      /deep/.van-cell {
        padding: 0px;
      }
    }
    .welMag {
      .font-login-color;
      .font-size-sm;
      line-height: 18px;
    }
  }
}
.topic {
  background: @white;
  border-radius: 8px;
  padding: 12px;
  margin-top: 8px;
  position: relative;
  .operaDiv {
    /deep/.van-overlay {
      background-color: rgba(0, 0, 0, 0);
    }
  }

  .title {
    .black-font;
    .font-blod-2;
    .font-size-md;
    line-height: 22px;
  }
  .optionInfo {
    li {
      display: flex;
      align-items: center;
      margin-top: 18px;
      .font-login-sm;
      .font-color-2;
      line-height: 20px;
    }
    .selectImg {
      padding: 10px 12px;
      align-items: center;
      .font-login-color;
      .font-size-md;
      line-height: 22px;
      position: relative;
      border: 1px solid @back-border;
      margin-top: 12px;
      margin-bottom: 0px;
      display: flex;
      border-radius: 2px;
      .imgIcon {
        margin-right: 8px;
      }
      .addIcon {
        position: absolute;
        right: 12px;
        top: 12px;
        width: 16px;
        height: 16px;
      }
      .answerInfoImg {
        width: 100px;
        height: 100px;
      }
    }
    .evaluation {
      padding: 12px 12px 0 12px;
      display: flex;
      .xxIcon {
        width: 31px;
        height: 31px;
        margin-right: 35px;
      }
      :last-child {
        margin-right: 0;
      }
    }
  }
  .borderDiv {
    border: 1px solid @back-border;
    border-radius: 4px;
    margin-top: 12px;
    height: 82px;
    padding: 10px;
  }
  .radioIcon,.checkIcon {
    margin-right: 8px;
  }
}
</style>
