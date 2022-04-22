<template>
  <div class="historyDetail">
    <navbar :title="title"></navbar>
    <van-tabs
      v-model="active"
      title-inactive-color="#666666"
      title-active-color="#14A0E6"
      color="#14A0E6"
      @change="changeTab"
    >
      <van-tab title="患者">
        <patient-list :sendId="sendId"></patient-list>
      </van-tab>
      <van-tab title="统计">
        <div
          class="statisticsList"
          v-for="(item, index) in topList"
          :key="index"
        >
          <div
            class="statistics"
            v-if="
              item.didtType == '1' ||
                item.didtType == '2' ||
                item.didtType == '4'
            "
          >
            <li class="title">
              <u class="black-font">{{ index + 1 }}.{{ item.didtName }}</u>
              <u class="font-login-color">共{{ item.answerNum }}人答题</u>
            </li>
            <div
              :id="item.didtId + index"
              :style="{ width: '100%', height: '300px' }"
            ></div>
            <div class="optDetails">
              <van-row class="optTitle">
                <van-col span="14">
                  <span class="line"></span>
                  <span>选项</span>
                </van-col>
                <van-col span="10">
                  <span class="line"></span>
                  <span>回复情况</span>
                </van-col>
              </van-row>
              <van-row
                class="opts"
                v-for="(optItem, optIndex) in item.statisticsInfo"
                :key="optIndex"
              >
                <van-col span="14">
                  {{ optItem.optionName }}
                </van-col>
                <van-col span="10" class="optNum">
                  {{ optItem.optionAnswerNum }}
                </van-col>
              </van-row>
            </div>
          </div>
          <div
            class="statistics"
            v-if="
              item.didtType == '3' ||
                item.didtType == '5' ||
                item.didtType == '7' ||
                item.didtType == '8'
            "
          >
            <li class="title">
              <u class="black-font">{{ index + 1 }}.{{ item.didtName }}</u>
              <u class="font-login-color">共{{ item.answerNum }}人答题</u>
            </li>
            <div class="content" @click="getPatientList(item)">
              <u>{{ item.answerNum }}人回答</u>
              <u
                ><img src="../../assets/img/scale/right.png" class="rightIcon icon-width-height-sm-16"
              /></u>
            </div>
          </div>
          <div class="statistics" v-if="item.didtType == '6'">
            <li class="title">
              <u class="black-font">{{ index + 1 }}.{{ item.didtName }}</u>
              <u class="font-login-color">共{{ item.answerNum }}人答题</u>
            </li>
            <li class="pjf">平均分</li>
            <li class="num">{{ item.avgScore }}分</li>
            <div class="startList">
              <li
                v-for="(optItem, optIndex) in item.numList"
                :key="optIndex"
                @click="getPatientList(item, optItem)"
                :class="optItem.optionAnswerNum != '0' ? 'active' : ''"
              >
                <u>{{ optItem.optionCode }}分</u>
                <u>{{ optItem.optionAnswerNum }}人</u>
              </li>
            </div>
          </div>
        </div>
      </van-tab>
    </van-tabs>
    <van-popup v-model="show" round class="listPopup">
      <li class="title">人数（{{ patientList.length }}）</li>
      <li v-for="(item, index) in patientList" :key="index" class="patientLi">
        <img v-zlazy="item.patientImg" class="headImg img-width-height-spe" />
        <span>{{ item.patientName }}</span>
      </li>
    </van-popup>
  </div>
</template>

<script>
import Navbar from "../../common/navbar";
import $api from "../../utils/api";
import PatientList from "./patientList";
import {
  getAnswerPatient,
  getInquiringDiagnosisStatistics
} from "../../api/scale";
import ossUpDown from "../../utils/ossUpDown";
import myJsTools from "../../utils/myJsTools";
//在组件引入基本模板
let echarts = require("echarts/lib/echarts");
//在组件引入柱状图组件
require("echarts/lib/chart/pie");

