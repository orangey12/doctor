<template>
  <div class="myVisit">
    <navbar title="出诊表"> </navbar>
    <div class="lineVisitDiv">
      <li class="titleTips">
        <u>
          <span class="line"></span>
          <span>视频/语音</span>
        </u>
      </li>
    </div>
    <div class="laydate" id="test2"></div>
    <div class="lineVisitDiv " v-if="amVisitList.length > 0">
      <li class="title titleTips">
        <u>
          <span class="line"></span>
          <span>上午</span>
        </u>
      </li>
      <van-swipe-cell v-for="(item, index) in amVisitList" :key="index">
        <van-row>
          <van-col span="8">
            <span class="time">{{ item.startTime }}-{{ item.endTime }}</span>
          </van-col>
          <van-col span="8">
            <li class="limit">限制人数：{{ item.appointLimitNum }}</li>
            <li class="remaining">剩余人数：{{ item.appointLimitNum - item.numberOf  }}</li>
          </van-col>
          <van-col span="8">
            <li class="fwType">
              <span>{{ item.consultationName }}</span>
            </li>
            <span class="voice-sign" v-if="item.visitTypeCode == 2">{{
              item.visitTypeName
            }}</span>
            <span class="video-sign" v-if="item.visitTypeCode == 4">{{
              item.visitTypeName
            }}</span>
            <span class="tel-sign" v-if="item.visitTypeCode == 3">{{
              item.visitTypeName
            }}</span>
          </van-col>
        </van-row>
      </van-swipe-cell>
    </div>
    <div class="lineVisitDiv " v-if="pmVisitList.length > 0">
      <li class="title titleTips">
        <u>
          <span class="line"></span>
          <span>下午</span>
        </u>
      </li>
      <van-swipe-cell v-for="(item, index) in pmVisitList" :key="index">
        <van-row>
          <van-col span="8">
            <span class="time">{{ item.startTime }}-{{ item.endTime }}</span>
          </van-col>
          <van-col span="8">
            <li class="limit">限制人数：{{ item.appointLimitNum }}</li>
            <li class="remaining">剩余人数：{{ item.appointLimitNum - item.numberOf  }}</li>
          </van-col>
          <van-col span="8">
            <li class="fwType">
              <span>{{ item.consultationName }}</span>
            </li>
            <span class="voice-sign" v-if="item.visitTypeCode == 2">{{
              item.visitTypeName
            }}</span>
            <span class="type video-sign" v-if="item.visitTypeCode == 4">{{
              item.visitTypeName
            }}</span>
            <span class="tel-sign" v-if="item.visitTypeCode == 3">{{
              item.visitTypeName
            }}</span>
          </van-col>
        </van-row>
      </van-swipe-cell>
    </div>
    <div class="bottomBtn" v-show="sendShowType && type == 'chat'"
         @click="sendCard">
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
import { docVisitFlag, docVisit } from "@/api/visit";
import laydate from "layui-laydate";
import "@/assets/css/layDate.css";
import { docSendTableSaveRecord } from "../../api/chat";
import {queryInformationOfDoctorOneDayVisit} from "../../api/visit";
export default {
  data() {
    return {
      active: this.$route.query.active,
      disabled: false,
      amVisitList: [],
      pmVisitList: [],
      pmOfflineVisitList: [],
      amOfflineVisitList: [],
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
      sendShowType: false,
      type: "chat"
    };
  },
  components: { navbar },
  created() {},
  mounted() {
    console.log(this.$route.query);
    var me = this;
    this.docId = myJsTools.getItem("token_info").docId;
    this.type = this.$route.query.type;
    this.getOnline();
    if (!this.$route.query.docId) {
      this.sendShowType = false;
    } else {
      this.sendShowType = true;
    }
  },
  methods: {
    //确认发送
    sendCard() {
      let ext = {
        type: "czb",
        docName: myJsTools.getItem("token_info").docName,
        czbType: "1" //线上
      };
      api.sendEvent({
        name: "sendCard",
        extra: {
          ext: ext
        }
      });
      this.$router.go(-1);
    },
    //随访计划选择线上排班
    selectLineCard() {
      console.log("sss");
      api.sendEvent({
        name: "selectCard",
        extra: {
          visitRealType: 1
        }
      });
      this.$router.go(-1);
    },
    // 显示日历
    getOnline() {
      var me = this;
      setTimeout(() => {
        laydate.render({
          elem: "#test2",
          position: "static",
          type: "date",
          show: true,
          showBottom: false,
          theme: me.$store.getters.getThemeColor,
          // min: 0,
          max: 14, //14天后
          value: me.$route.query.value,
          closeStop: "#test2",
          ready: function(date) {
            console.log(date + "----------");
            me.nowDate = date.year + "-" + date.month + "-" + date.date;
            var currentDate = new Date();
            me.currentDate =
              currentDate.getFullYear() +
              "-" +
              (currentDate.getMonth() + 1) +
              "-" +
              currentDate.getDate();
            laydate.render.value = me.value;
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

            me.getDocFlag();
            me.getVisit();
          },
          change: function(value, date, endDate) {
            me.nowDate = value;
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
            me.value = value;
            laydate.render.value = me.value;
            me.setFlag();
            me.getDocFlag();
            me.getVisit();
          }
        });
      }, 300);
    },
    // 获取指定日期的排班信息
    getVisit() {
      this.amVisitList = this.visitDate = [];
      this.pmVisitList = [];
      queryInformationOfDoctorOneDayVisit({ docId: this.docId, visitDate: this.nowDate,queryType:"1" }).then(res => {
        console.log("医生排班信息", res);
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
            if(!element.numberOf){
              element.numberOf = 0;
            }
          }
          // 日期返回
          console.log(res.data[0].visitDate, this.nowDate);
        } else {
          this.amVisitList = this.pmVisitList = [];
        }
      });
    },
    // 获取医生排班标志
    getDocFlag() {
      docVisitFlag({ docId: this.docId }).then(res => {
        this.flagData = res.data;
        this.setFlag();
      });
    },
    // 设置日历标志
    setFlag() {
      let tds = document.getElementsByTagName("td");
      if (this.flagData.length == 0) {
        for (let m = 0; m < tds.length; m++) {
          const tdEle = tds[m];
          let name = $api.attr(tdEle, "lay-ymd");
          if (dateFun.getNowDate(name.replace(/-/g,'/')) == dateFun.getNowDate(this.nowDate)) {
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
            if (
              dateFun.getNowDate(name.replace(/-/g,'/')) == dateFun.getNowDate(element.visitDate)
            ) {
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
    }
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
  .fwType {
    .font-color-orange;
    .font-size-md;
    line-height: 20px;
    margin-bottom: 7px;
  }
}
.van-button {
  display: inline-block;
}
.setIcon {
  width: 22px;
  height: 22px;
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
</style>
