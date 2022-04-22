<template>
  <div class="appYy" id="appYy">
    <navbar title="问诊详情" type="defaultPage"></navbar>
    <div class="infoAllDiv">
      <div class="infoDiv">
        <van-steps
          v-if="stepList.length > 0"
          :active="active"
          active-color="#1686FF"
          style="margin-bottom: 5px"
        >
          <van-step
            :style="'width:' + 100 / (stepList.length - 1) + '%'"
            v-for="(item, index) in stepList"
            :key="index"
            :class="item.time ? 'van-step__title--active' : ''"
          >
            <div>{{ item.statusName }}</div>
            <div
              :style="{
                left:
                  index == stepList.length - 1
                    ? 100 - (stepList.length - 1) * 20 + '%'
                    : ''
              }"
              class="time"
            >
              <li>{{ item.time }}</li>
            </div>
          </van-step>
        </van-steps>
      <div class="failure-cause" v-if="failurecause">{{failurecause}}</div>
      </div>

      <div class="infoDiv">
        <div class="checkTopInfo black-font font-size-md-2">
          <li class="display-div">
            <u>挂号编号：{{ info.regCode }}</u>
          </li>
          <li class="hosName">医院名称：{{ info.hosName }}</li>
        </div>
        <div class="checkUserInfo">
          <div class="userInfo">
            <li>{{ info.patientName }}</li>
            <li class="sex">{{ info.sex }}</li>
            <li class="age">{{ info.age }}{{ info.ageUnit }}</li>
          </div>
          <li class="docInfoLi">医生姓名：{{ info.docName }}</li>
          <li class="docInfoLi">医生科室：{{ info.deptName }}</li>
          <li class="docInfoLi">医生号别：{{ info.dntName }}</li>
          <li class="docInfoLi">问诊类型：{{ info.diagTreatTypeName }}</li>
          <li class="docInfoLi" v-if="info.isAppoint == '1'">
            预约时间：{{ info.appointTime }}
          </li>
        </div>
      </div>
      <div class="infoDiv" v-if="info.internetVisit == '1'">
        <li class="titleTips">
          <u>
            <span class="line"></span>
            <span>病情描述</span>
          </u>
        </li>
        <van-field
          v-model="info.recordsTitle"
          label="标题"
          readonly
          placeholder="未填写标题"
        />
        <van-field
          v-model="info.diagnosisDisease"
          label="确诊疾病"
          readonly
          placeholder="未填写确诊疾病"
        />
        <van-field
          v-model="info.sickTime"
          label="患病时长"
          readonly
          placeholder="未填写患病时长"
        />
        <van-field
          autosize
          row="2"
          type="textarea"
          v-model="info.diseaseDescription"
          label="病情描述"
          readonly
          placeholder="未填写病情描述"
        />
        <van-field
          autosize
          row="2"
          type="textarea"
          v-model="info.expectHelp"
          label="期望帮助"
          readonly
          placeholder="未填写期望获得的帮助"
        />
        <li class="title">
          病情照片
          <span class="tips">（仅限本人和接诊医生可看）</span>
        </li>
        <div
          class="condition"
          v-if="info.diseaseImgList && info.diseaseImgList.length > 0"
        >
          <img
            v-zlazy="item"
            class="medicImg"
            v-for="(item, index) in info.diseaseImgList"
            :key="index"
            @click.stop="getImgView(info.diseaseImgList, index)"
          />
        </div>
        <div class="condition helpDiv" v-else>
          <span style="color:#E5E5E5;">暂未上传图片</span>
        </div>
        <li class="title">
          其它照片
          <span class="tips">（仅限本人和接诊医生可看）</span>
        </li>
        <div
          class="condition"
          v-if="info.medicalImgList && info.medicalImgList.length > 0"
        >
          <img
            v-zlazy="item"
            class="medicImg"
            v-for="(item, index) in info.medicalImgList"
            :key="index"
            @click.stop="getImgView(info.medicalImgList, index)"
          />
        </div>
        <div class="condition helpDiv" v-else>
          <span style="color:#E5E5E5;">暂未上传图片</span>
        </div>
      </div>
      <div class="infoDiv liBottomDiv">
        <li
          class="flex-arrow-right"
          @click="openPresc"
          v-if="btnStatus.isPre == '1'"
        >
          <u class="spanHistory">
            <span>本次处方</span>
          </u>
          <u>
            <img src="../../assets/img/index/right.png" class="rightArrow" />
          </u>
        </li>
        <li class="flex-arrow-right" @click="openScale" v-if="scaleShow == '1'">
          <u class="spanHistory">
            <span>量表</span>
          </u>
          <u>
            <img src="../../assets/img/index/right.png" class="rightArrow" />
          </u>
        </li>
        <li
          class="flex-arrow-right"
          @click="getPlmIdArr"
          v-if="btnStatus.isLab == '1'"
        >
          <u class="spanHistory">
            <span>本次送验</span>
          </u>
          <u>
            <img src="../../assets/img/index/right.png" class="rightArrow" />
          </u>
        </li>
        <li
          class="flex-arrow-right"
          @click="openCheckList"
          v-if="btnStatus.isPacs == '1'"
        >
          <u class="spanHistory">
            <span>本次检查单</span>
          </u>
          <u>
            <img src="../../assets/img/index/right.png" class="rightArrow" />
          </u>
        </li>
        <li
          class="flex-arrow-right"
          @click="openLisList"
          v-if="btnStatus.isLis == '1'"
        >
          <u class="spanHistory">
            <span>本次检验单</span>
          </u>
          <u>
            <img src="../../assets/img/index/right.png" class="rightArrow" />
          </u>
        </li>
        <li
          class="flex-arrow-right"
          @click="openInfoMa"
          v-if="pageType != 'information'"
        >
          <u class="spanHistory">
            <span>问诊历史</span>
          </u>
          <u>
            <img src="../../assets/img/index/right.png" class="rightArrow" />
          </u>
        </li>
        <li
          class="flex-arrow-right"
          @click="openElectronicRecord"
          v-if="info.status >= 2"
        >
          <u class="spanHistory">
            <span>电子病历</span>
          </u>
          <u>
            <img src="../../assets/img/index/right.png" class="rightArrow" />
          </u>
        </li>
      </div>
      <div
        class="heightDiv"
        style="height: 80px;"
        v-if="
          (info.status == 2 && info.docId == userDocId) ||
            (pageType != 'chat' &&
              pageType != 'pre' &&
              info.status == 3 &&
              info.docId == userDocId)
        "
      ></div>
      <div class="bottomBtn" v-if="info.status == 2 && info.docId == userDocId">
        <button class="publicWhiteBtn" @click="refundAppoi(0)">不接此诊</button>
        <button class="publicBtn twoBtn" @click="jzCommit">接诊</button>
      </div>
      <div
        class="bottomBtn"
        v-if="
          pageType != 'chat' &&
            pageType != 'pre' &&
            info.status == 3 &&
            info.docId == userDocId
        "
      >
        <button class="publicWhiteBtn" @click="showEndWz = true">
          结束问诊
        </button>
        <button class="publicBtn twoBtn" @click="refundAppoi(4)">退诊</button>
        <button class="publicBtn twoBtn" @click="goChatPage">去沟通</button>
      </div>
    </div>
    <van-popup v-model="showRetreatRe" class="popup">
      <div class="tipsInfo">
        <li class="title">{{ reasonTitle }}</li>
        <van-radio-group
          v-model="retreatResult"
          icon-size="18"
          @change="changeResult"
        >
          <van-radio
            :name="item.optionCode"
            v-for="(item, index) in retreatList"
            :key="index"
            class="raiodList"
            >{{ item.optionName }}
          </van-radio>
          <van-radio name="qt" class="raiodList">其他原因</van-radio>
          <van-field
            v-model="resultMessage"
            rows="2"
            autosize
            type="textarea"
            placeholder="请输入原因"
            maxlength="50"
            show-word-limit
          />
        </van-radio-group>
        <div class="btns">
          <button class="publicWhiteBtn" @click="showRetreatRe = false">
            取消
          </button>
          <button class="publicBtn " @click="refundInquiry">确定</button>
        </div>
      </div>
    </van-popup>
    <van-popup v-model="showEndWz" class="popup">
      <li class="title">结束问诊</li>
      <div class="tips">
        <li>问诊结束前，请确认是否已经给患者</li>
        <li>开具诊断处方或者咨询小结</li>
      </div>
      <div class="btns">
        <button class="publicWhiteBtn" @click="showEndWz = false">取消</button>
        <button class="publicBtn " @click="endInquiry">确定</button>
      </div>
    </van-popup>
    <img-save
      v-if="showPic"
      :showPic="showPic"
      :index="index"
      :images="images"
      @changePreview="changePreview"
      @onClose="onClose"
    ></img-save>
  </div>
