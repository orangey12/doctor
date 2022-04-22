<template>
  <div class="myVisit"
       id="myVisit"
       style="cursor:pointer;">
    <navbar title="我的出诊"
            :active="active">
      <template slot="rightIcon">
        <img src="../../assets/img/my/set.png"
             class="icon-width-height-sm" />
      </template>
    </navbar>
    <van-tabs v-model="active"
              color="#14A0E6"
              title-active-color="#14A0E6"
              @change="changeTab">
      <van-tab title="线上">
        <div class="lineVisitDiv ">
          <li class="titleTips">
            <u>
              <span class="line"></span>
              <span>视频/语音</span>
            </u>
            <u>
              <span class="yuan"></span>
              <span>医院</span>
              <span class="yuan person"></span>
              <span>个人</span>
            </u>
          </li>
        </div>
        <div class="laydate"
             id="test2"></div>
        <div class="lineVisitDiv"
             v-if="amVisitList.length > 0">
          <li class="title titleTips">
            <u>
              <span class="line"></span>
              <span>上午</span>
            </u>
          </li>
          <van-swipe-cell v-for="(item, index) in amVisitList"
                          :key="index">
            <van-row>
              <van-col span="8">
                <span class="time">{{ item.startTime }}-{{ item.endTime }}</span>
              </van-col>
              <van-col span="8">
                <li class="limit">限制人数：{{ item.appointLimitNum }}</li>
                <li class="remaining">剩余人数：{{ item.appointLimitNum - item.numberOf }}</li>
              </van-col>
              <van-col span="8">
                <li class="fwType">
                  <span>{{ item.consultationName }}</span>
                </li>
                <span class="voice-sign"
                      v-if="item.visitTypeCode == 2">{{
                    item.visitTypeName
                  }}</span>
                <span class="video-sign"
                      v-if="item.visitTypeCode == 4">{{
                    item.visitTypeName
                  }}</span>
                <span class="tel-sign"
                      v-if="item.visitTypeCode == 3">{{
                    item.visitTypeName
                  }}</span>
              </van-col>
            </van-row>
            <template #right
                      v-if="item.vrTempType == 2 && !isDisabled"
                      style="display:flex;">
              <van-button square
                          text="编辑"
                          color="#666666"
                          @click="editVisit(item)" />
              <van-button square
                          text="删除"
                          color="#FF5050"
                          @click="deleteVisit(item)" />
            </template>
          </van-swipe-cell>
        </div>
        <div class="lineVisitDiv"
             v-if="pmVisitList.length > 0">
          <li class="title titleTips">
            <u>
              <span class="line"></span>
              <span>下午</span>
            </u>
          </li>
          <van-swipe-cell v-for="(item, index) in pmVisitList"
                          :key="index">
            <van-row>
              <van-col span="8">
                <span class="time">{{ item.startTime }}-{{ item.endTime }}</span>
              </van-col>
              <van-col span="8">
                <li class="limit">限制人数：{{ item.appointLimitNum }}</li>
                <li class="remaining">剩余人数：{{ item.appointLimitNum - item.numberOf }}</li>
              </van-col>
              <van-col span="8">
                <li class="fwType">
                  <span>{{ item.consultationName }}</span>
                </li>
                <span class="voice-sign"
                      v-if="item.visitTypeCode == 2">{{
                    item.visitTypeName
                  }}</span>
                <span class="video-sign"
                      v-if="item.visitTypeCode == 4">{{
                    item.visitTypeName
                  }}</span>
                <span class="tel-sign"
                      v-if="item.visitTypeCode == 3">{{
                    item.visitTypeName
                  }}</span>
              </van-col>
            </van-row>
            <template #right
                      v-if="item.vrTempType == 2 && !isDisabled"
                      style="display:flex;">
              <van-button square
                          text="编辑"
                          color="#666666"
                          @click="editVisit(item)" />
              <van-button square
                          text="删除"
                          color="#FF5050"
                          @click="deleteVisit(item)" />
            </template>
          </van-swipe-cell>
        </div>
        <div v-if="amVisitList.length == 0 && pmVisitList.length == 0"
             class="emptyDiv">
          <img src="../../assets/img/index/yyEmpty.png"
               class="emptyIcon">
          <li>暂无排班</li>
        </div>
        <div class="bottomBtn"
             v-show="!isDisabled">
          <button class="publicBtn"
                  @click="openNewShift"
                  :disabled="isDisabled">
            添加
          </button>
        </div>
      </van-tab>
      <van-tab title="线下">
        <div class="lineVisitDiv ">
          <li class="titleTips">
            <u>
              <span class="line"></span>
              <span>日期</span>
            </u>
            <u>
              <span class="yuan"></span>
              <span>医院</span>
              <span class="yuan person"></span>
              <span>个人</span>
            </u>
          </li>
        </div>
        <div class="laydate"
             id="test3"></div>
        <div v-if="visitDateList.doc && visitDateList.doc.length > 0">
          <div class="lineVisitDiv">
            <li class="titleTips">
              <u>
                <span class="line"></span>
                <span>自定义出诊信息</span>
              </u>
            </li>
          </div>
          <div class="lineVisitDiv">
            <van-swipe-cell v-for="(item, index) in visitDateList.doc"
                            :key="'offline-' + index">
              <van-row>
                <span class="fl"
                      style="font-size: 16px;  margin_left:8px">{{ item.startTime }} - {{ item.endTime }}</span>
                <div class="fr"
                     style="font-size: 14px">
                  <span class="limit">限制人数：{{ item.appointLimitNum }}</span>
                  <span class="limit">剩余人数：{{ item.remainNumber }}</span>
                </div>
              </van-row>
              <template #right
                        style="display:flex;"
                        v-if="item.isStop != '1'">
                <van-button square
                            text="编辑"
                            color="#666666"
                            @click="offlineEditVisit(item)" />
                <van-button square
                            text="删除"
                            color="#FF5050"
                            @click="offlineDeleteVisit(item)" />
              </template>
            </van-swipe-cell>
          </div>
        </div>
        <div v-if="visitDateList.hos && visitDateList.hos.length > 0">
          <div class="lineVisitDiv">
            <li class="titleTips">
              <u>
                <span class="line"></span>
                <span>医院出诊信息</span>
              </u>
            </li>
          </div>
          <div class="lineVisitDiv">
            <van-swipe-cell v-for="(item, index) in visitDateList.hos"
                            :key="'offline-' + index">
              <van-row>
                <span class="fl"
                      style="font-size: 16px;margin_left:8px">{{ item.startTime }} - {{ item.endTime }}</span>
                <div class="fr"
                     style="font-size: 14px">
                  <span class="limit">限制人数：{{ item.appointLimitNum }}</span>
                  <span class="limit">剩余人数：{{ item.remainNumber }}</span>
                </div>
              </van-row>
            </van-swipe-cell>
          </div>
        </div>
        <div v-if="visitDateList.hos  && visitDateList.doc && visitDateList.hos.length == 0 && visitDateList.doc.length == 0"
             class="emptyDiv">
          <img src="../../assets/img/index/yyEmpty.png"
               class="emptyIcon">
          <li>暂无排班</li>
        </div>
        <div class="bottomBtn"
             v-show="!disabled">
          <button class="publicBtn"
                  @click="openOfflineNewShift"
                  :disabled="disabled">
            添加
          </button>
        </div>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
