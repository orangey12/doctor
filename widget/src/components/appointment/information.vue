<script
  src="../../../../../Library/Containers/com.tencent.xinWeChat/Data/Library/Application Support/com.tencent.xinWeChat/2.0b4.0.9/8f84a77160f2f4b662f37a0f77e6da5a/Message/MessageTemp/c060aa4cc9f8531203e4a6c66f4d2538/File/aesEncryptUtil.js"></script>
<template>
  <div class="information" id="information">
    <navbar title="资料服务">
      <template slot="rightIcon"
      ><img
        src="../../assets/img/group/morecol.png"
        alt=""
        class="right-listicon"
        @click="goBlacklist()"
      /></template>
    </navbar>
    <div class="cardList">
      <div class="userCard">
        <div class="upUserInfo">
          <div class="leftInfo">
            <li class="info">
              <input
                class="userName"
                id="userMemo"
                :style="{ width: nameWidth + 'px' }"
                @blur="remarkPatient(0)"
                @keyup.enter="remarkPatient(0)"
                ref="userMemo"
                v-model="memo"
                :disabled="editDisabled"
              />
              <img
                src="../../assets/img/chat/edit.png"
                class="editRemark"
                @click="focusMemo"
                v-show="editDisabled"
              />
              <img
                src="../../assets/img/index/sex_girl.png"
                class="sexIcon"
                v-if="userInfo.sex == '女'"
              />

              <img
                src="../../assets/img/index/sex.png"
                class="sexIcon"
                v-if="userInfo.sex == '男'"
              />
              <span style="padding-top: 4px;"
              >{{ userInfo.age }}{{ userInfo.ageUnit }}</span
              >
            </li>
            <li class="readyName">姓名：{{ userInfo.patientName }}</li>
            <li class="tel">电话：{{ telNo }}</li>
          </div>
          <div>
            <img v-zlazy="userInfo.patientImg" class="userImg"/>
            <button
              class="attentionPat publicBtn"
              v-if="asterisk == '0'"
              @click="remarkPatient(1)"
            >
              关注
            </button>
            <button
              class="attentionPat publicBtn"
              v-if="asterisk == '1'"
              @click="remarkPatient(1)"
            >
              已关注
            </button>
          </div>
        </div>
        <li class="group" @click="openAddGroup">
          <u class="lefGroup">
            <span>备注和分组</span>
          </u>
          <u class="rightGroup" v-if="this.groupNameStr">
            <span>{{ this.groupNameStr }}</span>
            <img src="../../assets/img/index/right.png" class="rightIcon"/>
          </u>
          <u class="rightGroup" v-else>
            <span>未分组</span>
            <img src="../../assets/img/index/right.png" class="rightIcon"/>
          </u>
        </li>
      </div>
      <div class="recording">
        <div @click="openHistory">
          <img src="../../assets/img/index/history_chat.png" alt/>
          <li>聊天记录</li>
        </div>
        <div @click="openBasic">
          <img src="../../assets/img/index/basic.png" alt/>
          <li>基本情况</li>
        </div>
        <div @click="openPatientScale">
          <img src="../../assets/img/index/wz_record.png" alt/>
          <li>问诊记录</li>
        </div>
        <div @click="openPatientFollow">
          <img src="../../assets/img/index/sf_record.png" alt/>
          <li>随访记录</li>
        </div>
      </div>
      <div class="personService">
        <li @click="openPersonSer">
          <u>个性服务设置</u>
          <u><img src="../../assets/img/my/my_back.png" class="rightArrow"/></u>
        </li>
        <li @click="openHisList">
          <u>自定义服务历史</u>
          <u><img src="../../assets/img/my/my_back.png" class="rightArrow"/></u>
        </li>
        <li @click="openCfSee">
          <u>处方可见设置</u>
          <u><img src="../../assets/img/my/my_back.png" class="rightArrow"/></u>
        </li>
        <li @click="openNews">
          <u>新消息通知</u>
          <u><img src="../../assets/img/my/my_back.png" class="rightArrow"/></u>
        </li>
      </div>
      <van-tabs v-model="active" sticky offset-top="85">
        <van-tab title="处方记录">
          <light-timeline :items="cfList" v-if="cfList.length > 0">
            <template slot="tag" slot-scope="{ item }">
              <span v-if="item.type != 'y'">{{ item.addTime }}</span>
              <span v-else class="years">{{ item.addTime }}</span>
            </template>
            <template slot="symbol" slot-scope="{ item }">
              <div class="my_icon_class" v-if="item.type == 'y'">
                <div class="yuan item-circle"></div>
              </div>
            </template>
            <template slot="content" slot-scope="{ item }">
              <div
                class="zlCard"
                v-if="item.type != 'y'"
                @click="openCfDetail(item)"
              >
                <li class="cfStatus">
                  <span
                    class="font-color-green"
                    v-if="item.approvalStatus == '0'"
                  >待审核</span
                  >
                  <span
                    class="font-login-color-blue"
                    v-if="item.approvalStatus == '1'||item.approvalStatus == 'a'"
                  >已通过</span
                  >
                  <span
                    class="font-login-color-red"
                    v-if="item.approvalStatus == '2'"
                  >未通过</span
                  >
                </li>
                <li
                  class="patientZd div-overflow-2 font-size-md-2 black-font"
                  v-show="item.diagName"
                >
                  诊断：{{ item.diagName }}
                </li>
                <li class="patientCont font-login-color">
                  患者主诉：{{ item.recordsTitle }}
                </li>
              </div>
              <div :class="item.type == 'y' ? 'test' : ''" v-else></div>
            </template>
          </light-timeline>
          <div class="emptyDiv" v-else>
            <img src="../../assets/img/index/yyEmpty.png" class="emptyIcon"/>
            <li>您还没有给患者开处方</li>
          </div>
        </van-tab>
        <van-tab title="诊疗记录">
          <van-list
            v-model="loading"
            :finished="finished"
            finished-text=""
            @load="onLoaded"
          >
            <light-timeline :items="history_list">
              <template slot="tag" slot-scope="{ item }">
                <span v-if="item.type != 'y'">{{ item.inquiryTime }}</span>
                <span v-else class="years">{{ item.inquiryTime }}</span>
              </template>
              <template slot="symbol" slot-scope="{ item }">
                <div class="my_icon_class" v-if="item.type == 'y'">
                  <div class="yuan item-circle"></div>
                </div>
              </template>
              <template slot="content" slot-scope="{ item }">
                <!-- @click="openDetail(item)" -->
                <div
                  class="zlCard"
                  v-if="item.type != 'y'"
                  @click="openDetail(item)"
                >
                  <li class="docInfo">
                    <u class="docName">
                      <span v-if="item.deptName"
                      >{{ item.deptName }}&nbsp;&nbsp;&nbsp;&nbsp;</span
                      >{{ item.docName }}
                    </u>
                    <u class="wzStatus">
                      <span
                        class="lineStatus lineZlbj"
                        v-if="item.diagTreatType == '4'"
                      >诊疗笔记</span
                      >
                      <span
                        class="lineStatus lineXx"
                        v-if="
                          item.diagTreatType == '3' || item.diagTreatType == '6'
                        "
                      >线下问诊</span
                      >
                      <span
                        class="lineStatus lineZx"
                        v-if="item.diagTreatType == '0'"
                      >在线咨询</span
                      >
                      <span class="lineStatus" v-if="item.diagTreatType == '1'"
                      >在线问诊</span
                      >
                      <span class="lineStatus" v-if="item.diagTreatType == '5'"
                      >快速问诊</span
                      >

                      <span
                        class="lineStatus zzStatus"
                        v-if="item.status == '2'"
                      >转诊</span
                      >
                    </u>
                  </li>

                  <li
                    class="patientCont"
                    v-show="item.recordsTitle && item.authorizeAtatus == '1'"
                  >
                    患者主诉：{{ item.recordsTitle }}
                  </li>
                  <li
                    class="patientZd div-overflow-2 div-overflow-2"
                    v-show="item.diagNames && item.authorizeAtatus == '1'"
                  >
                    患者诊断：{{ item.diagNames }}
                  </li>
                  <li
                    class="patientZd"
                    v-show="item.sponsorDocName && item.authorizeAtatus == '1'"
                  >
                    转诊医生：{{ item.sponsorDocName }}
                  </li>
                  <li
                    class="patientCont"
                    v-show="item.hosName && item.ppbType != '7'"
                  >
                    医院：{{ item.hosName }}
                  </li>
                  <li
                    class="patientCont"
                    v-show="item.medicalAdvice && item.ppbType == '7'"
                  >
                    医嘱：{{ item.medicalAdvice }}
                  </li>
                  <img
                    src="../../assets/img/chat/isAauthor.png"
                    class="isAauthor"
                    v-if="
                      item.selfAauthorizeStatus == '2' && item.status != '2'
                    "
                  />
                  <div class="imgListDiv">
                    <van-image
                      :src="imgItem"
                      class="cfImg"
                      v-for="(imgItem, imgindex) in item.imgList"
                      :key="imgindex"
                      lazy-load
                      @click.stop="getImgView(item.imgList, imgindex)"
                    />
                  </div>
                </div>
                <div :class="item.type == 'y' ? 'test' : ''" v-else></div>
              </template>
            </light-timeline>
          </van-list>
        </van-tab>
      </van-tabs>

      <img-save
        v-if="show"
        :showPic="show"
        :index="index"
        :images="images"
        @changePreview="changePreview"
        @onClose="onClose"
      ></img-save>
      <div class="bottomBtn" v-if="pageType == 'doc'">
        <button class="publicWhiteBtn" @click="openAddNotes">
          添加诊疗笔记
        </button>
        <button class="publicBtn twoBtn" @click="openChat">去沟通</button>
      </div>
    </div>
    <van-popup v-model="sqPopup" class="popup" round>
      <li class="title">授权访问</li>
      <li>您暂无权限查看，如果如需查看本条诊疗记录 需要发送患者进行授权</li>
      <div class="btns">
        <button class="publicWhiteBtn" @click="sqPopup = false">取消</button>
        <button class="publicBtn" @click="sendMsg">发送</button>
      </div>
    </van-popup>
  </div>
