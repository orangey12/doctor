<template>
  <div class="addFollowUp">
    <navbar :title="planId ? '编辑随访计划' : '新增随访计划'"></navbar>
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
          <u><img src="../../assets/img/my/down.png" class="addIcon"/></u>
        </li>
      </div>
      <div class="picture" @click="showPic = true">
        <li>添加照片（单张/选填）</li>
        <li class="selectInfo" v-if="!imgUrl">
          <u>
            <img src="../../assets/img/follow/img.png" class="imgIcon" />
            <span>选择图片（2M以内）</span>
          </u>
          <u><img src="../../assets/img/my/down.png" class="addIcon"/></u>
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
          <u><img src="../../assets/img/my/down.png" class="addIcon"/></u>
        </li>
      </div>
      <div class="lineCard" @click="showLineCard = true">
        <li>添加出诊表（选填）</li>
        <li class="selectInfo">
          <u>
            <span v-if="lineCard" style="color: #333333">{{ lineCard }}</span>
            <span v-else>添加出诊表</span>
          </u>
          <u><img src="../../assets/img/my/down.png" class="addIcon"/></u>
        </li>
      </div>
      <div class="dateTime" @click="timeShow = true">
        <li>日期时间</li>
        <li class="selectInfo">
          <u>
            <span v-if="planTime" style="color: #333333">{{ planTime }}</span>
            <span v-else>请选择日期时间</span>
          </u>
          <u><img src="../../assets/img/scale/down.png" class="addIcon"/></u>
        </li>
      </div>
      <div class="repeatCycle" @click="repeatShow = true">
        <li>重复周期</li>
        <li class="selectInfo">
          <u>
            <span v-if="repetitionPeriodName" style="color: #333333">{{
              repetitionPeriodName
            }}</span>
            <span v-else>请选择重复周期</span>
          </u>
          <u><img src="../../assets/img/scale/down.png" class="addIcon"/></u>
        </li>
      </div>
      <div class="memo">
        <li>备注</li>
        <van-field v-model="memo" placeholder="请输入备注" />
      </div>
    </div>
    <van-action-sheet
      v-model="repeatShow"
      :actions="actions"
      @select="onSelect"
      cancel-text="取消"
      close-on-click-action
    />
    <van-popup v-model="timeShow" position="bottom" round>
      <van-datetime-picker
        v-model="currentDate"
        type="datetime"
        title="选择完整时间"
        :min-date="minDate"
        @confirm="comfirmTime"
        @cancel="timeShow = false"
      />
    </van-popup>
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
      <button class="publicBtn twoBtn" @click="saveFun">保存</button>
    </div>
  </div>
</template>