import navbar from "@/common/navbar";
import $api from "@/utils/api";
import dateFun from "@/utils/date";
import myJsTools from "@/utils/myJsTools";
import {
  docVisitFlag,
  selectDicDocVisitRealOfflineList,
  deleteProVisitReal
} from "@/api/visit";
import laydate from "layui-laydate";
import "@/assets/css/layDate.css";
import {
  deleteDicDocVisitRealOffline,
  queryInformationOfDoctorOneDayVisit,
  selectDicDocVisitRealOfflineListByDate
} from "../../api/visit";
import { Dialog, Toast } from "vant";

export default {
  data () {
    return {
      active: 0,
      isDisabled: false,
      disabled: false,
      flagData: [],
      visitDateList: [],
      amVisitList: [],
      pmVisitList: [],
      nowDate: null, //当前日期
      dateTime: null,
      docId: "",
      visitDate: null,
      offlineVisitDate: [],
      laydate: null,
      laydate_on: {},
      laydate_off: {},
      currentDate: "",
      value: "",
      date: "",
    };
  },
  components: { navbar },
  created () {
    if (myJsTools.getItem("visitActive")) {
      this.active = parseInt(myJsTools.getItem("visitActive"));
      console.log(this.active + "------------" + myJsTools.getItem("visitActive"))
    }
  },
  mounted () {
    this.docId = myJsTools.getItem("token_info").docId;
    this.getOnline();
    this.getOffline();
    this.addEvent();
    this.$nextTick(() => {
      // 禁用选择
      document.getElementById("myVisit").onselectstart = new Function("event.returnValue=false");
    });
  },
  methods: {
    addEvent () {
      let me = this;
      //如监听网络连接事件
      api.addEventListener(
        {
          name: "closeNewShift"
        },
        function (ret, err) {
          if (ret.value.value) {
            me.value = ret.value.value;
          }
          if (ret.value.visitDate) {
            me.visitDate = ret.value.visitDate;
          }
          me.active = ret.value.active;
        }
      );
    },
    changeTab (val) {
      myJsTools.setItem("visitActive", val);
      this.$nextTick(() => {
        if (val == 0) {
          this.getOnline();
          let test2 = document.getElementById("test2");
          if (test2.childNodes.length > 0) {
            test2.removeChild(test2.firstChild);
          }
        } else if (val == 1) {
          this.getOffline();
          let test3 = document.getElementById("test3");
          if (test3.childNodes.length > 0) {
            test3.removeChild(test3.firstChild);
          }
        }
      });
    },
    // 显示日历
    getOnline () {
      var me = this;
      setTimeout(() => {
        laydate.render({
          elem: "#test2",
          position: "static",
          type: "date",
          show: true,
          showBottom: false,
          theme: this.$store.getters.getThemeColor,
          // min: 0,
          max: 7, //14天后
          value: me.value,
          closeStop: "#test2",
          ready: function (date) {
            me.nowDate =
              date.year +
              "-" +
              (date.month <= 9 ? "0" + date.month : date.month) +
              "-" +
              date.date;
            var currentDate = new Date();
            me.currentDate =
              currentDate.getFullYear() +
              "-" +
              (currentDate.getMonth() <= 9
                ? "0" + (currentDate.getMonth() + 1)
                : currentDate.getMonth() + 1) +
              "-" +
              currentDate.getDate();
            laydate.render.value = me.value;
            if (me.currentDate <= me.nowDate) {
              me.isDisabled = false;
            } else {
              me.isDisabled = true;
            }
            let d = dateFun.getWeek(
              date.year + "-" + date.month + "-" + date.date
            );
            let el = document.getElementsByClassName("laydate-set-ym");
            for (let i = 0; i < el.length; i++) {
              const element = el[i];
              $api.append(element, "<span class='daySpan'>" + d + "</span>");
            }
            let layDateDom = document.getElementsByClassName(
              ".layui-laydate-range"
            );
            for (let i = 0; i < layDateDom.length; i++) {
              const element = layDateDom[i];
              $api.css(
                element,
                "width:" + document.documentElement.clientWidth
              );
            }

            let tds = document.getElementsByTagName("td");
            let wid =
              (document.documentElement.clientWidth -
                document.documentElement.clientWidth / 3.7) /
              7;
            for (let i = 0; i < tds.length; i++) {
              const element = tds[i];
              $api.css(
                element,
                "width:" + wid + "px;line-height:" + (wid - 4) + "px"
              );
            }

            let ths = document.getElementsByTagName("th");
            for (let i = 0; i < ths.length; i++) {
              const element = ths[i];
              $api.css(
                element,
                "width:" + wid + "px;line-height:" + wid + "px"
              );
            }
            me.getDocFlag();
            me.getVisit();
          },
          change: function (value, date, endDate) {
            me.nowDate = value;
            var currentDate = new Date();
            me.currentDate =
              currentDate.getFullYear() +
              "-" +
              (currentDate.getMonth() < 9
                ? "0" + (currentDate.getMonth() + 1)
                : currentDate.getMonth() + 1) +
              "-" +
              (currentDate.getDate() <= 9
                ? "0" + currentDate.getDate()
                : currentDate.getDate());
            me.value = value;
            laydate.render.value = me.value;
            console.log(me.currentDate, me.nowDate)
            if (me.currentDate <= me.nowDate) {
              me.isDisabled = false;
            } else if (me.currentDate > me.nowDate) {
              me.isDisabled = true;
            }
            me.getDocFlag();
            me.getVisit();
            me.setFlag();
          }
        });
      }, 300);
    },
    getOffline () {
      var me = this;
      setTimeout(() => {
        laydate.render({
          elem: "#test3",
          position: "static",
          type: "date",
          show: true,
          showBottom: false,
          theme: this.$store.getters.getThemeColor,
          // min: 0,
          max: 7, //14天后
          value: me.date,
          closeStop: "#test3",
          ready: function (date) {
            me.dateTime = date.year + "-" + date.month + "-" + date.date;
            var currentDate = new Date();
            me.currentDate =
              currentDate.getFullYear() +
              "-" +
              (currentDate.getMonth() + 1) +
              "-" +
              currentDate.getDate();
            laydate.render.value = me.date;
            if (me.currentDate < me.dateTime) {
              me.disabled =true;
            } else {
              me.disabled = false;
            }

            let d = dateFun.getWeek(
              date.year + "-" + date.month + "-" + date.date
            );
            let el = document.getElementsByClassName("laydate-set-ym");
            for (let i = 0; i < el.length; i++) {
              const element = el[i];
              $api.append(element, "<span class='daySpan'>" + d + "</span>");
            }
            let layDateDom = document.getElementsByClassName(
              ".layui-laydate-range"
            );
            for (let i = 0; i < layDateDom.length; i++) {
              const element = layDateDom[i];
              $api.css(
                element,
                "width:" + document.documentElement.clientWidth
              );
            }

            let tds = document.getElementsByTagName("td");
            let wid =
              (document.documentElement.clientWidth -
                document.documentElement.clientWidth / 3.7) /
              7;
            for (let i = 0; i < tds.length; i++) {
              const element = tds[i];
              $api.css(
                element,
                "width:" + wid + "px;line-height:" + wid + "px"
              );
            }

            let ths = document.getElementsByTagName("th");
            for (let i = 0; i < ths.length; i++) {
              const element = ths[i];
              $api.css(
                element,
                "width:" + wid + "px;line-height:" + wid + "px"
              );
            }
            me.getOfflineFlag();
            me.getOfflineVisit();
          },
          change: function (value, date, endDate) {
            me.dateTime = value;
            var currentDate = new Date();
            me.currentDate =
              currentDate.getFullYear() +
              "-" +
              (currentDate.getMonth() < 9
                ? "0" + (currentDate.getMonth() + 1)
                : currentDate.getMonth() + 1) +
              "-" +
              (currentDate.getDate() <= 9
                ? "0" + currentDate.getDate()
                : currentDate.getDate());
            me.date = value;
            laydate.render.value = me.date;
            if (me.currentDate <= me.dateTime) {
              me.disabled = false;
            } else {
              me.disabled = true;
            }
            me.setOfflineFlag();
            me.getOfflineVisit();
          }
        });
      }, 300);
    },
    // 打开添加排班页面
    openNewShift () {
      this.$router.push({
        name: "newShift",
        query: {
          visitDate: this.nowDate,
          list: this.visitDate,
          type: "1",
          value: this.value,
        }
      });
    },
    // 获取指定日期的排班信息
    getVisit () {
      this.amVisitList = this.visitDate = [];
      this.pmVisitList = [];
      queryInformationOfDoctorOneDayVisit({ docId: this.docId, visitDate: this.nowDate, queryType: "1" }).then(res => {
        if (res.data.length > 0) {
          var data = res.data;
          this.visitDate = data;
          for (let i = 0; i < data.length; i++) {
            const element = data[i];
            if (element.apw == "a") {
              this.amVisitList.push(element);
            } else {
              this.pmVisitList.push(element);
            }
            if (!element.numberOf) {
              element.numberOf = 0;
            }
          }

        } else {
          this.amVisitList = this.pmVisitList = [];
        }
      });
    },
    // 获取医生排班标志
    getDocFlag () {
      docVisitFlag({ docId: this.docId }).then(res => {
        this.flagData = res.data;
        this.setFlag();
      });
    },
    // 编辑自由排班
    editVisit (item) {
      this.$router.push({
        name: "editVisit",
        query: {
          item: item,
          type: "1",
          value: this.value,
        }
      });
    },
    // 删除自由排班
    deleteVisit (item) {
      let me = this;
      if (item.numberOf > 0) {
        Dialog.confirm({
          title: '删除排班',
          message: '该诊段已有患者预约，删除该诊段将给预约患者退挂号',
        })
          .then(() => {
            deleteProVisitReal({ vrId: item.vrId }).then(res => {
              console.log("删除自由排班结果", res);
              me.getVisit();
              me.getDocFlag();
            });
          })
          .catch(() => {
            // on cancel
          });
      } else {
        Dialog.confirm({
          title: '删除排班',
          message: '是否确认删除该排班信息',
        })
          .then(() => {
            deleteProVisitReal({ vrId: item.vrId }).then(res => {
              console.log("删除自由排班结果", res);
              me.getVisit();
              me.getDocFlag();
            });
          })
          .catch(() => {
            // on cancel
          });
      }
    },
    // 设置日历标志
    setFlag () {
      let tds = document.getElementsByTagName("td");
      if (this.flagData.length == 0) {
        for (let m = 0; m < tds.length; m++) {
          const tdEle = tds[m];
          let name = $api.attr(tdEle, "lay-ymd");
          if (dateFun.getNowDate(name.replace(/-/g, '/')) == dateFun.getNowDate(this.nowDate)) {
            $api.html(
              tdEle,
              "<li style='color:#fff;'>" + name.split("-")[2] + "</li>"
            );
          }
        }
      } else {
        for (let i = 0; i < this.flagData.length; i++) {
          const element = this.flagData[i];
          for (let m = 0; m < tds.length; m++) {
            const tdEle = tds[m];
            let name = $api.attr(tdEle, "lay-ymd");
            if (dateFun.getNowDate(name.replace(/-/g, '/')) == dateFun.getNowDate(element.visitDate)) {
              if (element.flag == "1") {
                $api.html(
                  tdEle,
                  "<li style='color:#fff;'>" +
                  name.split("-")[2] +
                  "</li><li class='yuanLi'><span class='dateYuan'></span></li>"
                );
              } else if (element.flag == "2") {
                $api.html(
                  tdEle,
                  "<li style='color:#fff;'>" +
                  name.split("-")[2] +
                  "</li><li class='yuanLi'><span class='dateYuan2'></span></li>"
                );
              } else if (element.flag == "1,2") {
                $api.html(
                  tdEle,
                  "<li style='color:#fff;'>" +
                  name.split("-")[2] +
                  "</li><li class='yuanLi'><span class='dateYuan'></span><span class='dateYuan2'></span></li>"
                );
              }
              $api.addCls(tdEle, "hasVisit");
            }
          }
        }
      }
    },
    setOfflineFlag () {
      let tds = document.getElementsByTagName("td");
      for (let i = 0; i < this.flagData.length; i++) {
        const element = this.flagData[i];
        for (let m = 0; m < tds.length; m++) {
          const tdEle = tds[m];
          let name = $api.attr(tdEle, "lay-ymd");
          if (dateFun.getNowDate(name.replace(/-/g, '/')) == dateFun.getNowDate(element.visitDate)) {
            if (element.vrTempType == "1") {
              $api.html(
                tdEle,
                "<li style='color:#fff;'>" +
                name.split("-")[2] +
                "</li><li class='yuanLi'><span class='dateYuan'></span></li>"
              );
            } else if (element.vrTempType == "2") {
              $api.html(
                tdEle,
                "<li style='color:#fff;'>" +
                name.split("-")[2] +
                "</li><li class='yuanLi'><span class='dateYuan2'></span></li>"
              );
            } else if (element.vrTempType == "3") {
              $api.html(
                tdEle,
                "<li style='color:#fff;'>" +
                name.split("-")[2] +
                "</li><li class='yuanLi'><span class='dateYuan'></span><span class='dateYuan2'></span></li>"
              );
            }
            $api.addCls(tdEle, "hasVisit");
          }
        }
      }
    },
    // 获取医生线下的排班信息
    getOfflineVisit () {
      this.visitDateList = [];
      selectDicDocVisitRealOfflineListByDate({ docId: this.docId, visitDate: this.dateTime }).then(res => {
        var data = res.data;
        this.visitDateList = data;
      });
    },
    // 打开添加医生线下排班页面
    openOfflineNewShift () {
      this.$router.push({
        name: "offlineNewShift",
        query: {
          visitDate: this.dateTime,
          list: this.offlineVisitDate,
          type: "1",
          active: this.active,
        }
      });
    },
    // 获取医生线下排班标志
    getOfflineFlag () {
      selectDicDocVisitRealOfflineList({ docId: this.docId }).then(res => {
        this.flagData = res.data;
        this.setOfflineFlag();
      });
    },
    // 编辑线下自由排班
    offlineEditVisit (item) {
      this.$router.push({
        name: "offlineNewShift",
        query: {
          item: item,
          type: "2",
          active: this.active,
          visitDate: this.dateTime
        }
      });
    },
    // 删除线下自由排班
    offlineDeleteVisit (item) {
      let me = this, message;
      if (item.remainNumber < item.appointLimitNum) {
        message = '该诊段已有患者预约，删除该诊段将给预约患者退挂号'
      } else {
        message = '是否确认删除该排班信息'
      }
      Dialog.confirm({
        title: '删除排班',
        message: message,
      }).then(() => {
        deleteDicDocVisitRealOffline({ vrId: item.vrId }).then(res => {
          Toast("删除成功");
          me.getOfflineVisit();
          me.getOfflineFlag();
        });
      })
    }
  }
};
</script>