</template>

<script>
import $api from "@/utils/api.js";
import navbar from "../../common/navbar";
import {getRegListByDoc} from "../../api/docList";
import {
  doctorUpdatePatientRemarkAndAsterisk,
  findAttentionAndRemarkByPatientId
} from "@/api/myGroups";
import myJsTools from "@/utils/myJsTools";
import imgSave from "@/common/imgSave";
import avater from "../../assets/img/my/default.png";
import {
  findPatientInfoByPatientId,
  saveMedicalAuthorize
} from "../../api/chat";
import eschatUnit from "../../utils/eschat";
import {Toast} from "vant";
import {getPrescriptionNotesByPlmId} from "../../api/cf";

export default {
  name: "information",
  components: {imgSave, navbar},
  data() {
    return {
      active: 0,
      userInfo: {},
      item: {},
      listQuery: {page: 1, limit: 10, size: 1, patientId: ""},
      history_list: [],
      cfList: [],
      memo: "",
      show: false,
      images: [],
      index: 0,
      patientId: "",
      telNo: "",
      docId: "",
      paddingTop: "",
      groupNameStr: "", // 备注和分组
      oldGroupIdArray: "", // 过去分组
      asterisk: "0", //是否关注患者
      editDisabled: true, //是否可编辑备注
      pageType: "doc", //只有医生显示按钮
      defaultImg: 'this.src="' + avater + '"',
      sqPopup: false, //授权弹框
      regId: "", //需要授权的挂号id
      ppbType: "", //需要授权的挂号状态
      nameWidth: "40",
      finished: false,
      loading: false
    };
  },
  created() {
    this.listQuery.patientId = this.patientId = this.$route.query.patientId;
    this.docId = myJsTools.getItem("token_info").docId;
    this.pageType = this.$route.query.pageType || "doc";
    this.getPatientInfo();
    this.getList();
    this.getCfList();
    this.getRemark();
    this.getMsg();
  },
  mounted() {
    this.paddingTop = parseInt(api.safeArea.top) + 5 + "px";
  },
  methods: {
    goBlacklist() {
      this.$router.push({
        name: "setBlacklist",
        query: {
          // patientImg: this.$route.query.patientImg,
          // patientName: this.$route.query.patientName,
          patientId: this.$route.query.patientId,
          docId: this.docId
        }
      });
    },
    onLoaded() {
      if (this.isLoading) {
        this.isLoading = false;
      }
      this.getList();
    },
    getPatientInfo() {
      findPatientInfoByPatientId({
        patientId: this.patientId
      }).then(res => {
        this.userInfo = Object.assign({}, res.data);
        myJsTools.setItem("patientInfo", res.data);
      });
    },
    //处方详情跳转
    openCfDetail(item) {
      if (item.approvalStatus == "0") {
        this.$router.push({
          name: "waitPassPerSetail",
          query: {
            businessId: item.businessId
          }
        });
        //  NNN
      } else if (item.approvalStatus == "1") {
        if (item.payStatus == "1") {
          this.$router.push({
            name: "payPre",
            query: {
              businessId: item.businessId
            }
          });
        } else {
          this.$router.push({
            name: "waitPay",
            query: {
              businessId: item.businessId
            }
          });
        }
      } else if (item.approvalStatus == "2") {
        this.$router.push({
          name: "prescDetail",
          query: {
            businessId: item.businessId
          }
        });
      } else if (item.approvalStatus == "a") {
        this.$router.push({
          name: "offLinepay",
          query: {
            businessId: item.businessId
          }
        });
      }
    },
    //获取医生和患者的处方记录
    getCfList() {
      let arr = [];
      getPrescriptionNotesByPlmId({
        docId: this.docId,
        patientId: this.patientId
      }).then(res => {
        let data = res.data;
        if (data) {
          for (let i = 0; i < data.length; i++) {
            let element = data[i];
            element.addTime = element.addTime.replace(/-/g, "/");
            var times = element.addTime.split("/");
            var years = times[0];
            element.addTime = times[1] + "/" + times[2];
            console.log(element);
            if (i != data.length - 1) {
              var yearsM = data[i + 1].addTime.split("/")[0];
              if (yearsM != years) {
                arr.push(element);
                arr.push({
                  addTime: years,
                  type: "y"
                });
              } else {
                arr.push(element);
              }
            } else if (i == data.length - 1) {
              arr.push(element);
              arr.push({
                addTime: years,
                type: "y"
              });
            } else {
              arr.push(element);
            }
          }
        }
        console.log('111111443234234324',this.cfList)
        this.cfList = arr;
        console.log('111111',arr)
      });
    },
    //发送授权信息
    sendMsg() {
      let param = {
        authorizeStatus: "1",
        authorizeType: "1",
        docId: this.docId,
        patientId: this.patientId,
        regId: this.item.regId
      };
      saveMedicalAuthorize(param).then(res => {
        let ext = {
          authorizeId: res.data.authorizeId,
          type: "blsq",
          ppbType: this.item.ppbType,
          regIdSq: this.item.regId,
          subsequent: this.item.isSubsequent,
          sponsorDocName: this.item.sponsorDocName,
          hosId: this.item.hosId,
          authorizeStatus: "1"
        };
        api.sendEvent({
          name: "sendBlsq",
          extra: {
            ext: ext
          }
        });
        this.sqPopup = false;
        Toast("授权申请已发送");
      });
    },
    // 查询患者分组和备注
    getMsg() {
      findAttentionAndRemarkByPatientId({
        docId: this.docId,
        patientId: this.patientId
      }).then(res => {
        this.groupNameStr = res.data.groupNameStr;
        this.oldGroupIdArray = res.data.groupIdStr;
        console.log(JSON.stringify(res) + "-------------查询患者备注和分组");
      });
    },
    //打开历史服务记录
    openHisList() {
      this.$router.push({
        name: "serviceHistory"
      });
    },
    //打开处方可见设置
    openCfSee() {
      this.$router.push({
        name: "patientCfIsSee",
        query: {
          patientId: this.patientId
        }
      });
    },
    openNews() {
      this.$router.push({
        name: "patientNews",
        query: {
          patientId: this.patientId
        }
      });
    },
    //打开个性服务设置
    openPersonSer() {
      this.$router.push({
        name: "personalService"
      });
    },
    goBack() {
      this.$router.go(-1);
    },
    openChat() {
      this.$router.push({
        name: "chatIndex"
      });
    },
    changePreview(index) {
      this.index = index;
    },
    onClose() {
      this.show = false;
    },
    // 获取备注和星标
    getRemark() {
      findAttentionAndRemarkByPatientId({
        docId: this.docId,
        patientId: this.patientId
      }).then(res => {
        if (res && res.data) {
          if (res.data.memo) {
            this.memo = res.data.memo;
          } else {
            this.memo = this.userInfo.patientName;
          }
          this.nameWidth = this.memo.length * 20;
          this.asterisk = res.data.asterisk || "0";
          this.telNo = res.data.telNo;
        }
      });
    },
    // 点击编辑图标 input 自动聚焦
    focusMemo() {
      this.editDisabled = false;
      this.$nextTick(() => {
        $api.byId("userMemo").focus();
      });
    },
    // 关注患者,取消关注患者
    remarkPatient(type) {
      let asterisk, param;
      if (this.asterisk != "1") {
        asterisk = "1";
      } else {
        asterisk = "0";
      }
      if (type == 0 && this.memo.length > 6) {
        Toast("备注限制输入6个字符");
        return;
      }
      if (type == 1) {
        param = {
          docId: this.docId,
          patientId: this.listQuery.patientId,
          asterisk: asterisk
        };
      } else {
        param = {
          docId: this.docId,
          patientId: this.listQuery.patientId,
          memo: this.memo
        };
      }
      doctorUpdatePatientRemarkAndAsterisk(param).then(res => {
        this.$nextTick(() => {
          $api.byId("userMemo").blur();
          this.editDisabled = true;
        });
        this.getRemark();
      });
    },

    // 打开分组选择界面
    openAddGroup() {
      this.$router.push({
        name: "patientGroup",
        query: {
          patientImg: this.$route.query.patientImg,
          patientName: this.$route.query.patientName,
          patientId: this.$route.query.patientId
        }
      });
    },
    // 预览图片
    getImgView(item, index) {
      this.images = item;
      this.index = index;
      this.show = true;
    },
    // 获取诊疗记录列表
    getList() {
      this.listQuery.docId = this.docId;
      this.listQuery.hosId = myJsTools.getItem("token_info").hosId;
      this.listQuery.medicalRecordAuth = myJsTools.getItem(
        "global_config"
      ).medical_record_auth;
      getRegListByDoc(this.listQuery).then(async res => {
        this.listQuery.size = res.data.total / this.listQuery.limit;
        this.loading = false;
        var data = res.data.rows;
        var arr = [];
        // for (let m = 0; m < data.length; m++) {
        //   const element = data[m];
        //   element.extendInfo = JSON.parse(element.extendInfo);
        //   if (element.extendInfo.isReferral == '1' && (element.extendInfo.sponsorDocId == this.docId || this.docId == element.docId)) {
        //     element.extendInfo.status = '2' //转诊   如果扩展字段中是否转诊为1 且转诊医生id = 当前医生id  或者  当前医生id = 被转诊医生id 则为转诊状态
        //   }
        //   if (element.extendInfo.diagTreatType == '4') {
        //     element.deptName = myJsTools.getItem("token_info").deptName.join(",");
        //   }
        //   if (element.extendInfo.prescriptionImg) {
        //     var list = JSON.parse(element.extendInfo.prescriptionImg);
        //   } else {
        //     var list = [];
        //   }
        //   element.imgList = [];
        //   if (list.length > 0) {
        //     for (let x = 0; x < list.length; x++) {
        //       const imgName = list[x];
        //       if (imgName) {
        //         let result = await myJsTools.getUrl(imgName);
        //         element.imgList.push(result)
        //       }
        //     }
        //   }
        //
        //   var times = element.inquiryTime.split("/");
        //   var years = times[0];
        //   element.inquiryTime = times[1] + "/" + times[2];
        //   if (m != data.length - 1) {
        //     var yearsM = data[m + 1].inquiryTime.split("/")[0];
        //     if (yearsM != years) {
        //       arr.push(element);
        //       arr.push({
        //         inquiryTime: years,
        //         type: "y"
        //       });
        //     } else {
        //       arr.push(element);
        //     }
        //   } else if (m == data.length - 1) {
        //     arr.push(element);
        //     arr.push({
        //       inquiryTime: years,
        //       type: "y"
        //     });
        //   } else {
        //     arr.push(element);
        //   }
        // }
        if (this.listQuery.page > 1) {
          let lastData = this.history_list[this.history_list.length - 1];
          if (data[0].addTimeYear == lastData.addTime && lastData.type == "y") {
            this.history_list.splice(this.history_list.length - 1, 1);
          }
        }
        this.history_list = this.history_list.concat(this.setData(data));
        if (this.listQuery.page >= this.listQuery.size) {
          this.finished = true; // 若数据已全部获取完毕
          return;
        } else {
          this.listQuery.page++;
        }
      });
    },
    setData(data) {
      let arr = [];
      if (data) {
        for (let i = 0; i < data.length; i++) {
          let element = data[i];
          var times = element.inquiryTime.split("/");
          var years = times[0];
          element.inquiryTime = times[1] + "/" + times[2];
          if (i != data.length - 1) {
            var yearsM = data[i + 1].inquiryTime.split("/")[0];
            if (yearsM != years) {
              arr.push(element);
              arr.push({
                inquiryTime: years,
                type: "y"
              });
            } else {
              arr.push(element);
            }
          } else if (i == data.length - 1) {
            arr.push(element);
            arr.push({
              inquiryTime: years,
              type: "y"
            });
            return arr;
          }
        }
      }
    },
    // 诊疗记录页面
    openDetail(item) {
      this.item = item;
      //没资格访问
      if (item.authorizeAtatus != "1") {
        this.sqPopup = true;
        return;
      }
      //诊疗笔记
      if (item.diagTreatType == 4) {
        this.$router.push({
          name: "medicalNotes",
          query: {
            dmrId: item.dmrId
          }
        });
        //  线下问诊（进入电子病历那页）
      } else if (item.diagTreatType == "3") {
        this.$router.push({
          name: "offLineRecord",
          query: {
            emrId: item.regId
          }
        });
      } else {
        // 咨询 复诊
        this.$router.push({
          name: "appYy",
          query: {
            regId: item.regId,
            hosId: item.hosId,
            pageType: "information"
          }
        });
        // }
      }
    },
    // 基本情况页面
    openBasic() {
      this.$router.push({
        name: "basicSituation",
        query: {
          patientId: this.patientId
        }
      });
    },
    openPatientScale() {
      this.$router.push({
        name: "patientScaleApp",
        query: {
          patientId: this.patientId
        }
      });
    },
    openPatientFollow() {
      this.$router.push({
        name: "patientFollowUp",
        query: {
          patientId: this.patientId
        }
      });
    },
    // 添加诊疗笔记
    openAddNotes() {
      this.$router.push({
        name: "addMedicalNotes"
      });
    },
    //历史记录
    openHistory() {
      this.$router.push({
        name: "historyChat"
      });
    }
  }
};
</script>

