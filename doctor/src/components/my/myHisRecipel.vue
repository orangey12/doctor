<template>
  <div class="drugList" id="drugList">
    <navbar type="defaultPage" title="我的历史处方"></navbar>
    <div class="searchDiv">
      <div class="fieldDiv">
        <van-form action="/">
          <van-search
            v-model="value"
            background="#FFFFFF"
            :left-icon="searchIcon"
            placeholder="请输入想要搜索的内容"
            :clearable="true" @search="onRefresh"
          />
        </van-form>
      </div>

      <span @click="onRefresh" class="font-login-color-blue">搜索</span>
    </div>
    <van-tabs v-model="active" color="#14A0E6" title-active-color="#14A0E6" @change="changTab">

      <van-tab title="处方清单">
        <van-dropdown-menu>
          <van-dropdown-item v-model="selectType" :options="option1" @change="onRefresh"/>
        </van-dropdown-menu>
        <div class="emptyDiv" v-if="historyCfList.length == 0">
          <img src="../../assets/img/cf/cycfEmpty.png" class="emptyIcon"/>
          <li>您暂未历史处方信息</li>
        </div>

        <div v-else class="commonlyCfList">
          <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
            <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoaded">
              <div
                class="commonlyCfCard"
                v-for="(item,index) in historyCfList"
                :key="index"
                @click="openHistoryDrug(item)"
              >
                <li class="title historyTitle">
                  <u>Rp</u>
                  <u>
                    <span v-if="item.prescriptionType == 1">西药方</span>
                    <span v-if="item.prescriptionType == 2">代煎处方</span>
                    <span v-if="item.prescriptionType == 3">草药方</span>
                    <span v-if="item.prescriptionType == 4">食品级</span>
                    <span class="font-login-color-red" v-if="item.status != 6">待核销</span>
                    <span class="font-login-color-blue" v-else>已核销</span>
                  </u>
                </li>
                <li>患者姓名：{{ item.patientName }}</li>
                <li>诊断：{{ item.diagName }}</li>
                <li>开方时间：{{ item.prescriptionTime }}</li>
              </div>
            </van-list>
          </van-pull-refresh>
        </div>
      </van-tab>


      <van-tab title="订单清单">
        <van-dropdown-menu>
          <van-dropdown-item v-model="selectTypeQd" :options="option2" @change="onRefresh"/>
        </van-dropdown-menu>
        <div class="emptyDiv" v-if="historyCfQdList.length == 0">
          <img src="../../assets/img/cf/cycfEmpty.png" class="emptyIcon"/>
          <li>您暂无订单清单信息</li>
        </div>

        <div v-else class="commonlyCfList">
          <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
            <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoaded">
              <div
                class="commonlyCfCard"
                v-for="(item,index) in historyCfQdList"
                :key="index"
                @click="openHistoryQdDrug(item)"
              >
                <li class="title historyTitle">
                  <u>Rp</u>
                  <u>
                    <span class="font-login-color-red" v-if="item.payStatus == 1">待支付</span>
                    <span class="font-login-color-blue" v-if="item.payStatus == 2">已支付</span>
                    <span class="font-login-color-blue" v-if="item.payStatus == 3">已退费</span>
                    <span style="color:#333333;" v-if="item.payStatus == 'a'">线下自主购药</span>
                  </u>
                </li>
                <li>患者姓名：{{ item.patientName }}</li>
                <li>诊断：{{ item.diagNames }}</li>
                <li>开方时间：{{ item.addTime }}</li>
              </div>
            </van-list>
          </van-pull-refresh>
        </div>
      </van-tab>

      <van-tab title="统计">
        <div class="vanTabChild">
          <div class="topTj" v-if="active == 2">
            <div id="topImg" :style="{ width: '100%', height: '400px' }">

            </div>
            <div class="bottomTj" v-if="drygTjData">
              <li><span
                class="colorSpan"></span>西成药：{{ drygTjData.xyPercent }}&nbsp;&nbsp;&nbsp;({{ drygTjData.xyCost }})
              </li>
              <li><span class="colorSpan" style="background-color:#00C06F"></span>中草药：{{ drygTjData.cyPercent }}&nbsp;&nbsp;&nbsp;({{
                  drygTjData.cyCost
                }})
              </li>
              <li><span class="colorSpan" style="background-color:#FECA0A"></span>食品级：{{ drygTjData.spPercent }}&nbsp;&nbsp;&nbsp;({{
                  drygTjData.spCost
                }})
              </li>
            </div>
          </div>
          <div class="topTj" v-if="active == 2">
            <div class="title">
              <div class="btns">
                <button :class="btnactive == 0?'active':''" @click="changeBtn(0)">最近半年</button>
                <button :class="btnactive == 1?'active':''" @click="changeBtn(1)">最近3月</button>
                <button :class="btnactive == 2?'active':''">
                  <span @click.stop="openTimeSelect('startTime')">{{ startTime }}</span>
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
            <div id="ddCfImg" :style="{ width: '100%', height: '400px' }">

            </div>
          </div>
          <div class="topTj" v-if="drugList.length > 0 && active == 2 ">
            <li class="pxLi" @click="changePx(1)"><img src="../../assets/img/my/px.png" class="icon-width-height-sm-16"><span
              v-if="drugPx">正序</span>
              <span v-else>倒序</span>
            </li>
            <div id="drugImg" :style="{ width: '100%', height: this.drugList.length * 80 + 'px' }">

            </div>
          </div>
          <div class="topTj" v-if="orderList.length > 0 && active == 2">
            <li class="pxLi" @click="changePx(2)"><img src="../../assets/img/my/px.png" class="icon-width-height-sm-16"><span
              v-if="orderPx">正序</span>
              <span v-else>倒序</span>
            </li>
            <div id="orderImg" :style="{ width: '100%', height: this.drugList.length * 80 + 'px' }">

            </div>
          </div>
        </div>
        <div class="bottomBtn">
          <button class="publicBtn" @click="goDrugDetail">查看药品销售明细</button>
        </div>
      </van-tab>
    </van-tabs>

  </div>
