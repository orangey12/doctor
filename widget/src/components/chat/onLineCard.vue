<template>
  <div class="myVisit">
    <navbar title="出诊表"> </navbar>
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
    <div class="laydate" id="test3"></div>
    <div v-if="visitDateList.doc && visitDateList.doc.length > 0">
      <div class="lineVisitDiv">
        <li class="titleTips">
          <u>
            <span class="line"></span>
            <span>时间</span>
          </u>
        </li>
      </div>
      <div class="lineVisitDiv">
        <van-swipe-cell
          v-for="(item, index) in visitDateList.doc"
          :key="'offline-' + index"
        >
          <van-row>
          <span
            class="fl"
            style="font-size: 16px;  margin_left:8px"
          >{{ item.startTime }} - {{ item.endTime }}</span
          >
            <div class="fr" style="font-size: 14px">
              <span class="limit">限制人数：{{ item.appointLimitNum }}</span>
              <span class="limit">剩余人数：{{ item.remainNumber }}</span>
            </div>
          </van-row>
        </van-swipe-cell>
      </div>
    </div>
    <div v-if="visitDateList.hos && visitDateList.hos.length > 0">
      <div class="lineVisitDiv">
        <van-swipe-cell
          v-for="(item, index) in visitDateList.hos"
          :key="'offline-' + index"
        >
          <van-row>
          <span
            class="fl"
            style="font-size: 16px;margin_left:8px"
          >{{ item.startTime }} - {{ item.endTime }}</span
          >
            <div class="fr" style="font-size: 14px">
              <span class="limit">限制人数：{{ item.appointLimitNum }}</span>
              <span class="limit">剩余人数：{{ item.remainNumber }}</span>
            </div>
          </van-row>
        </van-swipe-cell>
      </div>
    </div>
    <div
      v-if="visitDateList.hos  && visitDateList.doc && visitDateList.hos.length == 0 && visitDateList.doc.length == 0"
      class="emptyDiv">
      <img src="../../assets/img/index/yyEmpty.png" class="emptyIcon">
      <li>暂无排班</li>
    </div>
    <div class="bottomBtn" v-show="type == 'chat'" @click="sendCard">
      <button class="publicBtn">确认发送</button>
    </div>
    <div class="bottomBtn" v-if="type == 'plan'" @click="selectLineCard">
      <button class="publicBtn">确认添加</button>
    </div>
  </div>
</template>