</template>

<script>
import navbar from "@/common/navbar";
import $api from "@/utils/api.js";
import {
  getPatientRecords,
  saveProReceive,
  getSysOptionConfig,
  updateReturnReceive,
  updateEndReceive,
  updateRegisterRefuseCause,
  getPatientIsBindingUser
} from "../../api/docList";
import { Toast, Dialog, ImagePreview } from "vant";
import myJsTools from "@/utils/myJsTools";
import imgSave from "@/common/imgSave";
import {
  getInquiryDetail,
  getIsInquiring,
  getLabInfo,
  getRegisterInquiryInfo
} from "../../api/chat";
import avatar from "@/assets/img/my/default.png";
import { getIsPre, getPlmId } from "../../api/cf";

export default {
  components: {
    navbar,
    [ImagePreview.Component.name]: ImagePreview.Component,
    imgSave
  },
  data() {
    return {
      active: 0,
      info: {},
      regId: "",
      showRetreatRe: false, //选择退诊原因
      retreatResult: [],
      retreatList: [],
      resultMessage: "", //退诊替他原因
      showRefundMessage: false,
      reasonTitle: "退诊原因",
      showPic: false,
      images: [],
      index: 0,
      show: false,
      showMzyy: false, //医生是否给患者发送过门诊预约
      userDocId: "", //当前登录用户id
      showEndWz: false,
      btnStatus: {},
      lisUserInfo: {},
      pageType: "", //跳转页面类型 pre 处方  chat 聊天  information 入口进入的不显示问诊历史
      hosId: "", //修改token医院id
      scaleShow: "", //是否有量表 1有 0无
      stepList: [],
      failurecause:'' //失效原因
    };
  },
  beforeCreate() {
    if (this.$route.query.hosId) {
      myJsTools.setItem("hosId", this.$route.query.hosId);
    } else {
      myJsTools.setItem("hosId", "");
    }
  },
  created() {
    this.regId = this.$route.query.regId;
    this.pageType = this.$route.query.pageType || "";
    if (this.regId) {
      this.getBtnStatus();
      this.getIsScale();
    }
    this.userDocId = myJsTools.getItem("token_info").docId;
    this.getDetail();
  },
  mounted() {},
  methods: {
    //电子病历
    openElectronicRecord() {
      this.$router.push({
        name: "electronicRecord",
        query: {
          regId: this.info.regId,
          patientId: this.info.patientId,
          patientName: this.info.patientName
        }
      });
    },
    //获取接诊状态下四个li是否显示 处方 检验单等
    getBtnStatus() {
      getIsPre({
        regId: this.regId,
        useType: "1"
      }).then(res => {
        this.btnStatus = Object.assign({}, res.data);
      });
    },
    //是否发送过量表
    getIsScale() {
      getIsInquiring({
        regId: this.regId
      }).then(res => {
        if (res.data && res.data.isInquiring) {
          this.scaleShow = res.data.isInquiring;
        }
      });
    },
    //打开量表记录
    openScale() {
      this.$router.push({
        name: "patientScaleApp",
        query: {
          pageType: "appYy",
          regId: this.regId,
          patientId: this.info.patientId
        }
      });
    },
    getUserInfo() {
      getLabInfo({
        docId: this.userDocId,
        patientId: this.info.patientId
      }).then(res => {
        console.log(res);
        let patientInfo = res.data.labPatientVO;
        let docInfo = res.data.labdocVO;
        this.lisUserInfo = {
          age: patientInfo.age,
          ageUnit: patientInfo.ageUnit,
          birthDate: patientInfo.birthDate,
          idNo: patientInfo.idNo,
          patientName: patientInfo.patientName,
          sex: patientInfo.sex,
          sexCode: patientInfo.sexCode,
          telNo: patientInfo.telNo,
          hosName: docInfo.hosName,
          docIdNo: docInfo.idNo,
          docName: docInfo.docName,
          docTelNo: docInfo.telNo,
          deptName: docInfo.defaultDeptName
        };
      });
    },
    // 查询本次挂号的检验单ID
    getPlmIdArr() {
      getPlmId({
        regId: this.regId
      }).then(res => {
        console.log(JSON.stringify(res) + "检验单列表Id-----------------");
        api.openFrame({
          name: "plmList",
          url:
            myJsTools.getItem("pageUrl") + "cloud/lisHos/index.html#/plmList",
          pageParam: {
            plmIds: res.data,
            lisUserInfo: this.lisUserInfo
          },
          rect: {
            x: 0,
            y: api.safeArea.top,
            w: "auto",
            h: "auto"
          }
        });
      });
    },
    //本次检查单
    openCheckList() {
      this.$router.push({
        name: "thisCheckList",
        query: {
          regId: this.regId
        }
      });
    },
    //本次检验单
    openLisList() {
      this.$router.push({
        name: "thisLis",
        query: {
          regId: this.regId
        }
      });
    },
    // 打开咨询小结
    openSummary() {
      this.showEndWz = false;
      this.$router.push({
        name: "consultationSummary",
        query: {
          regId: this.info.regId,
          userId: this.info.userId,
          id: this.info.patientId,
          type: 2
        }
      });
    },
    // 预览图片
    getImgView(item, index) {
      this.images = item;
      this.index = index;
      this.showPic = true;
    },
    changePreview(index) {
      this.index = index;
    },
    onClose() {
      this.showPic = false;
    },
    // 去沟通跳转聊天界面
    goChatPage() {
      this.$router.push({
        name: "chatIndex",
        query: {
          name: this.info.patientName,
          id: this.info.patientId,
          userId: this.info.userId
        }
      });
    },
    // 退诊传4，拒诊传0
    refundAppoi(type) {
      // 获取退诊原因列表
      getSysOptionConfig({ optionType: type }).then(res => {
        console.log(res, "原因列表");
        this.retreatList = res.data;
        this.retreatResult = res.data[0].optionCode;
        this.backCause = res.data[0].optionName;
        this.showRetreatRe = true;
        if (type == 4) {
          this.reasonTitle = "退诊原因";
        } else {
          this.reasonTitle = "拒诊原因";
        }
      });
    },
    // 结束问诊接口
    endInquiry() {
      updateEndReceive({
        receiveStatus: 3,
        regId: this.regId,
        patientId: this.info.patientId
      }).then(res => {
        console.log(res, "结束问诊接口返回结果");
        this.$router.go(-1);
      });
    },
    // 退诊
    refundInquiry(type) {
      if (this.reasonTitle == "退诊原因") {
        var backCause = "",
          backCauseCode;
        if (this.retreatResult == "qt") {
          if (!this.resultMessage) {
            Toast("请填写退诊原因");
            return;
          }
          backCause = this.resultMessage;
          backCauseCode = "";
        } else {
          backCause = this.backCause;
          backCauseCode = this.retreatResult;
        }
        var param = {
          backCause: backCause,
          backCauseCode: backCauseCode,
          backUserId: this.userDocId,
          backUserName: this.info.docName,
          receiveStatus: 2,
          regId: this.regId,
          patientId: this.info.patientId
        };
        updateReturnReceive(param).then(res => {
          console.log(res, "退诊");
          this.$router.go(-1);
        });
      } else {
        var refuseCause = "",
          refuseCauseCode;
        if (this.retreatResult == "qt") {
          if (!this.resultMessage) {
            Toast("请填写拒诊原因");
            return;
          }
          refuseCause = this.resultMessage;
          refuseCauseCode = "";
        } else {
          refuseCause = this.backCause;
          refuseCauseCode = this.retreatResult;
        }
        var param = {
          refuseCause: refuseCause,
          refuseCauseCode: refuseCauseCode,
          regId: this.regId,
          patientId: this.info.patientId
        };
        updateRegisterRefuseCause(param).then(res => {
          console.log(res, "拒诊");
          this.$router.go(-1);
        });
      }
    },
    // 退诊原因选择
    changeResult(name) {
      console.log(name);
      if (name == "qt") {
        this.showRefundMessage = true;
      } else {
        this.showRefundMessage = false;
        for (let m = 0; m < this.retreatList.length; m++) {
          const element = this.retreatList[m];
          if (element.optionCode == name) {
            this.backCause = element.optionName;
          }
        }
      }
    },
    // 资料服务页面
    openInfoMa() {
      if (this.$store.getters.getHistoryUrl == "information") {
        this.$router.go(-1);
      } else {
        this.$router.push({
          name: "information",
          query: {
            patientId: this.info.patientId,
            docId: this.userDocId,
            pageType: "doc"
          }
        });
      }
    },
    // 本次处方页面
    openPresc() {
      this.$router.push({
        name: "thisPrescription",
        query: {
          regId: this.regId,
          recordsTitle: this.info.recordsTitle,
          inquiryTime: this.info.inquiryTime,
          deptName: this.info.deptName
        }
      });
    },
    // 接诊接口
    jzCommit() {
      var param = {
        deptId: this.info.deptId, //科室ID
        deptName: this.info.deptName, //科室名称
        docId: this.info.docId, //医生id
        docName: myJsTools.getItem("token_info").docName, // 医生姓名
        isSubsequent: this.info.isSubsequent, // 是否复诊
        patientId: this.info.patientId, //    患者id
        patientName: this.info.patientName, //  患者姓名
        receiveType: this.info.visitTypeCode, //   问诊类型 1图文问诊  2微信语音 3电话  4视频
        regId: this.$route.query.regId, // 挂号id
        regCode: this.info.regCode
      };
      getPatientIsBindingUser({
        patientId: this.info.patientId
      }).then(res => {
        if (res.data && res.data.userId) {
          saveProReceive(param).then(res => {
            Toast(res.message);
            setTimeout(() => {
              this.$router.replace({
                name: "chatIndex",
                query: {
                  name: this.info.patientName,
                  id: this.info.patientId,
                  userId: this.info.userId
                }
              });
            });
          });
        } else {
          Toast("该患者暂未在线上互联网医院进行信息登记，暂无法进行线上问诊");
        }
      });
    },
    // 获取问诊详情
    getDetail() {
      let me = this;
      getRegisterInquiryInfo({ regId: this.regId }).then(async res => {
        if (res.data) {
          var data = res.data;
          //失效备注 failurecause
          if(data.timeOutRemark){
            this.failurecause=data.timeOutRemark
          }
          // 其他照片
          if (data.medicalImg) {
            if (data.medicalImg.indexOf("[") != -1) {
              data.medicalImgList = JSON.parse(data.medicalImg);
            } else {
              data.medicalImgList = data.medicalImg.split(";");
            }
          }
          // 病情照片
          if (data.diseaseImg) {
            if (data.diseaseImg.indexOf("[") != -1) {
              data.diseaseImgList = JSON.parse(data.diseaseImg);
            } else {
              data.diseaseImgList = data.diseaseImg.split(";");
            }
          }
          this.info = Object.assign({}, data);
          let status = data.status;
          if (status == 5) {
            this.active = 1;
            this.stepList = [
              { statusName: "待接诊", time: data.signTime },
              { statusName: "已退费", time: data.returnTime }
            ];
          } else if (status == 6) {
            this.active = 1;
            this.stepList = [
              { statusName: "待接诊", time: data.signTime },
              { statusName: "已失效", time: data.invalidTime }
            ];
          }
          if (data.isAppoint == "0") {
            if (status == "2") {
              this.active = 0;
            } else if (status == "3") {
              this.active = 1;
            } else if (status == "4") {
              this.active = 2;
            }
            if (status < 5) {
              this.stepList = [
                { statusName: "待接诊", time: data.signTime },
                {
                  statusName: "接诊中",
                  time: data.receiveTime
                },
                { statusName: "已结束", time: data.endTime }
              ];
            }
          } else {
            if (status == "1") {
              this.active = 0;
            } else if (status == "2") {
              this.active = 1;
            } else if (status == "3") {
              this.active = 2;
            } else if (status == "4") {
              this.active = 3;
            }
            if (status < 5) {
              this.stepList = [
                { statusName: "待签到", time: data.addTime },
                { statusName: "待接诊", time: data.signTime },
                {
                  statusName: "接诊中",
                  time: data.receiveTime
                },
                { statusName: "已结束", time: data.endTime }
              ];
            }
          }
          console.log(JSON.stringify(res) + " ------------问诊详情");
        }
        this.getUserInfo();
      });
    },
    toggle(index) {
      this.$refs.checkboxes[index].toggle();
    }
  }
};
</script>