</template>

<script>
import {
  findAllDrug,
  addDoccommondrug,
  cancelDoccommondrug,
  findDrugByDocId,
  findDocCommonPrescription,
  findDocPrescriptionHistory
} from "@/api/cf.js";
import navbar from "@/common/navbar";
import myJstools from "@/utils/myJsTools";
import $api from "@/utils/api.js";
import {getDocDrugCostStatistics, getDocPreAndOrderStatistics, getPrescriptionOrderList} from "../../api/cf";
//在组件引入基本模板
import echarts from 'echarts'
import date from "../../utils/date";
import {getDocDrugProfitList, getDocDrugSalesList} from "../../api/order";
import myJsTools from "../../utils/myJsTools";
import {Toast} from "vant";

export default {
  data() {
    return {
      value: "",
      active: 0,
      drugList: [],
      searchIcon: require("../../assets/img/index/search.png"),
      docId: "",
      docName: "",
      listQuery: {
        page: 1,
        limit: 10,
        size: 1,
        type: 4
      },
      isLoading: false,
      finished: false,
      loading: false,
      historyCfList: [], //历史处方列表
      historyCfQdList: [],//处方清单列表
      selectType: "0",
      option1: [
        {text: "全部", value: "0"},
        {text: "待核销", value: "1"},
        {text: "已核销", value: "2"},
        {text: "已退费", value: "3"}
      ],
      selectTypeQd: '0',
      option2: [
        {text: "全部", value: "0"},
        {text: "待支付", value: "1"},
        {text: "已支付", value: "2"},
        {text: "已退款", value: "3"}
      ],
      drygTjData: "",
      orderInfo: {},
      orderList: [],
      btnactive: 0,
      startTime: "",
      endTime: "",
      currentDate: "",
      timeShow: false,
      selectTimeType: "",
      drugPx: true,
      orderPx: true,
      maxDate: "",
    };
  },
  created() {
    this.docId = this.$route.query.docId;
    this.docName = this.$route.query.docName;
    this.onRefresh();

  },
  mounted() {
    this.getStatistics();
    this.changeBtn(0);
    this.getDrugScales();
    this.getOrderList();
    let lastDate = date.getLastMouth().split("-");
    this.maxDate = this.currentDate = new Date(lastDate[0], parseInt(lastDate[1]) - 1, 1);
  },
  components: {navbar},
  methods: {
    goDrugDetail() {
      this.$router.push({
        name: "drugSales",
      })
    },
    formatter(type, val) {
      if (type === 'year') {
        return `${val}年`;
      } else if (type === 'month') {
        return `${val}月`;
      }
      return val;
    },
    changePx(type) {
      if (type == 1) {
        this.drugPx = !this.drugPx;
        this.getDrugScales();
      } else {
        this.orderPx = !this.orderPx;
        this.getOrderList();
      }
    },
    changeBtn(active) {
      this.btnactive = active;
      if (active == 0 || active == 1) {
        this.startTime = date.getPastHalfYear(active + 1);
        this.endTime = date.getLastMouth();
      }
      this.getDdCfData();
    },
    confirmDate(val) {
      if (this.selectTimeType == "startTime") {
        this.startTime = date.getNowDate(val).split("-")[0] + "-" + date.getNowDate(val).split("-")[1];
      } else {
        let time = date.getNowDate(val).split("-")[0] + "-" + date.getNowDate(val).split("-")[1];
        let result = date.getMounth(this.startTime, time);
        console.log(time < this.startTime, result)
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
      this.getDdCfData();
    },
    openTimeSelect(type) {
      this.selectTimeType = type;
      this.timeShow = true;
    },
    getStatistics() {
      getDocDrugCostStatistics({
        userId: myJstools.getItem("token_info").userId
      }).then(res => {
        console.log(res);
        this.drygTjData = res.data;

      })
    },
    // 打开处方列表详情
    openHistoryDrug(item) {
      if (item.prescriptionType == 2) {
        return;
      }
      this.$router.push({
        name: "historyCfDetail",
        query: {
          prescriptionId: item.prescriptionId,
          item: item
        }
      });
    },
    getDdCfData() {
      let firstArr = [], endArr = [];
      getDocPreAndOrderStatistics({
        docId: myJsTools.getItem("token_info").docId,
        startTime: this.startTime,
        endTime: this.endTime
      }).then(res => {
        let result = date.getMounth(this.startTime, this.endTime);
        let data = res.data;
        console.log(JSON.stringify(data) + "------------柱状图统计")
        let resultData = [], dateArr = [];
        result.map(mounthData => {
          resultData.push({
            fsTime: mounthData,
            orderMoney: 0,
            preMoney: 0
          })
          dateArr.push(mounthData.split("-")[1] + "月")
        })
        resultData.map((item, index) => {
          res.data.map(item2 => {
            if (item.fsTime == item2.fsTime) {
              item.orderMoney = item2.orderMoney;
              item.preMoney = item2.preMoney;
            }
          })
        })
        resultData.map(item => {
          firstArr.push(item.orderMoney);
          endArr.push(item.preMoney);
        })
        this.orderInfo = {
          result: dateArr,
          firstArr: firstArr,
          endArr: endArr,
        }
        this.changTab();
      })
    },
    //订单处方柱状图
    drawDdCfImg() {
      var myChart = echarts.init(document.getElementById("ddCfImg"));
      var option = {
        backgroundColor: 'transparent',
        color: ['#1890FF', '#00C06F', '#FECA0A', '#F66D51', '#7D6AFF', '#5BCFFF', '#5DABFC', '#60DBB1', '#2FA3A2', '#FFB75B', '#F1954C', '#D8D8D8'],
        tooltip: {
          //提示框组件
          trigger: 'axis',
          formatter: function (params) {
            var relVal = params[0].name;
            for (var i = 0, l = params.length; i < l; i++) {
              relVal += '<br/>';
              relVal += '<span style="display:inline-block;margin-right:5px;border-radius:2px;width:9px;height:9px;background-color:' + params[i].color + '"></span>';
              relVal += params[i].seriesName + ' : ' + params[i].value;
            }
            return relVal;
          },
          axisPointer: {
            type: 'shadow',
          },
          textStyle: {
            color: '#fff',
            fontStyle: 'normal',
            fontFamily: '微软雅黑',
            fontSize: 12,
          },
        },
        title: [{
          text: '订单下单统计',
          top: 0,
          left: 0,
          textStyle: {
            fontSize: 14,
            color: '#333333',
            fontWeight: 600
          }
        }],
        grid: {
          left: '1px',
          right: '1px',
          bottom: '0px',
          top: '35%',
          containLabel: true,
        },
        legend: {
          //图例组件，颜色和名字
          top: '25%',
          right: "0px",
          itemWidth: 10,
          itemHeight: 10,
          data: [
            {
              name: '医生处方金额合计',
            },
            {
              name: '患者订单金额合计',
            }
          ],
          textStyle: {
            color: '#a8aab0',
            fontStyle: 'normal',
            fontFamily: '微软雅黑',
            fontSize: 12,
          },
        },
        xAxis: [
          {
            type: 'category',
            //	boundaryGap: true,//坐标轴两边留白
            data: this.orderInfo.result,
            axisLabel: {
              //坐标轴刻度标签的相关设置。
              //		interval: 0,//设置为 1，表示『隔一个标签显示一个标签』
              //	margin:15,
              textStyle: {
                color: '#204C6F',
                fontStyle: 'normal',
                fontFamily: '微软雅黑',
                fontSize: 12,
              },
            },
            axisTick: {
              //坐标轴刻度相关设置。
              show: false,
            },
            axisLine: {
              //坐标轴轴线相关设置
              lineStyle: {
                color: '#204C6F',
                opacity: 0.2,
              },
            },
            splitLine: {
              //坐标轴在 grid 区域中的分隔线。
              show: false,
            },
          },
        ],
        yAxis: [
          {
            type: 'value',
            splitNumber: 5,
            axisLabel: {
              formatter: '{value}元',
              textStyle: {
                color: '#204C6F',
                fontStyle: 'normal',
                fontFamily: '微软雅黑',
                fontSize: 12,
              },
            },
            axisLine: {
              show: false,
            },
            axisTick: {
              show: false,
            },
            splitLine: {
              show: true,
              lineStyle: {
                color: ['#204C6F'],
                opacity: 0.3,
              },
            },
            boundaryGap: ['0', '20%'],
          },
        ],
        series: [
          {
            name: '医生处方金额合计',
            type: 'bar',
            data: this.orderInfo.endArr,
            barWidth: 10
          },
          {
            name: '患者订单金额合计',
            type: 'bar',
            data: this.orderInfo.firstArr,
            barWidth: 10
          }
        ],
      };
      myChart.setOption(option);
    },
    drawTopImg() {
      var myChart = echarts.init(document.getElementById("topImg"));
      console.log(myChart)
      let bgColor = '#fff';
      let title = '总费用';
      let color = ['#1890FF', '#00C06F', '#FECA0A', '#F66D51', '#7D6AFF', '#5BCFFF', '#5DABFC', '#60DBB1', '#2FA3A2', '#FFB75B', '#F1954C', '#D8D8D8'];

      let scale = 1;
      let option;
      if (!this.drygTjData) {
        option = {
          title: [{
            text: '暂无数据',
            x: 'center',
            y: 'center',
            textStyle: {
              color: '#666',
              fontWeight: 'normal',
              fontSize: 12
            }
          }, {
            text: '药品费用统计',
            top: 0,
            left: 0,
            textStyle: {
              fontSize: 14,
              color: '#333333',
              fontWeight: 600
            }
          }]
        }
      } else {
        let echartData = [{
          name: "西成药",
          value: this.drygTjData.xyCost,
        },
          {
            name: "中草药",
            value: this.drygTjData.cyCost,
          },
          {
            name: "食品级",
            value: this.drygTjData.spCost,
          }
        ];
        option = {
          backgroundColor: bgColor,
          color: color,
          title: [{
            text: '{name|' + title + '}\n{val|' + this.drygTjData.cost + '}',
            top: 'center',
            left: 'center',
            textStyle: {
              rich: {
                name: {
                  fontSize: 14,
                  fontWeight: 'normal',
                  color: '#666666',
                  padding: [10, 0]
                },
                val: {
                  fontSize: 14,
                  fontWeight: 'bold',
                  color: '#333333',
                }
              }
            }
          }, {
            text: '药品费用统计',
            top: 0,
            left: 0,
            textStyle: {
              fontSize: 14,
              color: '#333333',
              fontWeight: 600
            }
          }],
          series: [{
            type: 'pie',
            radius: ['45%', '60%'],
            center: ['50%', '50%'],
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
                length: 20,
                length2: 50,
              }
            },
            label: {
              normal: {
                formatter: params => {
                  var total = 0; //考生总数量
                  var percent = 0; //考生占比
                  echartData.forEach(function (value, index, array) {
                    total += value.value;
                  });
                  let val = '';
                  val = myJsTools.unitConvert(params.value);
                  percent = ((params.value / total) * 100).toFixed(1);
                  return params.name + '\n\n' + percent + '%(' + val + ')';
                },
                position: 'outer',
                alignTo: 'edge',
                margin: 10
              }
            },
          }]
        };
      }
      myChart.setOption(option);
    },
    getDrugScales() {
      getDocDrugSalesList({
        docId: myJsTools.getItem("token_info").docId,
        sort: this.drugPx ? '1' : '2',
      }).then(res => {
        console.log(res);
        let data = res.data;
        let result = [];
        data.map(item => {
          result.push({
            name: item.drugName.slice(0, 5),
            value: item.drugTotal,
          })
        })
        this.drugList = result;
        this.changTab();
      })
    },
    drawDrugImg(type) {
      var myChart;
      let inverse;
      let me = this;
      if (type == 1) {
        myChart = echarts.init(document.getElementById("drugImg"));
        if (this.drugPx) {
          inverse = true;
        } else {
          inverse = false;
        }
      } else {
        myChart = echarts.init(document.getElementById("orderImg"));
        if (this.orderPx) {
          inverse = true;
        } else {
          inverse = false;
        }
      }
      let data = type == 1 ? this.drugList : this.orderList;
      console.log(type, inverse, this.drugList)
      let getArrByKey = (data, k) => {
        let key = k || "value";
        let res = [];
        if (data) {
          data.forEach(function (t) {
            res.push(t[key]);
          });
        }
        return res;
      };
      let opt = {
        index: 0
      }
      let color = ['#1890FF'];


      let option = {
        grid: {
          top: 20,
          bottom: -15,
          right: 0,
          left: -90,
          containLabel: true
        },
        title: [{
          text: type == 1 ? '药品销售额TOP' : '药品收益Top',
          top: 0,
          left: 0,
          textStyle: {
            fontSize: 14,
            color: '#333333',
            fontWeight: 600
          }
        }],
        xAxis: {
          type: 'value',

          splitLine: {
            show: false
          },
          axisLabel: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLine: {
            show: false
          },
        },
        yAxis: [{
          type: 'category',
          inverse: true,
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisPointer: {
            label: {
              show: true,
              margin: 30
            }
          },
          data: getArrByKey(data, 'name'),
          axisLabel: {
            color: '#333333',
            align: 'left',
            margin: 110,
            fontSize: 16,
            formatter: function (value, index) {
              if (opt.index === 0 && index < 3) {
                return '{idx' + index + '|' + (1 + index) + '} {title|' + value + '}'
              } else if (opt.index !== 0 && (index + opt.index) < 9) {
                return '{idx|0' + (1 + index + opt.index) + '} {title|' + value + '}'
              } else {
                return '{idx|' + (1 + index + opt.index) + '} {title|' + value + '}'
              }
            },
            rich: {
              idx0: {
                color: '#fff',
                backgroundColor: {
                  image: require("../../assets/img/my/1.png")
                },
                height: 23,
                width: 25,
                align: "center"
              },
              idx1: {
                color: '#fff',
                backgroundColor: {
                  image: require("../../assets/img/my/2.png")
                },
                height: 23,
                width: 25,
                align: "center"
              },
              idx2: {
                color: '#fff',
                backgroundColor: {
                  image: require("../../assets/img/my/3.png")
                },
                height: 23,
                width: 25,
                align: "center"
              },
              idx: {
                color: '#fff',
                height: 23,
                width: 25,
                align: "center",
                backgroundColor: {
                  image: require("../../assets/img/my/4.png")
                },
              },
              title: {
                width: 80
              }
            }
          },
        }, {
          triggerEvent: true,
          show: true,
          inverse: inverse,
          data: getArrByKey(data, 'name'),
          axisLine: {
            show: false
          },
          splitLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            interval: 0,
            color: '#333333',
            align: 'left',
            margin: 10,
            fontSize: 13,
            formatter: function (value, index) {
              if (me.drugPx == '1') {
                data = data.sort((a, b) => {
                  return a.value - b.value
                });
              } else {
                data = data.sort((a, b) => {
                  return a.value - b.value
                });
              }
              let s = myJsTools.unitConvert(data[index].value);
              console.log(data[index].name, index, data[index].value, s);
              return s;
            },
          }
        }],
        series: [{
          name: '条',
          type: 'bar',
          yAxisIndex: 0,
          data: data,
          barWidth: 10,
          itemStyle: {
            color: (val) => {
              return "#1890FF"
            },
            barBorderRadius: 30,
          },
        }]
      };
      myChart.setOption(option);
    },
    getOrderList() {
      getDocDrugProfitList({
        docId: myJsTools.getItem("token_info").docId,
        sort: this.orderPx ? '1' : '2',
      }).then(res => {
        console.log(res);
        let data = res.data;
        let result = [];
        data.map(item => {
          result.push({
            name: item.drugName.slice(0, 5),
            value: item.drugTotal
          })
        })
        this.orderList = result;
        this.changTab();
      })
    },
    openHistoryQdDrug(item) {
      if (item.payStatus == '1') {
        this.$router.push({
          name: "waitPay",
          query: {
            businessId: item.businessId
          }
        })
      } else if (item.payStatus == 'a') {
        this.$router.push({
          name: "offLinepay",
          query: {
            businessId: item.businessId
          }
        });
      } else {
        this.$router.push({
          name: "payPre",
          query: {
            businessId: item.businessId
          }
        })
      }
    },
    changTab() {
      if (this.active == 2) {
        setTimeout(() => {
          this.drawTopImg();
          this.drawDdCfImg();
          if (this.drugList.length > 0) {
            this.drawDrugImg(1);
          }
          if (this.orderList.length > 0) {
            this.drawDrugImg(2);
          }
        }, 500)
      } else {
        this.onRefresh();
      }
    },
    onRefresh() {
      // 清空列表数据
      this.finished = false;
      // 重新加载数据
      // 将 loading 设置为 true，表示处于加载状态
      this.loading = true;
      this.listQuery.page = 1;
      this.historyCfQdList = this.historyCfList = [];
      this.onLoaded();
    },
    onLoaded() {
      if (this.isLoading) {
        this.isLoading = false;
      }
      this.getDrugList();
    },
    // 获取列表
    getDrugList() {
      this.listQuery.docId = this.docId;
      if (this.active == 0) {
        this.listQuery.type = this.selectType;
        this.listQuery.searchKey = this.value;
        findDocPrescriptionHistory(this.listQuery).then(res => {
          this.dataSetFun(res);
        });
      } else if (this.active == 1) {
        this.listQuery.payStatus = this.selectTypeQd;
        this.listQuery.searchKey = this.value;
        getPrescriptionOrderList(this.listQuery).then(res => {
          this.dataSetFun(res);
        })
      }
    },
    // 数据处理
    dataSetFun(res) {
      this.loading = false;
      this.listQuery.size = res.data.total / this.listQuery.limit;
      if (this.listQuery.size < 2) {
        this.loading = false;
      }
      if (this.active == 0) {
        if (this.listQuery.page == 1) {
          this.listQuery.page = 1;
          this.isLoading = false;
          this.historyCfList = res.data.rows;
        } else {
          this.historyCfList = this.historyCfList.concat(res.data.rows);
          this.loading = false;
        }
      } else if (this.active == 1) {
        if (this.listQuery.page == 1) {
          this.listQuery.page = 1;
          this.isLoading = false;
          this.historyCfQdList = res.data.rows;
        } else {
          this.historyCfQdList = this.historyCfQdList.concat(res.data.rows);
          this.loading = false;
        }
      }
      if (this.listQuery.page >= this.listQuery.size) {
        this.finished = true; // 若数据已全部获取完毕
        return;
      }
      this.listQuery.page++;
    },
  }
};
</script>

