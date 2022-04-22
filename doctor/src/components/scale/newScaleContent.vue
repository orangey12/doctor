<template>
  <div class="newScaleContent">
    <navbar :title="isEdit ? '编辑量表' : '新建量表'"></navbar>
    <div class="contentBody" @click="pressIndex = -1">
      <div class="scaleTitle">
        <li class="title div-overflow">
          <van-field v-model="title" placeholder="请输入量表标题"></van-field>
        </li>
        <li class="welMag div-overflow">
          感谢您能抽出几分钟时间来参加量表，为了方便医生了解病情，请认真作答，谢谢！
        </li>
      </div>
      <div
        class="addTopicBtn"
        @click="show = true"
        v-if="topicOverList.length == 0"
      >
        <img src="../../assets/img/scale/add.png" class="addIcon" />
        <span>添加题目</span>
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
                  class="checkIcon"
                  v-if="item.didtType == '2'"
                />
                <img
                  src="../../assets/img/scale/radioShow.png"
                  class="radioIcon"
                  v-if="item.didtType == '1'"
                />
                {{ optItem.optionName }}
              </li>
            </div>
            <div class="borderDiv" v-if="item.didtType == '3'"></div>
            <div class="selectImg dateTime" v-if="item.didtType == '4'">
              <span>请选择时间</span>
              <img src="../../assets/img/scale/down.png" class="addIcon" />
            </div>
            <div class="selectImg" v-if="item.didtType == '5'">
              <img src="../../assets/img/follow/img.png" class="imgIcon" />
              <span>选择图片（2M以内）</span>
              <img src="../../assets/img/scale/down.png" class="addIcon" />
            </div>
            <div class="evaluation" v-if="item.didtType == '6'">
              <img
                src="../../assets/img/scale/xx.png"
                class="xxIcon"
                v-for="item in 5"
              />
            </div>
            <div class="selectImg dateTime" v-if="item.didtType == '7'">
              <span>选择时间</span>
              <img src="../../assets/img/scale/down.png" class="addIcon" />
            </div>
            <div class="selectImg dateTime" v-if="item.didtType == '8'">
              <span>选择日期</span>
              <img src="../../assets/img/scale/down.png" class="addIcon" />
            </div>
          </div>

          <li class="opreat">
            <u @click="editTopic(item, index)">编辑</u>
            <u @click.stop="openSetting(item, index)"
              >设置
              <img
                src="../../assets/img/scale/topicMore.png"
                class="topicMore"
              />
            </u>
          </li>

          <div v-show="index == pressIndex" class="operaDiv">
            <van-popup
              v-model="showOprea"
              position="right"
              class="scalePopup"
              :overlay="false"
              round
            >
              <li @click="copyItem(item, index, 'copy')">
                <img src="../../assets/img/scale/edit.png" class="editIcon" />
                <span>复制</span>
              </li>
              <li @click="copyItem(item, index, 'up')">
                <img src="../../assets/img/scale/up.png" class="editIcon" />
                <span>上移</span>
              </li>
              <li @click="copyItem(item, index, 'down')">
                <img src="../../assets/img/scale/down_1.png" class="editIcon" />
                <span>下移</span>
              </li>
              <li @click.stop="delShow = true">
                <img
                  src="../../assets/img/scale/delete.png"
                  class="deleteIcon"
                />
                <span>删除</span>
              </li>
            </van-popup>
            <van-popup
              class="popup"
              round
              v-model="delShow"
              :overlay-style="{ background: 'rgba(0, 0, 0, 0.6)' }"
            >
              <li class="title">确认删除</li>
              <li class="tips">
                是否确认删除该题目
              </li>
              <div class="btns">
                <button class="publicWhiteBtn" @click="delShow = false">取消</button>
                <button class="publicBtn twoBtn" @click="copyItem(item, index, 'del')">确定</button>
              </div>
            </van-popup>
          </div>
        </div>
      </div>
    </div>
    <div class="bottomBtn">
      <div class="addBtn" @click="show = true">
        <img src="../../assets/img/scale/add.png" class="addIcon" />
        <li>新增</li>
      </div>
      <div class="saveBtn" @click="commitTop">
        <img src="../../assets/img/scale/save.png" class="saveIcon" />
        <li>保存</li>
      </div>
    </div>
    <van-popup v-model="show" class="topicPopup" position="bottom">
      <li class="title">
        <img src="../../assets/img/scale/back.png" class="backIcon" />
        <div>新增题型</div>
      </li>
      <div class="topicLi">
        <div
          v-for="(item, index) in topicList"
          :key="index"
          @click="openTopic(item)"
        >
          <img
            src="../../assets/img/scale/radio.png"
            class="icon-width-height-sm-24"
            v-if="item.code == '1'"
          />
          <img
            src="../../assets/img/scale/check.png"
            class="icon-width-height-sm-24"
            v-if="item.code == '2'"
          />
          <img
            src="../../assets/img/scale/tk.png"
            class="icon-width-height-sm-24"
            v-if="item.code == '3'"
          />
          <img
            src="../../assets/img/scale/select.png"
            class="icon-width-height-sm-24"
            v-if="item.code == '4'"
          />
          <img
            src="../../assets/img/scale/img.png"
            class="icon-width-height-sm-24"
            v-if="item.code == '5'"
          />
          <img
            src="../../assets/img/scale/pj.png"
            class="icon-width-height-sm-24"
            v-if="item.code == '6'"
          />
          <img
            src="../../assets/img/scale/time.png"
            class="icon-width-height-sm-24"
            v-if="item.code == '7'"
          />
          <img
            src="../../assets/img/scale/date.png"
            class="icon-width-height-sm-24"
            v-if="item.code == '8'"
          />
          <li>{{ item.meaning }}</li>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import Navbar from "../../common/navbar";