<style lang="less" scoped>
.title {
  padding: 19px 0 10px 0;
  font-size: 14px;

  .tips {
    .font-login-color;
    margin-left: 8px;
  }
}

/deep/ .van-field__label {
  span {
    font-size: 14px;
  }
}

.flex-arrow-right {
  padding: 12px 0;
  font-size: 14px;
  border-bottom: 1px solid @back-border;
}

.flex-arrow-right:last-child {
  border: none;
}

.liBottomDiv {
  padding: 0 16px !important;
}

.condition {
  padding: 12px 16px;
  border: 1px solid #e5e5e5;
  display: flex;
  border-radius: 8px;
  flex-wrap: wrap;
  font-size: 14px;

  span {
    display: inline-block;
    padding-bottom: 8px;
  }

  .medicImg {
    width: 30%;
    height: 100px;
    margin-bottom: 8px;
  }

  :nth-child(2),
  :nth-child(5),
  :nth-child(8) {
    margin: 0 9px;
  }
}

.infoDiv,
.topDiv {
  position: relative;
  padding: 12px 0;
  background: #ffffff;
  color: #333333;
}

.time {
  position: absolute;
  bottom: -50px;
  width: 70px;
  left: -10px;
  text-align: center;
  font-size: 10px !important;
}

.laseTime {
  left: 80%;
}

