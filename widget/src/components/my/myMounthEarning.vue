<template>
  <div>
    <navbar title="我的收益"></navbar>
    <div>
      <div class="vanTabChild">
        <div class="topTj" v-if="earNingList.length > 0">
          <div
            id="allEarningImg"
            :style="{ width: '100%', 'min-height': '350px' }"
          ></div>
        </div>
        <div class="topTj">
          <div id="mouhthImg" :style="{ width: '100%', height: '400px' }"></div>
          <div class="btns">
            <button :class="active == 0 ? 'active' : ''" @click="changeBtn(0)">
              最近一周
            </button>
            <button :class="active == 1 ? 'active' : ''" @click="changeBtn(1)">
              最近3天
            </button>
            <button :class="active == 2 ? 'active' : ''">
              <span @click.stop="openTimeSelect('startTime')">{{
                startTime
              }}</span>
              <span style="margin: 0 5px">|</span>
              <span @click.stop="openTimeSelect('endTime')">{{ endTime }}</span>
            </button>
          </div>
          <van-popup position="bottom" class="pikerBottom" v-model="timeShow">
            <van-datetime-picker
              v-model="currentDate"
              type="date"
              title="选择年月"
              :min-date="minDate"
              :max-date="maxDate"
              @confirm="confirmDate"
            />
          </van-popup>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Navbar from "../../common/navbar";