<style scoped lang="less">
.myVisit {
  background: @white !important;
  padding-bottom: 70px;
  -webkit-touch-callout: none; /*系统默认菜单被禁用*/
  -webkit-user-select: none; /*webkit浏览器*/
  -khtml-user-select: none; /*早期浏览器*/
  -moz-user-select: none; /*火狐*/
  -ms-user-select: none; /*IE10*/
  user-select: none;
}

.lineVisitDiv {
  padding: 13px 16px;
  .black-font;
  .font-size-md;
  line-height: 20px;

  li {
    width: 100%;
    .display-div;

    span {
      display: inline-block;
      .font-blod-2;
    }

    .line {
      width: 3px;
      height: 14px;
      background: @blue;
      margin-right: 8px;
    }

    .yuan {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      border: 1px solid @back-border;
      background: @white;
      margin-right: 3px;
    }

    .person {
      background: @black;
      margin-left: 28px;
    }
  }
}

/deep/ .van-cell {
  line-height: 46px;
}

.lineVisitDiv {
  .title {
    margin-bottom: 13px;
  }

  .van-row {
    text-align: center;
    padding: 13px 0;
    border-bottom: 1px solid @back-border;
  }

  .time {
    .black-font;
    .font-size-lg;
    line-height: 18px;
    margin-top: 15px;
    display: inline-block;
  }

  .limit {
    .font-size-md;
    .font-login-color;
    line-height: 20px;
    margin-bottom: 7px;
  }

  .remaining {
    .font-size-md;
    .black-font;
    line-height: 20px;
  }

  .fwType {
    .font-color-orange;
    .font-size-md;
    line-height: 20px;
    margin-bottom: 7px;
    display: block;
    text-align: center;
  }
}

.van-button {
  display: inline-block;
}

.van-button {
  height: 100%;
}

/deep/ .laydate-prev-y {
  display: none;
  padding: 2px 5px;
}

/deep/ .laydate-next-y {
  display: none;
  padding: 2px 5px;
}

.van-tab__pane:last-child {
  .hasVisit {
    line-height: 40px !important;
  }
}

.emptyDiv {
  padding-bottom: 70px;
}
</style>