.infoDiv {
  margin: 12px 12px 0px;
  padding: 12px;
  border-radius: 8px;
}

/deep/ .van-step--horizontal:last-child {
  text-align: right;
}

.checkUserInfo {
  .docInfoLi {
    margin-top: 8px;
    .font-color-2;
    .font-size-md;
    line-height: 20px;
  }
}

.userInfo {
  display: flex;
  padding-top: 12px;
  font-weight: 500;
  .black-font;
  .font-size-md-2;
  text-align: left;

  li {
    flex: 1;
  }

  .sex {
    text-align: center;
  }

  .age {
    text-align: right;
  }
}

/deep/ .van-cell {
  padding: 12px 0px;
}

/deep/ ::placeholder {
  color: #333;
  font-size: 14px;
  font-weight: 400;
}

/deep/ .van-steps--horizontal .van-steps__items {
  padding-bottom: 45px;

  .van-step--horizontal .van-step__circle-container {
    left: 0px;
  }

  .van-step--horizontal:last-child .van-step__circle-container {
    right: 5px;
    left: auto;
  }
}

/deep/ .van-step {
  flex: none;
}

/deep/ .van-step--horizontal .van-step__title {
  font-size: 14px;
}

.checkTopInfo {
  padding-bottom: 12px;
  font-weight: 500;
  line-height: 21px;
  border-bottom: 1px dashed @back-border;
}

.hosName {
  margin-top: 8px;
}

/deep/ .van-step__title--active {
  color: rgb(22, 134, 255);
}
.failure-cause{
  color: #D71212;
  border-top: 0.026667rem dashed #EBEBEB;
  padding-top: 10px;
  font-weight: 500;
  line-height: 21px;
  font-size: 12px;
}
</style>