export default {
  name: "historyDetail",
  data() {
    return {
      active: 0,
      sendId: "",
      topList: [],
      show: false,
      title: "",
      patientList: []
    };
  },
  components: { PatientList, Navbar },
  created() {
    this.sendId = this.$route.query.sendId;
    this.title = this.$route.query.title || "历史";
  },
  mounted() {},
  methods: {
    changeTab(val) {
      if (this.active == 1) {
        this.$nextTick(() => {
          this.getTopicTotal();
        });
      }
    },
    getPatientList(item, optItem) {
      let param = {
        sendId: this.sendId,
        didtId: item.didtId,
        didtType: item.didtType
      };
      if (optItem && optItem.optionAnswerNum > 0) {
        param.optionCode = optItem.optionCode;
      }
      getAnswerPatient(param).then(async res => {
        console.log(res);
        this.show = true;
        this.patientList = res.data;
      });
    },
    getTopicTotal() {
      getInquiringDiagnosisStatistics({
        sendId: this.sendId
      }).then(res => {
        console.log(res);
        let data = res.data;
        for (let i = 0; i < data.length; i++) {
          const ele = data[i];

          if (ele.statisticsInfo) {
            ele.statisticsInfo = JSON.parse(ele.statisticsInfo);
            if (
              ele.didtType == "1" ||
              ele.didtType == "2" ||
              ele.didtType == "4"
            ) {
              let s = setTimeout(() => {
                this.drawLine(
                  ele.didtId + i,
                  ele.statisticsInfo,
                  ele.didtType,
                  ele.didtId
                );
                clearTimeout(s);
              }, 500);
            }
            if (ele.didtType == "6") {
              ele.numList = [
                {
                  optionCode: "1",
                  optionAnswerNum: 0
                },
                {
                  optionCode: "2",
                  optionAnswerNum: 0
                },
                {
                  optionCode: "3",
                  optionAnswerNum: 0
                },
                {
                  optionCode: "4",
                  optionAnswerNum: 0
                },
                {
                  optionCode: "5",
                  optionAnswerNum: 0
                }
              ];
              for (let j = 0; j < ele.statisticsInfo.length; j++) {
                const num = ele.statisticsInfo[j];
                ele.numList[parseInt(num.optionCode) - 1].optionAnswerNum =
                  num.optionAnswerNum;
              }
              console.log(ele.numList);
            }
          }
        }

        this.topList = data;
      });
    },
    drawLine(id, statisticsInfo, didtType, didtId) {
      for (let i = 0; i < statisticsInfo.length; i++) {
        statisticsInfo[i].name = statisticsInfo[i].optionName;
        statisticsInfo[i].value = statisticsInfo[i].optionAnswerNum;
      }
      // 基于准备好的dom，初始化echarts实例
      console.log(id);
      console.log($api.byId(id));
      var myChart = echarts.init(document.getElementById(id));
      // 绘制图表
      let option = {
        tooltip: {
          trigger: "item",
          formatter: "{a|{a}}{abg|}\\n{hr|}\\n  {b|{b}：}{c}  {per|{d}%}"
        },
        legend: {
          orient: "vertical",
          data: ["直接访问", "邮件营销", "联盟广告", "视频广告", "搜索引擎"]
        },
        series: [
          {
            name: "访问来源",
            type: "pie",
            radius: ["30%", "50%"],
            avoidLabelOverlap: false,
            top: "14",
            label: {
              position: "outer",
              alignTo: "none",
              bleedMargin: 5
            },
            labelLine: {
              smooth: 0,
              length: 10,
              length2: 25
            },
            // 全局的颜色
            color: [
              "#1890FF",
              "#00C06F",
              "#FECA0A",
              "#F66D51",
              "#7D6AFF",
              "#5BCFFF",
              "#5DABFC",
              "#60DBB1",
              "#2FA3A2",
              "#FFB75B",
              "#F1954C",
              "#D8D8D8"
            ],
            data: statisticsInfo
          }
        ]
      };
      myChart.setOption(option);
      let me = this;
      myChart.on("click", pieConsole);
      function pieConsole(param) {
        let item = {
            didtId: didtId,
            didtType: didtType
          },
          optItem = {
            optionCode: param.data.optionCode,
            optionAnswerNum: param.data.optionAnswerNum
          };
        me.getPatientList(item, optItem);
      }
    }
  }
};
</script>

<style scoped lang="less">

.listPopup {
  width: 80%;
  padding: 12px 16px;
  max-height: 60vh;
  .title {
    font-weight: 600;
    .font-blod-2;
    .black-font;
    .font-size-lg;
    line-height: 22px;
    text-align: center;
    padding-bottom: 12px;
  }
  .patientLi {
    display: flex;
    align-items: center;
    padding: 14px 0;
    .black-font;
    .font-size-md;
    line-height: 20px;
    .headImg {
      margin-right: 16px;
    }
  }
}
.statisticsList {
  padding: 0 16px 12px 16px;
  .statistics {
    margin-top: 12px;
    border-radius: 8px;
    background: @white;
    padding: 12px;
    .title {
      justify-content: space-between;
      .font-blod-2;
      .font-size-md;
      line-height: 22px;
      :nth-child(1) {
        width: 72%;
      }
    }
    .content {
      padding: 10px 12px;
      .font-login-color;
      .font-size-md;
      line-height: 22px;
      border: 1px solid @back-border;
      border-radius: 4px;
      margin-top: 12px;
      position: relative;
      img {
        position: absolute;
        right: 16px;
        top: 14px;
      }
    }
    .optDetails {
      .black-font;
      .font-size-md;
      line-height: 22px;
      .optTitle {
        align-items: center;
        .font-blod-2;
      }
      .opts {
        padding-left: 14px;
        margin-top: 10px;
        .optNum {
          padding-left: 10px;
        }
      }
      .line {
        width: 3px;
        height: 12px;
        margin-right: 8px;
        border-radius: 1px;
        display: inline-block;
        background: @blue;
      }
    }
    .pjf {
      padding-left: 12px;
      padding-top: 10px;
      .font-login-color;
      .font-size-sm;
      line-height: 22px;
    }
    .num {
      .black-font;
      .font-size-md;
      .font-blod-2;
      line-height: 22px;
      margin-top: 3px;
      padding-left: 12px;
    }
    .startList {
      li {
        background: @page-back;
        .white-font;
        .font-size-md;
        line-height: 20px;
        padding: 7px 14px;
        margin-top: 12px;
        justify-content: space-between;
        border-radius: 4px;
        :nth-child(1) {
          width: 87%;
        }
      }
      .active {
        background: @blue;
      }
    }
  }
}
</style>