<style scoped lang="less">


.searchDiv {
  display: flex;
  width: 100%;
  background: @white;

  span {
    .font-size-sm;
    line-height: 18px;
    padding: 12px 0 12px 11px;
  }

  .fieldDiv {
    width: 85%;
  }
}

/deep/ .van-search {
  padding: 5px 0px;
}

/deep/ .van-field__left-icon .van-icon, .van-field__right-icon .van-icon {
  display: block;
  min-width: 1em;
  .font-size-lg;
  line-height: inherit;
  padding-top: 3px;
  margin-right: 5px;
}

.emptyDiv {
  margin-top: 76px;
}

.commonlyCfList {
  padding: 0 16px 80px;
  .black-font;
  .font-size-md;

  .commonlyCfCard {
    margin-top: 12px;
    background: @white;
    padding: 12px;
    border-radius: 4px;
  }

  li {
    margin-top: 12px;
    line-height: 16px;

    :nth-child(1) {
      width: 90%;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }

  .title {
    .font-blod-2;
    margin-top: 0px;

    :nth-child(1) {
      width: 85%;
    }
  }

  .historyTitle {
    :nth-child(1) {
      width: 55%;
    }

    :nth-child(2) {
      text-align: right;
      width: 43%;
    }

    span {
      margin-left: 15px;
    }
  }
}

.van-dropdown-menu {
  border-radius: 4px;
  margin: 12px 16px;
}

/deep/ .van-dropdown-menu__item {
  -webkit-justify-content: left;
  justify-content: left;
  padding-left: 12px;
}

.vanTabChild {
  padding: 12px 16px 60px;
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

.title {
  .black-font;
  .font-size-md;
  .font-blod-2;
}

.btns {
  display: flex;
  position: absolute;
  right: 16px;
  top: 10%;
  font-size: 10px;
  margin-top: 12px;
  text-align: right;
  align-items: center;
  font-weight: 500;
  z-index: 999;

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

.pxLi {
  position: absolute;
  top: 12px;
  right: 16px;
  display: flex;
  align-items: center;
  .black-font;
  .font-size-md;
  z-index: 999;
  line-height: 22px;
}
</style>