import { Toast } from "vant";
import {
  getInquiringDiagnosisDetail,
  getSysCodeByType,
  saveInquiringDiagnosis,
  updateInquiringDiagnosis
} from "../../api/scale";
import myJsTools from "../../utils/myJsTools";
export default {
  name: "newScaleContent",
  components: { Navbar },
  data() {
    return {
      title: "",
      show: false,
      showOprea: true, //操作设置显示
      pressIndex: -1,
      delShow: false, //删除框显示
      topicList: [],
      didId: "",
      isEdit: false,
      isTemplate: false,
      didOnlyId: ""
    };
  },
  computed: {
    topicOverList() {
      return this.$store.getters.getTopicList;
    }
  },
  beforeCreate() {
    this.$store.commit("UPDATE_KEEP_ALIVE", {
      keepAlive: "newScaleContent"
    });
  },
  created() {
    this.title = this.$route.query.title;
    this.isEdit = this.$route.query.isEdit;
    this.isTemplate = this.$route.query.isTemplate;
    if (this.isEdit) {
      this.didId = this.$route.query.didId;
      this.didOnlyId = this.$route.query.didOnlyId;
      this.getScaleDetail();
    }
    this.getTopType();
  },
  methods: {
    //获取题目类型
    getTopType() {
      getSysCodeByType({
        codeType: "003"
      }).then(res => {
        this.topicList = res.data;
      });
    },
    //编辑获取详情
    getScaleDetail() {
      getInquiringDiagnosisDetail({
        didOnlyId: this.didOnlyId
      }).then(res => {
        console.log(res);
        let data = res.data;
        for (let i = 0; i < data.docQuestionListVO.length; i++) {
          let ele = data.docQuestionListVO[i];
          ele.radioOpt = JSON.parse(ele.optionInfo);
        }
        this.$store.commit("setAllTopic", data.docQuestionListVO);
      });
    },
    // 打开新增题目
    openTopic(item) {
      this.show = false;
      let times = setTimeout(() => {
        clearTimeout(times);
        this.$router.push({
          name: "topic",
          query: {
            didtType: item.code,
            isEdit: false
          }
        });
      }, 100);
    },
    //编辑题目
    editTopic(item, index) {
      console.log(index);
      this.$router.push({
        name: "topic",
        query: {
          item: item,
          isEdit: true,
          index: index
        }
      });
    },
    //  保存数据
    commitTop() {
      if (!this.title) {
        Toast("请输入量表标题");
        return;
      }
      if(this.topicOverList.length == 0){
        Toast("请添加至少一道题目");
        return;
      }
      let arr = [];
      console.log(this.topicOverList);
      for (let i = 0; i < this.topicOverList.length; i++) {
        let el = this.topicOverList[i];
        if (el.radioOpt && el.radioOpt.length > 0) {
          el.optionInfo = JSON.stringify(el.radioOpt);
        }
        el.didtCode = i + 1;
        if (this.isTemplate) {
          delete el.didtId;
          delete el.didId;
        }
        arr.push(el);
      }
      let param = {
        didName: this.title,
        docId: myJsTools.getItem("token_info").docId,
        docName: myJsTools.getItem("token_info").docName,
        docQuestionListVO: arr
      };
      if (!this.isEdit || (this.isEdit && this.isTemplate)) {
        saveInquiringDiagnosis(param).then(res => {
          this.$store.commit("UPDATE_KEEP_ALIVE", {
            keepAlive: "newScaleContent",
            type: 1
          });
          this.$store.commit("setAllTopic", []);
          if (this.isEdit && !this.isTemplate) {
            this.$router.go(-1);
          } else {
            this.$router.go(-2);
          }
        });
      } else {
        param.didId = this.didId;
        param.didOnlyId = this.didOnlyId;
        updateInquiringDiagnosis(param).then(res => {
          this.$store.commit("UPDATE_KEEP_ALIVE", {
            keepAlive: "newScaleContent",
            type: 1
          });
          this.$router.go(-1);
          this.$store.commit("setAllTopic", []);
        });
      }
    },
    //设置按钮点击
    openSetting(item, index) {
      this.showOprea = true;
      this.pressIndex = index;
    },
    //  复制节点
    copyItem(item, index, type) {
      let arr = this.topicOverList;
      console.log(item, index, type);
      this.pressIndex = -1;
      if (type == "del") {
        this.delShow = false;
        arr.splice(index, 1);
      } else if (type == "copy") {
        arr.splice(index, 0, item);
      } else if (type == "up") {
        if (index == 0) {
          Toast("已经是第一个了");
          return;
        }
        arr[index] = arr.splice(index - 1, 1, arr[index])[0];
      } else if (type == "down") {
        if (index == arr.length - 1) {
          Toast("已经是最后一个了");
          return;
        }
        arr[index] = arr.splice(index + 1, 1, arr[index])[0];
      }
      this.$store.commit("setAllTopic", arr);
    }
  }
};
</script>