<script>
import navbar from "@/common/navbar";
import $api from "@/utils/api";
import dateFun from "@/utils/date";
import myJsTools from "@/utils/myJsTools";
import {
  offlineFlag,
} from "@/api/visit";
import laydate from "layui-laydate";
import "@/assets/css/layDate.css";
import {
  getDocVisitListOffline,
  selectDicDocVisitRealOfflineList,
  selectDicDocVisitRealOfflineListByDate
} from "../../api/visit";
export default {
  data() {
    return {
      active: this.$route.query.active,
      isDisabled: false,
      disabled: false,
      visitDateList:[],
      flagData: [],
      nowDate: null, //当前日期
      dateTime: null,
      docId: "",
      visitDate: this.$route.query.visitDate,
      offlineVisitDate: [],
      deptId: "",
      laydate: null,
      laydate_on: {},
      laydate_off: {},
      currentDate: "",
      value: this.$route.query.value,
      date: this.$route.query.date,
      sendShow: false,
      type: "chat"
    };
  },
  components: { navbar },
  created() {},
  mounted() {
    var me = this;
    this.docId = myJsTools.getItem("token_info").docId;
    this.type = this.$route.query.type || 'chat';
    this.deptId = sessionStorage.getItem("deptId");
    this.getOffline();
  },
  methods: {
    //确认发送
    sendCard() {
      let ext = {
        type: "czb",
        docName: myJsTools.getItem("token_info").docName,
        czbType: "2", //线下
      };
      api.sendEvent({
        name: "sendCard",
        extra: {
          ext: ext
        }
      });
      this.$router.go(-1);
    },
    //随访计划选择线下排班
    selectLineCard() {
      api.sendEvent({
        name: "selectCard",
        extra: {
          visitRealType: 2
        }
      });
      this.$router.go(-1);
    },
    getOffline() {
      var me = this;
      setTimeout(() => {
        laydate.render({
          elem: "#test3",
          position: "static",
          type: "date",
          show: true,
          showBottom: false,
          theme: me.$store.getters.getThemeColor,
          // min: 0,
          max: 14, //14天后
          value: this.$route.query.date,
          closeStop: "#test3",
          ready: function(date) {
            console.log(date);
            me.dateTime = date.year + "-" + date.month + "-" + date.date;
            var currentDate = new Date();
            me.currentDate =
              currentDate.getFullYear() +
              "-" +
              (currentDate.getMonth() + 1) +
              "-" +
              currentDate.getDate();
            laydate.render.value = me.date;
            let d = dateFun.getWeek(
              date.year + "-" + date.month + "-" + date.date
            );
            console.log(d);
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
                "width:" + document.documentElement.clientWidth + "px"
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
          change: function(value, date, endDate) {
            me.dateTime = value;
            // console.log("me.dateTime",me.dateTime, me.nowDate)
            var currentDate = new Date();
            me.currentDate =
              currentDate.getFullYear() +
              "-" +
              (currentDate.getMonth() <= 9
                ? "0" + (currentDate.getMonth() + 1)
                : currentDate.getMonth() + 1) +
              "-" +
              (currentDate.getDate() <= 9
                ? "0" + currentDate.getDate()
                : currentDate.getDate());
            me.date = value;
            laydate.render.value = me.date;
            if (me.currentDate >= me.dateTime) {
              me.disabled = true;
            } else {
              me.disabled = false;
            }
            me.setOfflineFlag();
            me.getOfflineVisit();
          }
        });
      }, 300);
    },
    // 获取医生线下排班标志
    getOfflineFlag() {
      selectDicDocVisitRealOfflineList({docId: this.docId}).then(res => {
        this.flagData = res.data;
        this.setOfflineFlag();
      });
    },
    setOfflineFlag() {
      let tds = document.getElementsByTagName("td");
      for (let i = 0; i < this.flagData.length; i++) {
        const element = this.flagData[i];
        for (let m = 0; m < tds.length; m++) {
          const tdEle = tds[m];
          let name = $api.attr(tdEle, "lay-ymd");
          console.log(name + "==========" + dateFun.getNowDate(name.replace(/-/g,'/')) + "dateFun.getNowDate(name.replace(/-/g,'/')) ------------" + dateFun.getNowDate(element.visitDate))
          if (dateFun.getNowDate(name.replace(/-/g,'/')) == dateFun.getNowDate(element.visitDate)) {
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
    getOfflineVisit() {
      this.visitDateList = [];
      selectDicDocVisitRealOfflineListByDate({docId: this.docId, visitDate: this.dateTime}).then(res => {
        var data = res.data;
        this.visitDateList = data;
      });
    },
  }
};
</script>

<style scoped lang="less">

.myVisit {
  background: @white !important;
  padding-bottom: 55px;
}
.lineVisitDiv {
  padding: 13px 16px;
  .black-font;
  .font-size-md;
  line-height: 20px;
  li {
    justify-content: space-between;
    vertical-align: middle;
    :nth-child(1) {
      width: 60%;
    }
    span {
      vertical-align: middle;
      display: inline-block;
    }
    .line {
      width: 3px;
      height: 14px;
      background: @blue;
      margin-right: 8px;
    }
  }
}
/deep/.van-cell {
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
    .font-login-color;
    .font-size-md;
    line-height: 20px;
    margin-bottom: 7px;
  }
  .remaining {
    .font-login-color;
    .font-size-md;
    line-height: 20px;
  }
  .type {
    display: inline-block;
    background: @blue;
    .white-font;
    .font-size-sm;
    padding: 0 10px;
    line-height: 18px;
    border-radius: 4px;
  }
}
.van-button {
  display: inline-block;
}
.van-button {
  height: 100%;
}
/deep/.laydate-prev-y {
  display: none;
}
/deep/.laydate-prev-m {
  display: none;
}
/deep/.laydate-next-y {
  display: none;
}
/deep/.laydate-next-m {
  display: none;
}
.van-tab__pane:last-child {
  .hasVisit {
    line-height: 40px !important;
  }
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

</style>
