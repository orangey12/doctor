<template>
  <div class="detailCom">
    <div class="addFollow">
      <div class="title">
        <li>标题</li>
        <van-field v-model="planName" disabled placeholder="请输入标题" />
      </div>
      <div class="content">
        <li>计划内容</li>
        <van-field
          v-model="planContent"
          autosize
          rows="2"
          disabled
          type="textarea"
          placeholder="请输入内容"
        />
      </div>
      <div class="patient" v-if="patientNames" @click="openList">
        <li>患者</li>
        <li class="selectInfo">
          <u>
            <span>{{ patientNames }}</span>
          </u>
          <u><img src="../../assets/img/follow/right.png" class="icon-width-height-sm-16"/></u>
        </li>
      </div>
      <div class="picture" v-if="planImg" @click="lookImg(planImg)">
        <li>照片</li>
        <img v-zlazy="planImg" class="selectImg" />
      </div>
      <div class="scale" v-if="didTitle" @click="openScalDetail">
        <li>量表</li>
        <li class="selectInfo">
          <u>
            {{ didTitle }}
          </u>
          <u><img src="../../assets/img/follow/right.png" class="icon-width-height-sm-16"/></u>
        </li>
      </div>
      <div class="lineCard" v-if="lineCard" @click="openVisit">
        <li>出诊表</li>
        <li class="selectInfo">
          <u>
            {{ lineCard }}
          </u>
          <u><img src="../../assets/img/follow/right.png" class="icon-width-height-sm-16"/></u>
        </li>
      </div>
      <div class="dateTime">
        <li>日期时间</li>
        <li class="selectInfo">
          <u>
            <span v-if="planTime">{{ planTime }}</span>
            <span v-else>请选择日期时间</span>
          </u>
        </li>
      </div>
      <div class="repeatCycle">
        <li>重复周期</li>
        <li class="selectInfo">
          <u>
            {{ repetitionPeriodName }}
          </u>
        </li>
      </div>
      <div class="memo">
        <li>备注</li>
        <van-field v-model="memo" disabled placeholder="请输入备注" />
      </div>
    </div>
    <div class="bottomBtn" @click="editPlan" v-if="type == 'default'">
      <button class="publicBtn">去编辑</button>
    </div>
    <div class="bottomBtn" @click="carriedPlan" v-if="type == 'carried' && plsId">
      <button class="publicBtn">执行</button>
    </div>
    <img-save
      v-if="showImgPic"
      :showPic="showImgPic"
      :index="index"
      :images="images"
      @changePreview="changePreview"
      @onClose="onClose"
    ></img-save>
  </div>
</template>

<script>
  import {
    followupQueryPlanDetails, getPatientListByFlockId,
    performFollowupPlan
  } from "../../api/followUp";
import { getSysCodeByType } from "../../api/scale";
import imgSave from "@/common/imgSave";
import ossUpDown from "../../utils/ossUpDown";
  import myJsTools from "../../utils/myJsTools";
  import eschatUnit from "../../utils/eschat";