<script>
import Navbar from "../../common/navbar";
import { getSysCodeByType } from "../../api/scale";
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
export default {
  name: "addFollowUp",
  components: { Navbar },
  data() {
    return {
      planId: "",
      flockId: "",
      docId: "",
      planName: "",
      planImg: "",
      memo: "",
      planContent: "",
      repeatShow: false, //重复周期
      repetitionPeriodName: "", //重复周期选择值
      repetitionPeriod: "", //重复周期code
      actions: [],
      currentDate: new Date(), //日期时间选择
      minDate: new Date(),
      timeShow: false, //展示时间选择弹窗
      planTime: "", //随访计划日期
      patientName: "",
      patientIdList: "",
      patientIdstr: "",
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
    console.log(arr);
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
              userId: item.userIdi
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
      keepAlive: "addFollowUp"
    });
  },
  created() {
    this.docId = myJsTools.getItem("token_info").docId;
    this.getRepeatList();
    console.log(this.$route.query.planId);
    if (this.$route.query.planId) {
      this.planId = this.$route.query.planId;
      this.getPlanDetail();
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
          me.didTitle = ret.value.title;
        }
      );
      api.addEventListener(
        {
          name: "selectCard"
        },
        function(ret, err) {
          me.visitRealType = ret.value.visitRealType;
          me.vrTempType = ret.value.vrTempType;
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
    // 获取详情编辑
    getPlanDetail() {
      let me = this;
      followupQueryPlanDetails({
        id: this.planId
      }).then(async res => {
        console.log(res);
        let data = res.data;
        this.planName = data.planName;
        this.memo = data.memo;
        this.planContent = data.planContent;
        this.planTime = data.planTime;
        this.planId = data.planId;
        this.didOnlyId = data.didOnlyId;
        this.visitRealType = data.visitRealType;
        this.flockId = data.flockId;
        this.didTitle = data.didName;
        this.patientName = data.patientNames;
        if (data.visitRealType == "1") {
          this.lineCard = "线上出诊表";
        } else if (data.visitRealType == "2") {
          this.lineCard = "线下出诊表";
        }
        this.planImg = data.planImg;
        for (let i = 0; i < this.actions.length; i++) {
          let el = this.actions[i];
          if (el.code == data.repetitionPeriod) {
            this.repetitionPeriodName = el.name;
            this.repetitionPeriod = el.code;
          }
        }
        this.getPlanPatientList();
      });
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
        this.patientIdList = res.data;
        this.$store.commit("setGroupList", res.data);
      });
    },
    //选择周期
    onSelect(item) {
      this.repeatShow = false;
      this.repetitionPeriodName = item.name;
      this.repetitionPeriod = item.code;
      console.log(item.name);
    },
    //获取重复周期列表
    getRepeatList() {
      getSysCodeByType({
        codeType: "004"
      }).then(res => {
        let data = res.data;
        for (let i = 0; i < data.length; i++) {
          data[i].name = data[i].meaning;
        }
        this.actions = data;
      });
    },
    // 日期选择
    comfirmTime(value) {
      this.timeShow = false;
      this.planTime = date.getNowTime(value);
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
        type: "plan",
        code:val.code
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
            console.log(JSON.stringify(ret));
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
        this.getGroupList(res.data);
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
      if (this.savaPatientStatus && this.imgBase64) {
        this.saveImg();
      } else if (!this.savaPatientStatus) {
        this.savaPatient();
      } else if (this.savaPatientStatus && !this.imgBase64) {
        this.savePlan();
      }
    },
    // 保存患者为群
    savaPatient() {
      if (!this.planName) {
        Toast("请输入标题");
        return;
      }
      if (!this.planTime) {
        Toast("请选择日期时间");
        return;
      }
      if (!this.repetitionPeriod) {
        Toast("请选择重复周期");
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
      createDocFlockDetail({
        patientList: this.patientIdstr
      }).then(res => {
        console.log(res);
        this.flockId = res.data.flockId;
        if (this.imgBase64) {
          this.saveImg();
        } else {
          this.savePlan();
        }
      });
    },
    //保存随访图片
    saveImg() {
      if (!this.planName) {
        Toast("请输入标题");
        return;
      }
      if (!this.planTime) {
        Toast("请选择日期时间");
        return;
      }
      if (!this.repetitionPeriod) {
        Toast("请选择重复周期");
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
      let me = this;
      myJsTools.appendFile(
        "13",
        this.imgBase64,
        "333.png",
        this.imgBase64.length
      );
      api.addEventListener(
        {
          name: "upImg"
        },
        function(ret, err) {
          console.log(ret.value.url);
          me.planImg = ret.value.url;
          me.savePlan();
        }
      );
    },
    // 保存随访计划
    savePlan() {
      if (!this.planName) {
        Toast("请输入标题");
        return;
      }
      if (!this.planTime) {
        Toast("请选择日期时间");
        return;
      }
      if (!this.repetitionPeriod) {
        Toast("请选择重复周期");
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
      let param = {
        didOnlyId: this.didOnlyId,
        docId: this.docId,
        docName: myJsTools.getItem("token_info").docName,
        flockId: this.flockId,
        memo: this.memo,
        planContent: this.planContent,
        planImg: this.planImg,
        planName: this.planName,
        planTime: this.planTime,
        repetitionPeriod: this.repetitionPeriod,
        visitDocId: this.docId,
        visitRealType: this.visitRealType
      };
      console.log(param);
      if (this.planId) {
        //编辑保存
        param.planId = this.planId;
        updatePlan(param).then(res => {
          console.log(res);
          this.$store.commit("UPDATE_KEEP_ALIVE", {
            keepAlive: "addFollowUp",
            type: 1
          });
          this.$router.go(-1);
        });
      } else {
        //新增
        saveFollow(param).then(res => {
          console.log(res);
          this.$store.commit("UPDATE_KEEP_ALIVE", {
            keepAlive: "addFollowUp",
            type: 1
          });
          this.$router.go(-1);
        });
      }
    },
    // 预览随访计划
    lookPlan() {
      let param = {
        didOnlyId: this.didOnlyId,
        docId: this.docId,
        planContent: this.planContent,
        planImg: this.imgUrl,
        planName: this.planName,
        visitRealType: this.visitRealType
      };
      this.$router.push({
        name: "previewFollow",
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
    background: #ffffff;
    padding: 12px;
    border-radius: 8px;
    margin-top: 12px;
    li:first-child {
      font-weight: 600;
    }
    .selectInfo {
      margin-top: 5px;
      justify-content: space-between;
      align-items: center;
      display: flex;
      color: #999999;
      font-size: 14px;
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
      font-size: 14px;
      color: #333333;
    }
    /deep/.van-cell {
      padding: 5px 0px 0px 0px;
      font-size: 14px;
      line-height: 18px;
    }
    .addIcon,
    .imgIcon {
      width: 16px;
      height: 16px;
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
    .imgIcon {
      margin-right: 6px;
    }
  }
}
/deep/input::placeholder {
  .font-login-color;
  .font-size-lg;
  line-height: 22px;
}
</style>
