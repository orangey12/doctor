<template>
  <div class="addFollowUp">
    <navbar :title="!sendId ? '新建群发' : '再发一条'"></navbar>
    <div class="addFollow">
      <div class="title">
        <li>标题</li>
        <van-field v-model="planName" placeholder="请输入标题" />
      </div>
      <div class="content">
        <li>计划内容</li>
        <van-field
          v-model="planContent"
          autosize
          rows="2"
          type="textarea"
          placeholder="请输入内容"
        />
      </div>
      <div class="patient" @click="goSelect">
        <li>选择患者</li>
        <li class="selectInfo">
          <u>
            <span v-if="!patientName">选择患者</span>
            <span v-else style="color: #333333">{{ patientName }}</span>
          </u>
          <u><img src="../../assets/img/my/down.png" class="icon-width-height-sm-16"/></u>
        </li>
      </div>
      <div class="picture" @click="showPic = true">
        <li>添加照片（单张/选填）</li>
        <li class="selectInfo" v-if="!imgUrl">
          <u>
            <img src="../../assets/img/follow/img.png" class="icon-width-height-sm-16" />
            <span>选择图片（2M以内）</span>
          </u>
          <u><img src="../../assets/img/my/down.png" class="icon-width-height-sm-16"/></u>
        </li>
        <li class="selectInfo" v-else>
          <div style="position: relative">
            <img v-zlazy="imgUrl" class="selectImg" />
            <img
              src="../../assets/img/cf/deleteZd.png"
              class="deleteIcon"
              @click.stop="
                imgUrl = '';
                imgBase64 = '';
              "
            />
          </div>
        </li>
      </div>
      <div class="scale" @click="selectScale">
        <li>添加量表（选填）</li>
        <li class="selectInfo">
          <u>
            <span v-if="didTitle" style="color: #333333">{{ didTitle }}</span>
            <span v-else>添加量表</span>
          </u>
          <u><img src="../../assets/img/my/down.png" class="icon-width-height-sm-16"/></u>
        </li>
      </div>
      <div class="lineCard" @click="showLineCard = true">
        <li>添加出诊表（选填）</li>
        <li class="selectInfo">
          <u>
            <span v-if="lineCard" class="black-font">{{ lineCard }}</span>
            <span v-else>添加出诊表</span>
          </u>
          <u><img src="../../assets/img/my/down.png" class="icon-width-height-sm-16"/></u>
        </li>
      </div>
    </div>
    <van-action-sheet
      v-model="showLineCard"
      :actions="lineActions"
      cancel-text="取消"
      close-on-click-action
      style="width:100%"
      @select="openLineCard"
      close-on-popstate
    />
    <van-action-sheet
      v-model="showPic"
      :actions="picActions"
      cancel-text="取消"
      close-on-click-action
      style="width:100%"
      @select="getPic"
      close-on-popstate
    />
    <div class="bottomBtn">
      <button class="publicWhiteBtn" @click="lookPlan">预览</button>
      <button class="publicBtn twoBtn" @click="saveFun">发送</button>
    </div>
  </div>
</template>