<style scoped lang="less">

/deep/.van-popup {
  max-height: 100vh;
}

.scalePopup {
  box-sizing: border-box;
  width: 82px;
  padding: 0 9px;
  background: @white;
  right: 20px;
  text-align: center;
  border-radius: 8px;
  position: absolute;
  top: 95%;
  border: 0.5px solid @back-border;
  transform: none;
  li {
    align-items: center;
    padding: 12px 0;
    display: flex;
    img {
      .icon-width-height-sm;
      margin-right: 12px;
    }
  }
  .line {
    height: 0.5px;
    background: @back-border;
    width: 100%;
    padding: 0;
  }
}
.contentBody {
  overflow: scroll;
  padding: 12px 16px 70px;
  height: calc(100vh - 144px);
  .scaleTitle {
    box-shadow: 0 2px 10px rgba(198, 204, 206, 0.2);
    padding: 12px;
    .black-font;
    .font-size-md;
    line-height: 22px;
    border-radius: 8px;
    margin-bottom: 8px;
    background: @white;
    .title {
      .font-blod-2;
      margin-bottom: 6px;
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
  .addTopicBtn {
    background: @white;
    .font-login-color;
    .font-size-lg-2;
    line-height: 25px;
    padding: 26px 0;
    margin: 0 auto;
    text-align: center;
    border-radius: 4px;
    display: flex;
    justify-content: center;
    align-items: center;
    img {
      .icon-width-height-sm;
      margin-right: 9px;
    }
  }
}
.bottomBtn {
  position: fixed;
  bottom: 0px;
  width: 100%;
  background: @white;
  .font-login-color-blue;
  .font-size-sm;
  line-height: 16px;
  padding: 6px 52px;
  display: flex;
  box-sizing: border-box;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  div {
    text-align: center;
  }
  img {
    .icon-width-height-sm;
    margin: 0 auto 4px;
  }
  .saveBtn {
    margin-left: 80%;
  }
}
.topicPopup {
  .title {
    padding: 15px;
    align-items: center;
    display: flex;
    div {
      .black-font;
      .font-size-lg-2;
      .font-blod-2;
      line-height: 30px;
      text-align: center;
      width: 90%;
    }
    img {
      .icon-width-height-sm-24;
    }
  }
  .topicLi {
    width: 91%;
    display: flex;
    flex-wrap: wrap;
    margin: 16px;
    border-top: 0.5px solid @back-border;
    border-right: 0.5px solid @back-border;
    li {
      .font-color-2;
      .font-size-sm;
      line-height: 17px;
      margin-top: 16px;
    }
    div {
      width: 24.6%;
      border-left: 0.5px solid @back-border;
      border-bottom: 0.5px solid @back-border;
      text-align: center;
      padding-bottom: 8px;
      img {
        display: inline-block;
        margin-top: 21px;
      }
    }
  }
}
.topic {
  background: @white;
  border-radius: 8px;
  padding: 12px;
  margin-top: 8px;
  position: relative;

  .title {
    line-height: 22px;
    .black-font;
    .font-size-md;
    .font-blod-2;
  }
  .optionInfo {
    padding-bottom: 14px;
    border-bottom: 1px solid @back-border;
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
      margin: 12px 12px 0px;
      display: flex;
      border-radius: 2px;
      .imgIcon {
        .icon-width-height-sm-16;
        margin-right: 8px;
      }
      .addIcon {
        position: absolute;
        right: 12px;
        top: 12px;
        .icon-width-height-sm-16;
      }
    }
    .evaluation {
      padding: 12px 12px 0 12px;
      display: flex;
      .xxIcon {
        .img-width-height-spe;
        margin-right: 35px;
      }
      :last-child {
        margin-right: 0;
      }
    }
  }
  .borderDiv {
    border: 1px solid @back-border;
    border-radius: 1px;
    margin: 12px 12px 0 12px;
    width: 90%;
    height: 82px;
  }
  .radioIcon {
    .icon-width-height-sm-16;
    margin-right: 8px;
  }
  .checkIcon {
    .icon-width-height-sm-16;
    margin-right: 8px;
  }
  .opreat {
    justify-content: space-between;
    .font-size-sm;
    .font-login-color-blue;
    line-height: 17px;
    display: flex;
    padding-top: 13px;
    :nth-child(2) {
      display: flex;
      align-items: center;
      width: 17%;
    }
    .topicMore {
      .icon-width-height-sm-16;
      margin-left: 8px;
    }
  }
}
</style>