export default {
  name: "plandetailCom",
  props: {
    id: String,
    type: {
      default: "default",
      type: String
    },
    plsId: {
      default: 0,
      type: Number
    }
  },
  components: { imgSave },
  data() {
    return {
      active: 0,
      planName: "",
      memo: "",
      planContent: "",
      repetitionPeriodName: "",
      planImg: "",
      planId: "",
      patientNames: "",
      lineCard: "",
      flockId: "",
      didOnlyId: "",
      visitRealType: "",
      didTitle: "",
      showImgPic:false,
      index:0,
      images:[],
      planTime: "" //随访计划日期
    };
  },
  created() {
    this.getDetail();
  },
  methods: {
    // 点击查看图片
    lookImg(imgUrl) {
      this.showImgPic = true;
      this.images = [imgUrl];
    },
    //保存图片到本地
    changePreview(index) {
      this.index = index;
    },
    //关闭图片查看
    onClose() {
      this.showImgPic = false;
    },
    //获取随访详情
    getDetail() {
      let me = this;
      followupQueryPlanDetails({
        id: this.id
      }).then(async res => {
        console.log(res);
        let data = res.data;
        this.planName = data.planName;
        this.didTitle = data.didName;
        this.memo = data.memo;
        this.flockId = data.flockId;
        this.planContent = data.planContent;
        this.planTime = data.planTime;
        this.planId = data.planId;
        this.didOnlyId = data.didOnlyId;
        this.patientNames = data.patientNames;
        this.visitRealType = data.visitRealType;
        if (data.visitRealType == "1") {
          this.lineCard = "线上出诊表";
        } else if (data.visitRealType == "2") {
          this.lineCard = "线下出诊表";
        }
        if (data.planImg) {
          this.planImg =  data.planImg;
        }
        this.getRepeatList(data.repetitionPeriod);
      });
    },
    //获取重复周期列表
    getRepeatList(repetitionPeriod) {
      getSysCodeByType({
        codeType: "004"
      }).then(res => {
        let data = res.data;
        for (let i = 0; i < data.length; i++) {
          if (repetitionPeriod == data[i].code) {
            this.repetitionPeriodName = data[i].meaning;
          }
        }
      });
    },
    openVisit() {
      let param = {
        type: "look" //只查看
      };
      if (this.visitRealType == 1) {
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
    //编辑随访计划
    editPlan() {
      this.$router.push({
        name: "addFollowUp",
        query: {
          planId: this.planId
        }
      });
    },
    // 量表详情
    openScalDetail() {
      this.$router.push({
        name: "sendScaleDetail",
        query: {
          didOnlyId: this.didOnlyId,
          type: "look"
        }
      });
    },
    openList() {
      this.$router.push({
        name: "followPatientList",
        query: {
          flockId: this.flockId
        }
      });
    },
    // 获取发送人UserId
    getUserId(){
      getPatientListByFlockId({
        flockId: this.flockId,
        docId: myJsTools.getItem("token_info").docId
      }).then(res=>{
        console.log(JSON.stringify(res));
        let  ext = {
          type:"sfjh",
          plsId:this.plsId,
          title: this.planName,
        }
        res.data.map(item=>{
          console.log(JSON.stringify(item));
          if(item.isStop != '1'){
            console.log("sddddddddddddd")
            eschatUnit.sendMsg(
              "[随访计划]",
              myJsTools.getItem("token_info").docId,
              item.patientId,
              item.userId,
              ext
            );
          }
        })
        this.$router.go(-1);
      })
    },
    //执行随访计划
    carriedPlan: function() {
      performFollowupPlan({
        id: this.plsId
      }).then(res => {
        console.log(res);
        this.getUserId();
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
    li:first-child {
      font-weight: 600;
    }
    .selectImg {
      width: 100px;
      height: 100px;
      border-radius: 8px;
      margin-top: 12px;
    }
    .selectInfo {
      margin-top: 5px;
      .display-div;
      .black-font;
      .font-size-md;
      line-height: 22px;

      .deleteIcon {
        position: absolute;
        right: -4px;
        top: -4px;
        height: 16px;
        width: 16px;
      }
      u:first-child {
        .div-overflow;
        width: 90%;
        display: flex;
        align-items: center;
      }
    }
    li {
      line-height: 22px;
      .black-font;
      .font-size-md;
    }
    /deep/.van-cell {
      padding: 5px 0px 0px 0px;
      .font-size-md;
      line-height: 18px;
    }
  }
  .content {
    /deep/.van-cell {
      padding: 12px;
      border: 1px solid @back-border;
      margin-top: 12px;
      border-radius: 4px;
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
      border-radius: 4px;
    }
    .icon-width-height-sm-16 {
      margin-right: 6px;
    }
  }
}
</style>
