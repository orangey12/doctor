<template>
  <div class="detailCom">
    <navbar title="随访计划详情"></navbar>
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
      <div class="patient" @click="openScale" v-if="didOnlyId">
        <li>统计</li>
        <li class="selectInfo">
          <u>
            已发送人数
          </u>
          <u>{{ numberOf }}</u>
        </li>
        <li class="selectInfo">
          <u>
            已触达人数
          </u>
          <u>{{ touchUpToNumberOf }}</u>
        </li>
        <li class="selectInfo">
          <u>
            已反馈人数
          </u>
          <u>{{ numberOfFeedback }}</u>
        </li>
      </div>
      <div class="patient" v-if="patientNames" @click="openList">
        <li>患者</li>
        <li class="selectInfo">
          <u>
            <span>{{ patientNames }}</span>
          </u>
          <u><img src="../../assets/img/follow/right.png" class="addIcon"/></u>
        </li>
      </div>
      <div class="picture" v-if="planImg">
        <li>照片</li>
        <img v-zlazy="planImg" class="selectImg" />
      </div>
      <div class="scale" v-if="didTitle" @click="openScalDetail">
        <li>量表</li>
        <li class="selectInfo">
          <u>
            {{ didTitle }}
          </u>
          <u><img src="../../assets/img/follow/right.png" class="addIcon"/></u>
        </li>
      </div>
      <div class="lineCard" v-if="lineCard" @click="openVisit">
        <li>出诊表</li>
        <li class="selectInfo">
          <u>
            {{ lineCard }}
          </u>
          <u><img src="../../assets/img/follow/right.png" class="addIcon"/></u>
        </li>
      </div>
      <div class="dateTime">
        <li>随访时间</li>
        <li class="selectInfo">
          <u>
            {{ planTime }}
          </u>
        </li>
      </div>
      <div class="dateTime">
        <li>执行时间</li>
        <li class="selectInfo">
          <u>
            <span>{{ sendTime }}</span>
          </u>
        </li>
      </div>
      <div class="memo">
        <li>备注</li>
        <van-field v-model="memo" disabled placeholder="请输入备注" />
      </div>
    </div>
  </div>
</template>

<script>
import {
  followupQueryPlanImplementationDetails,
  performFollowupPlan
} from "../../api/followUp";
import { getSysCodeByType } from "../../api/scale";
import ossUpDown from "../../utils/ossUpDown";
import Navbar from "../../common/navbar";
import myJsTools from "../../utils/myJsTools";

export default {
  name: "hascarriedPlan",
  components: { Navbar },
  data() {
    return {
      planName: "",
      memo: "",
      planContent: "",
      planImg: "",
      planId: "",
      patientNames: "",
      lineCard: "",
      flockId: "",
      id: "",
      sendTime: "",
      numberOf: "",
      numberOfFeedback: "",
      touchUpToNumberOf: "",
      didOnlyId: "",
      visitRealType: "",
      didTitle: "",
      sendId: "",
      planTime: "" //随访计划日期
    };
  },
  created() {
    this.id = this.$route.query.plsId;
    this.getDetail();
  },
  methods: {
    //获取随访详情
    getDetail() {
      let me = this;
      followupQueryPlanImplementationDetails({
        id: this.id
      }).then(async res => {
        console.log(res);
        let data = res.data;
        this.planName = data.planName;
        this.memo = data.memo;
        this.didTitle = data.didName;
        this.flockId = data.flockId;
        this.planContent = data.sendContent;
        this.planTime = data.planTime;
        this.sendTime = data.sendTime;
        this.didOnlyId = data.didOnlyId;
        this.planId = data.planId;
        this.numberOf = data.numberOf;
        this.didTitle = data.didName;
        this.visitRealType = data.visitRealType;
        this.touchUpToNumberOf = data.touchUpToNumberOf;
        this.numberOfFeedback = data.numberOfFeedback;
        this.patientNames = data.patientNames;
        this.sendId = data.sendId;
        if (data.visitRealType == "1") {
          this.lineCard = "线上出诊表";
        } else if (data.visitRealType == "2") {
          this.lineCard = "线下出诊表";
        }
        if (data.planImg) {
          this.planImg = data.planImg;
        }

      });
    },
    openScale() {
      this.$router.push({
        name: "historyDetail",
        query: {
          sendId: this.sendId,
          title: "量表详情"
        }
      });
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
    openList() {
      this.$router.push({
        name: "followPatientList",
        query: {
          flockId: this.flockId
        }
      });
    },
    // 量表详情
    openScalDetail() {
      this.$router.push({
        name: "sendScaleDetail",
        query: {
          sendId: this.sendId,
          type: "look"
        }
      });
    },
    //执行随访计划
    carriedPlan: function() {
      performFollowupPlan({
        id: this.plsId
      }).then(res => {
        console.log(res);
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
    .selectImg {
      width: 100px;
      height: 100px;
      border-radius: 8px;
      margin-top: 12px;
    }
    .selectInfo {
      margin-top: 5px;
      justify-content: space-between;
      align-items: center;
      display: flex;
      color: #333333;
      font-size: 14px;
      line-height: 22px;

      .deleteIcon {
        position: absolute;
        right: -4px;
        top: -4px;
        height: 16px;
        width: 16px;
      }
      u:first-child {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        width: 90%;
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
      border: 1px solid #d5d5d5;
      margin-top: 12px;
    }
  }
  .picture,
  .scale,
  .lineCard,
  .dateTime,
  .repeatCycle {
    .selectInfo {
      padding: 10px 12px;
      border: 1px solid #d5d5d5;
      margin-top: 12px;
    }
    .imgIcon {
      margin-right: 6px;
    }
  }
}
.editBtn {
  background: #14a0e6;
  line-height: 49px;
  color: #ffffff;
  font-size: 18px;
  width: 100%;
  position: fixed;
  bottom: 0px;
  text-align: center;
}
</style>
