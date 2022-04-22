<template>
  <div>
    <navbar title="我的统计"></navbar>
    <div>
      <div class="vanTabChild">
        <div class="topTj">
          <li class="display-div">
            <u class="black-font font-size-md">总销售</u>
            <u class="font-login-color-blue font-size-lg-2 font-blod-2">{{
              profit.actualTotalMoney
            }}</u>
          </li>
          <div class="profitDiv">
            <div>
              <li class="font-size-sm">已结算</li>
              <li class="font-size-lg-2">{{ profit.actualSettledMoney }}</li>
            </div>
            <span class="line"></span>
            <div>
              <li class="font-size-sm">待结算</li>
              <li class="font-size-lg-2">{{ profit.actualUnsettledMoney }}</li>
            </div>
          </div>
        </div>
        <div class="topTj">
          <div
            id="allEarningImg"
            :style="{ width: '100%', 'min-height': '350px' }"
          ></div>
        </div>
        <div class="topTj">
          <div
            id="mouhthImg"
            :style="{ width: '100%', 'min-height': '400px' }"
          ></div>
          <div class="btns">
            <button :class="active == 0 ? 'active' : ''" @click="changeBtn(0)">
              最近半年
            </button>
            <button :class="active == 1 ? 'active' : ''" @click="changeBtn(1)">
              最近3月
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
              type="year-month"
              title="选择年月"
              @confirm="confirmDate"
              :formatter="formatter"
              :maxDate="maxDate"
            />
          </van-popup>
        </div>
      </div>
    </div>
    <div class="btndiv">
      <div class="detailBtn font-login-color-blue" @click="openDetail">
        查看销售明细
      </div>
    </div>
  </div>
</template>

<script>
import Navbar from "../../common/navbar";
import {
  getDocDayProfit,
  getDocMonthProfit,
  getDocMonthProfitDetail,
  getDocTotalProfit,
  getDocUnsettledAndSettledMoneyProfit
} from "../../api/order";
import myJsTools from "../../utils/myJsTools";
import echarts from "echarts";
import date from "../../utils/date";
import { Toast } from "vant";
export default {
  name: "myEarnings",
  components: { Navbar },
  data() {
    return {
      mounthList: {},
      earNingList: [],
      active: 0,
      startTime: "",
      endTime: "",
      maxDate: "",
      currentDate: "",
      timeShow: false,
      selectTimeType: "",
      profit: {}
    };
  },
  mounted() {
    this.getMyEarnings();
    this.getProfit();
    this.changeBtn(0);
    let lastDate = date.getLastMouth().split("-");
    this.maxDate = this.currentDate = new Date(
      lastDate[0],
      parseInt(lastDate[1]) - 1,
      1
    );
  },
  methods: {
    getProfit() {
      getDocUnsettledAndSettledMoneyProfit({
        docId: myJsTools.getItem("token_info").docId
      }).then(res => {
        res.data.actualTotalMoney = myJsTools.unitConvert(
          res.data.actualTotalMoney
        );
        res.data.actualUnsettledMoney = myJsTools.unitConvert(
          res.data.actualUnsettledMoney
        );
        res.data.actualSettledMoney = myJsTools.unitConvert(
          res.data.actualSettledMoney
        );
        this.profit = res.data;
      });
    },
    formatter(type, val) {
      if (type === "year") {
        return `${val}年`;
      } else if (type === "month") {
        return `${val}月`;
      }
      return val;
    },
    changeBtn(active) {
      this.active = active;
      if (this.time) {
        if (active == 0 || active == 1) {
          this.startTime = date.getPastHalfYear(this.active + 1);
          this.endTime = date.getLastMouth();
          console.log(this.startTime, this.endTime);
        }
        this.getMouhthList();
      } else {
        if (active == 0 || active == 1) {
          this.startTime = date.getPastHalfYear(this.active + 1);
          this.endTime = date.getLastMouth();
          console.log(this.startTime, this.endTime);
        }
        this.getMouhthList();
      }
    },
    confirmDate(val) {
      if (this.selectTimeType == "startTime") {
        this.startTime =
          date.getNowDate(val).split("-")[0] +
          "-" +
          date.getNowDate(val).split("-")[1];

        if (this.endTime) {
          let result = date.getMounth(this.startTime, this.endTime);
          if (result.length > 6) {
            this.endTime = date.mounthDif(
              this.startTime,
              6 * 30 * 24 * 3600 * 1000
            );
          }
        }
        if (this.startTime > this.endTime) {
          Toast("开始时间不能大于结束时间");
          return false;
        }
      } else {
        let time =
          date.getNowDate(val).split("-")[0] +
          "-" +
          date.getNowDate(val).split("-")[1];
        let result = date.getMounth(this.startTime, time);
        console.log(time < this.startTime, result);
        if (time < this.startTime) {
          Toast("结束时间不能小于开始时间");
          return false;
        }
        if (result.length > 6) {
          Toast("请选择六个月之内");
          return false;
        }
        this.endTime = time;
      }
      this.timeShow = false;
      this.getMouhthList();
    },
    openTimeSelect(type) {
      this.selectTimeType = type;
      this.timeShow = true;
    },
    getMyEarnings() {
      getDocTotalProfit({
        docId: myJsTools.getItem("token_info").docId
      }).then(res => {
        console.log(JSON.stringify(res));
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
      let option;
      if (this.earNingList.length == 0) {
        option = {
          title: [
            {
              text: "暂无数据",
              x: "center",
              y: "center",
              textStyle: {
                color: "#666",
                fontWeight: "normal",
                fontSize: 12
              }
            },
            {
              text: "销售分总览饼图",
              top: 0,
              left: 0,
              textStyle: {
                fontSize: 14,
                color: "#333333",
                fontWeight: 600
              }
            }
          ]
        };
      } else {
        option = {
          backgroundColor: bgColor,
          color: color,
          legend: [
            {
              // orient: 'vertical',
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
              align: "center",
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
              text: "销售分类总览饼图",
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
      }
      myChart.setOption(option);
    },
    getMouhthList() {
      let firstArr = [],
        endArr = [];
      getDocMonthProfit({
        docId: myJsTools.getItem("token_info").docId,
        startTime: this.startTime,
        endTime: this.endTime
      }).then(res => {
        let result = date.getMounth(this.startTime, this.endTime);
        let data = res.data;
        let resultData = [],
          dateArr = [],
          label = [];
        result.map(mounthData => {
          resultData.push({
            fsTime: mounthData,
            profitMoney: 0
          });
          dateArr.push(mounthData.split("-")[1] + "月");
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
          text: "销售月合计趋势图",
          left: "left",
          textStyle: {
            color: "#333",
            align: "center",
            fontSize: 14,
            fontWeight: 600
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
              formatter: "{value}元",
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
    openDetail() {
      this.$router.push({
        name: "myEarningDetail"
      });
    }
  }
};
</script>

<style scoped lang="less">
.profitDiv {
  display: flex;
  align-items: center;
  margin-top: 40px;
  div {
    text-align: center;
    flex: 1;
  }
  .line {
    display: inline-block;
    width: 3px;
    height: 20px;
    background: @back-border;
  }
}

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
.btndiv {
  background: #fff;
  padding: 8px;
}
.detailBtn {
  background: @blue;
  font-size: 16px;
  color: @white;
  line-height: 40px;
  width: 98%;
  text-align: center;
  border-radius: 16px;
  padding: 5px 0;
  margin: 0 auto;
  border: 1px solid @blue;
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