<script>
  import Navbar from "../../common/navbar";
  import {getSysCodeByType, saveProFlockSend} from "../../api/scale";
  import date from "../../utils/date";
  import myJsTools from "../../utils/myJsTools";
  import {
    createDocFlockDetail,
    followupQueryPlanDetails,
    getPatientListByFlockId,
    saveFollow,
    updatePlan
  } from "../../api/followUp";
  import { Toast } from "vant";
  import ossUpDown from "../../utils/ossUpDown";
  import { findPatientInfoGroupByGroup } from "../../api/pictrue";
  import eschatUnit from "../../utils/eschat";
  import {getDocBulkDetails} from "../../api/fsend";
  export default {
    name: "newsFsend",
    components: { Navbar },
    data() {
      return {
        sendId: "",
        didId:"",
        flockId: "",
        docId: "",
        planName: "",
        planImg: "",
        memo: "",
        planContent: "",
        patientName: "",
        patientIdList: "",
        patientIdstr: [],
        groupList: [], //选择的患者列表
        savaPatientStatus: true, //患者列表是否更改
        visitRealType: "", //排班 线上线下
        showLineCard: false,
        lineActions: [],
        lineCard: "",
        showPic: false,
        imgUrl: "",
        imgBase64: "",
        didTitle: "",
        didOnlyId: "",
        picActions: [
          { name: "拍照", sourceType: "camera" },
          { name: "从相册选择", sourceType: "album" }
        ]
      };
    },
    // 页面缓存取患者列表
    activated() {
      let arr = this.$store.getters.getFsendGroupsList;
      console.log(JSON.stringify(arr) + "返回的患者数组");
      this.groupList = arr;
      let patientName = [],patientIdList = [],patientIdstr = [];
      let arrId = [];//去重数组
      arr.forEach(element => {
        if (element.result.length > 0) {
          element.result.forEach(item => {
            if(arrId.indexOf(item.patientId) == -1){
              arrId.push(item.patientId)
              patientName.push(item.patientName);
              patientIdList.push({
                appid: item.appId,
                patientId: item.patientId,
                openid: item.openId,
                userId: item.userId
              });
              patientIdstr.push({ patientId: item.patientId });
            }
          });
        }
      });
      this.patientName = patientName.join(",");
      this.patientIdList = patientIdList;
      this.patientIdstr = patientIdstr;
    },
    beforeCreate() {
      this.$store.commit("UPDATE_KEEP_ALIVE", {
        keepAlive: "newsFsend"
      });
    },
    created() {
      this.docId = myJsTools.getItem("token_info").docId;
      console.log(this.$route.query.sendId);
      if (this.$route.query.sendId) {
        this.sendId = this.$route.query.sendId;
        this.getDetail();
      }
      this.getSelectOptions();
      this.addEvent();
    },
    methods: {
      getSelectOptions(){
        getSysCodeByType({
          codeType: "055"
        }).then(res => {
          res.data.map(item=>{
            item.name = item.meaning
          })
          this.lineActions = res.data;
        });
      },
      // 点击详情预览
      getDetail() {
        let me = this;
        getDocBulkDetails({
          sendId: this.$route.query.sendId
        }).then(async res => {
          let data = res.data;
          console.log(JSON.stringify(res));
          this.planName = data.planName;
          this.flockId = data.flockId;
          this.planContent = data.sendContent;
          this.patientName = data.patientNames;
          this.didTitle = data.didName;
          this.planImg = data.sendImg;
          this.didId = data.didId;
          this.visitRealType = data.visitRealType;
          if (data.visitRealType == "1") {
            this.lineCard = "线上出诊表";
          } else if (data.visitRealType == "2") {
            this.lineCard = "线下出诊表";
          }
          if (data.sendImg) {
            this.imgUrl = data.sendImg;
          }
          this.getPlanPatientList();
        });
      },
      //事件监听
      addEvent() {
        let me = this;
        api.addEventListener(
          {
            name: "sendDid"
          },
          function(ret, err) {
            console.log(JSON.stringify(ret.value) + "---------选择量表");
            me.didOnlyId = ret.value.didOnlyId;
            me.didId = ret.value.didId;
            me.didTitle = ret.value.title;
          }
        );
        api.addEventListener(
          {
            name: "selectCard"
          },
          function(ret, err) {
            console.log(JSON.stringify(ret.value) + "---------选择排班");
            me.visitRealType = ret.value.visitRealType;
            if (ret.value.visitRealType == 1) {
              me.lineCard = "线上排班";
            } else {
              me.lineCard = "线下排班";
            }
          }
        );
        api.addEventListener(
          {
            name: "updatePatient"
          },
          function(ret, err) {
            me.savaPatientStatus = false;
          }
        );
        api.addEventListener(
          {
            name: "savePlan"
          },
          function(ret, err) {
            me.saveFun();
          }
        );
      },
      getGroupList(result) {
        findPatientInfoGroupByGroup({ name: "",docId:this.docId }).then(async res => {
          res.data.map(item => {
            item.result = [];
            item.isCheckedAll = false;
            item.list.map((listItem, index) => {
              result.map(val => {
                if (val.patientId == listItem.patientId) {
                  item.result.push(item.list[index]);
                }
              });
            });
            if (item.result.length == item.list.length) {
              item.isCheckedAll = true;
            }
          });
          this.groupList = res.data;
          this.$store.commit("setGroupList", res.data);
        });
      },
      //选择问诊单
      selectScale() {
        this.$router.push({
          name: "sendScale",
          query: {
            type: "plan"
          }
        });
      },
      // 选择出诊表
      openLineCard(val) {
        this.showLineCard = false;
        let param = {
          type: "plan"
        };
        if (val.name == "线上") {
          this.$router.push({
            name: "lineCard",
            query: param
          });
        } else {
          this.$router.push({
            name: "onLineCard",
            query: param
          });
        }
      },
      // 选择照片或者拍照
      getPic(val) {
        let me = this;
        api.getPicture(
          {
            sourceType: val.sourceType,
            encodingType: "png",
            mediaValue: "pic",
            destinationType: "base64",
            allowEdit: true,
            quality: 80,
            saveToPhotoAlbum: false
          },
          function(ret, err) {
            if (ret && ret.data != '' && ret.base64Data != '') {
              me.imgUrl = ret.data;
              me.imgBase64 = ret.base64Data;
              var imageFilter = api.require("imageFilter");
              imageFilter.getAttr(
                {
                  path: ret.data,
                },
                function (ret, err) {
                  if (ret.status) {
                    me.saveImg(ret.size);
                  } else {
                  }
                }
              );
            } else {
              console.log(JSON.stringify(err));
            }
          }
        );
      },
      //获取编辑状态下的患者列表
      getPlanPatientList() {
        getPatientListByFlockId({
          flockId: this.flockId,
          docId: myJsTools.getItem("token_info").docId
        }).then(res => {
          console.log(JSON.stringify(res) + "=========患者分组");
          this.getGroupList(res.data);
          this.patientIdList = res.data;
          this.patientIdstr = res.data;
        });
      },
      // 去选择患者
      goSelect() {
        console.log(this.groupList);
        if (this.groupList.length == 0) {
          this.$router.push({
            name: "selectFsend"
          });
        } else {
          this.$router.push({
            name: "selectFsend",
            params: {
              groupList: this.groupList
            }
          });
        }
      },
      //看患者列表是否发生改变去走不同的方法
      saveFun() {
        if (!this.planName) {
          Toast("请输入标题");
          return;
        }
        if (this.patientIdstr.length == 0) {
          Toast("请选择患者");
          return;
        }
        if(!this.planContent && !this.imgBase64 && !this.didTitle && !this.lineCard){
          Toast("请在内容 图片 量表或者出诊表中选择一样进行填写");
          return;
        }
        this.savePlan();
      },
      // 保存患者为群
      savaPatient() {
        this.savePlan();
      },
      //保存群发图片
      saveImg(size) {
        let me = this;
        myJsTools.appendFile(
          "13",
          this.imgBase64,
          "333.png",
          size
        );
        api.addEventListener(
          {
            name: "upImg"
          },
          function(ret, err) {
            me.planImg = ret.value.url;
            console.log(me.planImg + "-------------url");
          }
        );
      },
      // 保存随访计划
      savePlan() {
        let param = {
          didId: this.didId,
          docId: this.docId,
          sendContent: this.planContent,
          sendImg: this.planImg,
          planName: this.planName,
          visitDocId: this.docId,
          visitRealType: this.visitRealType,
          sendType:"2",
          patientList:this.patientIdList
        };
        console.log(JSON.stringify(param) + "-----------发送数据");
        if (this.planId) {
          //编辑保存
          param.planId = this.planId;
          updatePlan(param).then(res => {
            console.log(res);
            this.$store.commit("UPDATE_KEEP_ALIVE", {
              keepAlive: "newsFsend",
              type: 1
            });
            this.$router.go(-1);
          });
        } else {
          //新增
          saveProFlockSend(param).then(res => {
            console.log(res);
            this.$store.commit("UPDATE_KEEP_ALIVE", {
              keepAlive: "newsFsend",
              type: 1
            });
            console.log(JSON.stringify(this.patientIdList) + "--------this.patientIdList");
            this.patientIdList.map(item =>{
              let ext = {
                groupInfoId:res.data.sendId,
                title:this.planName,
                type:"qf"
              }
              eschatUnit.sendMsg(
                "[群发]",
                this.docId,
                item.patientId,
                item.userId,
                ext
              );
            })
            this.$router.go(-1);
          });
        }
      },
      // 预览随访计划
      lookPlan() {
        let param = {
          didId: this.didId,
          didOnlyId:this.didOnlyId,
          sendOnlyId:this.sendId,
          docId: this.docId,
          planContent: this.planContent,
          planImg: this.imgUrl,
          planName: this.planName,
          visitRealType: this.visitRealType
        };
        this.$router.push({
          name: "fsendLook",
          query: param
        });
      }
    }
  };