<style lang="less" scoped>
.cfStatus {
  text-align: right;
}

.emptyDiv {
  background: @white;
  padding-bottom: 58px;
  border-bottom-right-radius: 8px;
  border-bottom-left-radius: 8px;
}

.information {
  background: #f5f5f5;
  height: auto;
  padding-bottom: 70px;
  overflow: scroll;

  header {
    position: fixed;
    z-index: 999;
    top: 0;
    display: flex;
    height: 44px;
    background: #ffffff;
    border-bottom: 1px solid #ebebeb;

    img {
      margin-top: 8px;
      // padding: 0 15px;
    }

    .backIcon {
      width: 24px;
      height: 24px;
    }

    .moreIcon {
      width: 22px;
      height: 22px;
    }

    .title {
      padding: 4px 0;
      width: 80%;
      text-align: center;

      .name {
        color: #333333;
        font-size: 18px;
        /*font-weight: 500;*/
        line-height: 20px;
      }

      .money {
        color: #666660;
        font-size: 11px;
        line-height: 16px;
      }
    }
  }

  .cardList {
    margin: 16px;

    .userCard {
      background: #ffffff;
      border-radius: 8px;
      padding: 15px 12px;

      .upUserInfo {
        display: flex;
        border-bottom: 1px solid #ebebeb;

        .attentionPat {
          width: 52px;
          line-height: 20px;
          border-radius: 2px;
          .font-login-sm;
        }

        .leftInfo {
          width: 90%;
        }

        .userImg {
          .img-width-height-md;
          margin: 0 auto 3px;
        }

        .info {
          display: flex;
          align-items: center;
          line-height: 16px;
          margin-bottom: 11px;

          .editRemark {
            .icon-width-height-sm-16;
            padding-top: 2px;
            margin-right: 12px;
          }

          .userName {
            .black-font;
            .font-size-lg;
            .font-blod-4;
          }

          .userName:disabled {
            background: @white;
          }

          .sexIcon {
            .icon-width-height-sm-16;
            padding-top: 4px;
          }
        }

        .readyName,
        .tel {
          .font-size-md;
          .black-font;
          line-height: 20px;
        }

        .tel {
          margin-bottom: 12px;
        }
      }

      .group {
        .display-div;
        align-items: center;
        padding-top: 16px;

        u {
          .black-font;
          .font-size-md;

          span {
            padding-top: 2px;
          }
        }

        .rightGroup {
          display: flex;

          .rightIcon {
            .rightArrow;
            margin-left: 8px;
            line-height: 22px;
          }

          span {
            .font-login-color;
          }
        }
      }
    }

    .recording {
      background: @white;
      border-radius: 8px;
      padding: 16px 0;
      display: flex;
      margin-top: 17px;

      div {
        width: 25%;
        text-align: center;

        li {
          margin-top: 2px;
          .black-font;
          .font-login-sm;
          line-height: 16px;
        }
      }

      img {
        .img-width-height-spe;
        margin: 0 auto;
      }
    }

    .title {
      .black-font;
      .font-size-md;
      .font-blod-2;
      line-height: 20px;
      padding: 12px 0px;
    }

    .zlCard {
      background: @white;
      padding-bottom: 12px;
      margin-left: 45px;
      padding-top: 0px;
      border-bottom: 1px solid @back-border;
      position: relative;

      .docInfo {
        .display-div;

        .docName {
          .black-font;
          .font-size-md-2;
          .font-blod-2;
        }

        .wzStatus {
          .lineStatus {
            padding: 3px 9px 2px 9px;
            line-height: 18px;
            border-radius: 4px;
            .font-size-xs;
            .white-font;
            background: @linear-gradient-orange;
          }

          .zzStatus {
            background: @linear-gradient-red;
          }

          .lineZx {
            background: @linear-gradient-blue;
          }

          .lineZlbj {
            background: @linear-gradient-black;
          }

          .lineXx {
            background: @linear-gradient-blue;
          }
        }

        .patientCont,
        .patientZd,
        .time {
          .font-login-color;
          .font-size-md;
          margin-top: 13px;
          line-height: 20px;
        }
      }

      .imgListDiv {
        display: flex;
        flex-wrap: wrap;
        margin-top: 4px;

        :nth-child(2),
        :nth-child(5),
        :nth-child(8) {
          margin: 0 9px;
        }

        .cfImg {
          width: 30%;
          height: 80px;
          margin-top: 8px;
          border-radius: 4px;
          object-fit: cover;
        }
      }
    }

    .btns {
      position: fixed;
      bottom: 16px;
      width: 100%;
      z-index: 999;

      button {
        line-height: 49px;
        border-radius: 25px;
        width: 44%;
        font-size: 18px;
        font-weight: 500;
      }

      .addBtn {
        color: #14a0e6;
        border: 1px solid #14a0e6;
        background: #fff;
      }

      .goChat {
        color: #fff;
        background: #14a0e6;
        margin-left: 8px;
      }
    }
  }
}

