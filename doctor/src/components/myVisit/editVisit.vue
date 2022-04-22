<template>
  <div class="newShift">
    <navbar title="编辑排班"></navbar>
    <div class="shiftDiv">
      <div class="diagnosis">
        <li v-for="(item, index) in timeList" style="width: 100%;" :key="index">
          <van-field
            :class="index == 0 ? 'captcha' : 'captcha noneLabel'"
            v-model="item.time"
            :label="index == 0 ? '诊段' : ''"
            placeholder="请选择时间段"
            readonly
          ></van-field>
        </li>
      </div>
      <div class="diagnosis">
        <van-field
          class="captcha"
          v-model="methodsName"
          label="出诊方式"
          placeholder
          readonly
        ></van-field>
      </div>
      <div class="diagnosis">
        <van-field
          class="captcha"
          v-model="consultationName"
          label="服务类型"
          placeholder
          readonly
        ></van-field>
      </div>
      <div class="diagnosis">
        <van-field
          v-model="num"
          label="限制人数"
          type="digit"
          maxlength="2"
          placeholder="请输入限制人数"
        />
      </div>
      <div class="bottomBtn">
        <button class="publicBtn" @click="saveVisit">保存</button>
      </div>
    </div>
  </div>
</template>

<script>
import navbar from "@/common/navbar";
import date from "@/utils/date";
import myJsTools from "@/utils/myJsTools";
import { Toast } from "vant";
import { updateProVisitReal, updateTemplate } from "@/api/visit";
export default {
  data() {
    return {
      num: "",
      time: "",
      methodsName: "语音",
      consultationName: "咨询",
      timeList: [{}],
      numberOf:0,
    };
  },
  components: { navbar },
  created() {},
  beforeRouteEnter(to, from, next) {
    sessionStorage.setItem("pathName", from.name);
    next();
  },
  mounted() {
    var item = this.$route.query.item;
    this.methodsName = item.visitTypeName;
    this.consultationName = item.consultationName;
    this.num = item.appointLimitNum;
    this.numberOf = item.numberOf;
    this.timeList[0].startTime = item.startTime;
    this.timeList[0].endTime = item.endTime;
    this.timeList[0].time = item.startTime + "-" + item.endTime;
  },
  methods: {
    // 限制人数-三位整数
    limitNum(event) {
      console.log(event);
      if (event < 0) {
        Toast("请输入正整数");
        return;
      }
    },
    // 保存
    saveVisit() {
      if (!this.num) {
        Toast("请输入限制人数");
        return;
      }else if (this.num < this.numberOf) {
        Toast("限制人数不能小于已预约人数，建议医生进行停诊操作");
        return;
      } else {
        if (this.num < 0) {
          Toast("请输入正整数");
          return;
        }
      }
      var param = {
        apw: this.apw,
        appointLimitNum: this.num,
        docId: myJsTools.getItem("token_info").docId,
        vrTempType: 2
      };
      // 1为非模板，2为模板
      if (this.$route.query.type == 1) {
        (param.vrId = this.$route.query.item.vrId),
          updateProVisitReal(param).then(res => {
            console.log("修改排班返回信息", res);
            this.$router.go(-1);
          });
      } else {
        (param.dvrtId = this.$route.query.item.dvrtId),
          updateTemplate(param).then(res => {
            console.log("修改排班返回信息", res);
            this.$router.go(-1);
          });
      }
    }
  }
};
</script>

<style scoped lang="less">

.newShift {
  .black-font;
  .font-size-md;
  line-height: 20px;
  .shiftDiv {
    padding: 0 16px;
  }
  .addTime {
    padding-left: 108px;
    .font-login-color-blue;
    .font-size-md;
    line-height: 20px;
    display: flex;
    align-items: center;
  }
  .diagnosis {
    padding: 13px 0;
  }
  .noneLabel {
    padding-left: 108px;
  }
}
</style>