</script>

<style scoped lang="less">

  .addFollow {
    padding: 0 16px 76px 16px;
    .title,
    .content,
    .patient,
    .picture,
    .scale,
    .lineCard,
    .dateTime,
    .repeatCycle,
    .memo {
      background: @white;
      padding: 12px;
      border-radius: 8px;
      margin-top: 12px;
      .font-size-md;
      li:first-child {
        .font-blod-2;
      }
      .selectInfo {
        .display-div;
        .font-login-color;

        margin-top: 5px;
        line-height: 22px;
        .selectImg {
          width: 100px;
          height: 100px;
          border-radius: 8px;
        }
        .deleteIcon {
          position: absolute;
          right: -4px;
          top: -4px;
          height: 16px;
          width: 16px;
        }
        u:first-child {
          width: 80%;
          display: flex;
          align-items: center;
        }
      }
      li {
        line-height: 22px;
        .black-font;
      }
      /deep/.van-cell {
        padding: 5px 0px 0px 0px;
        .black-font;
        line-height: 18px;
      }
    }
    .content {
      /deep/.van-cell {
        padding: 12px;
        border: 1px solid @back-border;
        margin-top: 12px;
        border-radius: 8px;
      }
    }
    .picture,
    .scale,
    .lineCard,
    .dateTime,
    .repeatCycle {
      .selectInfo {
        padding: 10px 12px;
        border: 1px solid @back-border;
        margin-top: 12px;
        border-radius: 8px;
      }
      .icon-width-height-sm-16 {
        margin-right: 6px;
      }
    }
  }
  /deep/input::placeholder {
    .black-font;
    .font-size-lg;
    line-height: 22px;
  }
</style>