/deep/ .line-container {
  background: @white;
  width: 100%;
  margin: 0 0 2rem;
  padding-left: 1rem;
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;

  .line-item {
    margin-left: 0px;
    padding: 14px 8px 8px 8px;

    .item-tag {
      top: 17px;
      position: absolute;
      left: -0.8rem;
      text-align: center;

      span {
        .black-font;
        .font-size-md;
        .font-blod-2;
        background: @page-back;
        line-height: 20px;
        padding: 0 4px;
        border-radius: 4px;
        letter-spacing: 0.5px;
        margin-top: 30px;
        display: inline-block;
      }

      .years {
        background: @blue;
        .white-font;
        margin-top: 3px;
      }
    }

    .item-symbol {
      left: 1rem;
    }
  }

  .item-circle {
    box-sizing: border-box;
    position: absolute;
    margin-left: -4px;
    width: 8px;
    height: 8px;
    border-radius: 10px;
    background: @white;
    border: 1px solid @back-border;
    top: 40px;
  }

  .yuan {
    background: @blue;
    border: 1px solid @blue;
    top: 10px;
  }
}

/deep/ .line-container::after {
  left: 2rem;
  background: @back-border;
}

.right-listicon {
  // width: 30px;
  // height: 30px;
  width: 0.64rem;
  height: 0.64rem;
  position: absolute;
  right: 10px;
  top: -4px;
}

.line-container li:last-child {
  .zlCard {
    border-bottom: 0px;
  }
}

.test {
  height: 35px;
}

.personService {
  border-radius: 8px;
  margin-top: 12px;
  margin-bottom: 12px;
  padding: 4px 0;
  background: @white;
  .font-size-md;
  .black-font;

  li {
    padding: 11px 12px;
    .display-div;
    align-items: center;
    border-bottom: 1px solid @back-border;

    u:first-child {
      width: 90%;
    }
  }

  li:last-child {
    border: none;
  }
}

.isAauthor {
  position: absolute;
  width: 80px;
  height: 80px;
  z-index: 1;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.vanPopup {
  padding: 20px;
  text-align: center;
  color: #333333;
  width: 70%;

  li {
    font-size: 12px;
    line-height: 17px;
  }

  .title {
    .font-size-lg;
    line-height: 22px;
    margin-bottom: 28px;
  }

  .btns {
    margin-top: 36px;

    button {
      width: 122px;
      text-align: center;
      color: #14a0e6;
      font-size: 16px;
      line-height: 34px;
      border: 1px solid #14a0e6;
      background: #ffffff;
      border-radius: 25px;
    }

    .sure {
      background: #14a0e6;
      color: #ffffff;
    }
  }
}
</style>