import { getDocDayProfit, getDocTotalProfit } from "../../api/order";
import myJsTools from "../../utils/myJsTools";
import echarts from "echarts";
import date from "../../utils/date";
import { Toast } from "vant";
export default {
  name: "myMounthEarning",
  components: { Navbar },
  data() {
    return {
      mounthList: {},
      earNingList: [],
      time: "",
      active: 0,
      startTime: "",
      endTime: "",
      maxDate: "",
      currentDate: "",
      timeShow: false,
      selectTimeType: "",
      minDate: "",
      type: "" //now 当月  before  之前的
    };
  },
  created() {
    this.time = this.$route.query.time;
  },
  mounted() {
    this.getMounthEarning();
    let lastDate = this.time.split("-");
    let nowDate = date.getFormatDate("-");
    let nowMounth = nowDate.split("-")[0] + "-" + nowDate.split("-")[1];
    if (this.time == nowMounth) {
      this.maxDate = this.currentDate = new Date(
        nowDate.split("-")[0],
        parseInt(nowDate.split("-")[1]) - 1,
        nowDate.split("-")[2]
      );
      this.endTime = nowDate;
      this.type = "now";
    } else {
      var myDate = new Date(lastDate[0], lastDate[1], 0);
      this.maxDate = this.currentDate = new Date(
        lastDate[0],
        parseInt(lastDate[1]) - 1,
        myDate.getDate()
      );
      this.endTime = date.getNowDate(this.time + "-" + myDate.getDate());
      this.type = "before";
    }
    this.minDate = new Date(lastDate[0], parseInt(lastDate[1]) - 1, 1);
    this.changeBtn(0);
  },
  methods: {
    changeBtn(active) {
      this.active = active;
      if (active == 0) {
        this.startTime = date
          .dateDif(this.endTime, 6 * 24 * 3600 * 1000)
          .split(" ")[0];
      } else if (active == 1) {
        this.startTime = date
          .dateDif(this.endTime, 2 * 24 * 3600 * 1000)
          .split(" ")[0];
      }
      this.getDayList();
    },
    confirmDate(val) {
      if (this.selectTimeType == "startTime") {
        this.startTime = date.getNowDate(val);
        if (this.endTime) {
          let result = date.getDays(this.startTime, this.endTime);
          if (result.length > 7) {
            this.endTime = date.mounthDayDif(
              this.startTime,
              7 * 24 * 3600 * 1000
            );
          }
        }
        if (this.startTime > this.endTime) {
          Toast("开始时间不能大于结束时间");
          return false;
        }
      } else {
        let time = date.getNowDate(val);
        let result = date.getDays(this.startTime, time);
        if (time < this.startTime) {
          Toast("结束时间不能小于开始时间");
          return false;
        }
        if (result.length > 7) {
          Toast("请选择7天之内");
          return false;
        }
        this.endTime = time;
      }
      this.timeShow = false;
      this.getDayList();
    },
    openTimeSelect(type) {
      this.selectTimeType = type;
      this.timeShow = true;
    },
    drawEarAll() {
      let myChart = echarts.init(document.getElementById("allEarningImg"));
      console.log(myChart);
      let bgColor = "#fff";
      let title = "总费用";
      let color = [
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
      ];
      let echartData = this.earNingList;
      let scale = 1;
      let legendData1 = [];
      this.earNingList.map(item => {
        legendData1.push(item.bussTypeName);
      });
      let option = {
        backgroundColor: bgColor,
        color: color,
        legend: [
          {
            icon: "square",
            left: "5%",
            align: "left",
            bottom: "0",
            itemGap: 20,
            // bottom:'50%',
            textStyle: {
              fontSize: 14,
              color: "#AAAAAA"
            },
            data: legendData1
          }
        ],
        title: [
          {
            text:
              "{name|" +
              title +
              "}\n{val|" +
              this.earNingList[0].profitTotal +
              "}",
            top: "center",
            left: "46%",
            textStyle: {
              rich: {
                name: {
                  fontSize: 14,
                  fontWeight: "normal",
                  color: "#666666",
                  padding: [10, 0]
                },
                val: {
                  fontSize: 14,
                  fontWeight: "bold",
                  color: "#333333"
                }
              }
            }
          },
          {
            text:
              this.type == "now" ? "预计销售分类总览饼图" : "销售分类总览饼图",
            top: 0,
            left: 0,
            textStyle: {
              fontSize: 14,
              color: "#333333",
              fontWeight: 600
            }
          }
        ],
        series: [
          {
            type: "pie",
            radius: ["35%", "50%"],
            center: ["55%", "50%"],
            data: echartData,
            hoverAnimation: false,
            itemStyle: {
              normal: {
                borderColor: bgColor,
                borderWidth: 2
              }
            },
            labelLine: {
              normal: {
                length: 10,
                length2: 20
              }
            },
            label: {
              normal: {
                formatter: params => {
                  var total = 0; //考生总数量
                  var percent = 0; //考生占比
                  echartData.forEach(function(value, index, array) {
                    total += value.value;
                  });
                  let val = "";
                  val = myJsTools.unitConvert(params.value);
                  percent = ((params.value / total) * 100).toFixed(1);
                  return params.name + "\n\n" + percent + "%(" + val + ")";
                }
              }
            }
          }
        ]
      };
      myChart.setOption(option);
    },
    drawMounthData() {
      var fontColor = "#30eee9";
      // 测试数据
      console.log(this.mounthList);
      var data_date = this.mounthList.result; // 日期
      let series = [];
      let color = [
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
      ];
      this.mounthList.data.map((item, index) => {
        series.push({
          name: item.bussTypeName,
          type: "line",
          symbol: "circle",
          symbolSize: 8,
          label: {
            normal: {
              show: true,
              position: "top"
            }
          },
          itemStyle: {
            normal: {
              color: color[index],
              lineStyle: {
                color: color[index],
                width: 1
              }
            }
          },
          data: item.labelData
        });
      });
      var myChart = echarts.init(document.getElementById("mouhthImg"));
      let option = {
        backgroundColor: "#fff",
        title: {
          text:
            this.type == "now" ? "预计销售月合计趋势图" : "销售月合计趋势图",
          left: "left",
          textStyle: {
            color: "#333",
            align: "center",
            fontSize: 14
          }
        },
        grid: {
          left: "5%",
          right: "10%",
          top: "35%",
          bottom: "15%",
          containLabel: true
        },
        tooltip: {
          show: true,
          trigger: "item"
        },
        legend: {
          show: true,
          x: "right",
          y: "20%",
          icon: "stack",
          itemWidth: 10,
          itemHeight: 10,
          textStyle: {
            color: "#333"
          },
          data: this.mounthList.label
        },
        xAxis: [
          {
            type: "category",
            boundaryGap: false,
            axisLabel: {
              color: "#333"
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: "#397cbc"
              }
            },
            axisTick: {
              show: false
            },
            splitLine: {
              show: false,
              lineStyle: {
                color: "#195384"
              }
            },
            data: data_date
          }
        ],
        yAxis: [
          {
            type: "value",
            name: "",
            min: 0.0,
            // max: 50.0,
            axisLabel: {
              formatter: "{value}",
              textStyle: {
                color: "#333"
              }
            },
            axisLine: {
              lineStyle: {
                color: "#333"
              }
            },
            axisTick: {
              show: false
            },
            splitLine: {
              show: true,
              lineStyle: {
                color: "#fff"
              }
            }
          }
        ],
        series: series
      };
      myChart.setOption(option);
    },
    getMounthEarning() {
      getDocTotalProfit({
        docId: myJsTools.getItem("token_info").docId,
        settlementMonth: this.time
      }).then(res => {
        console.log(res);
        let data = res.data;
        data.map(item => {
          item.name = item.bussTypeName;
          item.value = item.profitMoney;
        });
        this.earNingList = data;
        setTimeout(() => {
          this.drawEarAll();
        }, 500);
      });
    },
    getDayList() {
      getDocDayProfit({
        docId: myJsTools.getItem("token_info").docId, //myJsTools.getItem("token_info").docId
        startTime: this.startTime,
        endTime: this.endTime
      }).then(res => {
        console.log(res);
        let result = date.getDays(this.startTime, this.endTime);
        let data = res.data;
        let resultData = [],
          dateArr = [],
          label = [];
        result.map(mounthData => {
          resultData.push({
            fsTime: mounthData,
            profitMoney: 0
          });
          dateArr.push(mounthData.split("-")[2]);
        });
        data.map(item => {
          label.push(item.bussTypeName);
          item.labelData = [];
          resultData.map((item1, index) => {
            item.docMonthProfitMoneyVO.map(item2 => {
              if (item1.fsTime == item2.fsTime) {
                item1.profitMoney = item2.profitMoney;
              }
            });
          });
          resultData.map(item1 => {
            item.labelData.push(item1.profitMoney);
          });
        });
        console.log(data);
        this.mounthList = {
          result: dateArr,
          data: data,
          label: label
        };
        setTimeout(() => {
          this.drawMounthData();
        }, 500);
      });
    }
  }
};
</script>

<style scoped lang="less">
.vanTabChild {
  padding: 12px 16px;
}
.topTj {
  position: relative;
  padding: 12px;
  margin-top: 12px;
  background: @white;
  align-items: center;
  border-radius: 8px;
  .bottomTj {
    margin-top: 35px;
    li {
      .black-font;
      .font-size-md;
      margin-top: 4px;
      display: flex;
      align-items: center;
      line-height: 22px;
    }
    .colorSpan {
      width: 14px;
      height: 14px;
      display: inline-block;
      background-color: @blue;
      border-radius: 4px;
      margin-right: 4px;
    }
  }
}

.btns {
  position: absolute;
  top: 11%;
  display: flex;
  right: 12px;
  font-size: 10px;

  button {
    background: @page-back;
    line-height: 24px;
    padding: 0 8px;
    .font-login-color;
    margin-left: 8px;
    border-radius: 8px;
  }

  .active {
    background: @blue;
    .white-font;
  }
}
</style>
