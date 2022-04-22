<template>
  <div class="editShift">
    <navbar title="编辑排班"></navbar>
    <div class="shiftDiv">
      <div class="diagnosis" v-if="this.$route.query.type == 1">
        <van-field
          class="captcha"
          v-model="diagnosisTime"
          label="诊断"
          placeholder
          readonly
        ></van-field>
      </div>
      <div class="diagnosis" v-else>
        <van-field
          class="captcha"
          v-model="diagnosisTime"
          label="诊断"
          placeholder
          readonly
          @click="showMethods = true"
        >
          <template #button>
            <img src="../../assets/img/my/down.png" class="icon-width-height-sm-16" />
          </template>
        </van-field>
        <van-popup v-model="showMethods" position="bottom">
          <van-picker
            show-toolbar
            :columns="columns"
            @cancel="showMethods = false"
            @confirm="comfirmApw"
          />
        </van-popup>
      </div>
      <div class="diagnosis">
        <van-field
          v-model="num"
          label="限制人数"
          type="digit"
          maxlength="3"
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
      showMethods: false,
      num: "",
      time: "",
      diagnosisTime: "上午",
      columns: ["上午", "下午"],
      apw: "",
      endNum:0,
      appointLimitNum:0,
    };
  },
  components: { navbar },
  created() {},
  beforeRouteEnter(to, from, next) {
    sessionStorage.setItem("pathName", from.name);
    next();
  },
  mounted() {
    console.log(this.$route.query);
    var item = this.$route.query.item;
    if (item.apw == "a") {
      this.diagnosisTime = "上午";
    } else if (item.apw == "p") {
      this.diagnosisTime = "下午";
    }
    this.num = this.appointLimitNum = item.appointLimitNum;
    this.endNum = item.appointLimitNumLast
  },
  methods: {
    // 诊断时间
    comfirmApw(val) {
      (this.showMethods = false), (this.diagnosisTime = val);
    },
    // 保存
    saveVisit(res) {
      if (!this.num) {
        Toast("请输入限制人数");
        return;
      } else if (this.num <( parseInt(this.appointLimitNum) - parseInt(this.endNum))) {
        Toast("限制人数不能小于已预约人数，建议医生进行停诊操作");
        return;
      }else {
        console.log(this.num);
        if (this.num < 0) {
          Toast("请输入正整数");
          return;
        }
      }
      if (this.diagnosisTime == "上午") {
        this.apw = "a";
      } else if (this.diagnosisTime == "下午") {
        this.apw = "p";
      }
      console.log(myJsTools.getItem("token_info").docId);
      var param = {
        apw: this.apw,
        appointLimitNum: this.num,
        docId: myJsTools.getItem("token_info").docId,
        vrTempType: 3,
        week: this.$route.query.week
      };
      // 1为非模板，2为模板
      if (this.$route.query.type == 1) {
        (param.vrId = this.$route.query.item.vrId),
          updateProVisitReal(param).then(res => {
            console.log("修改排班返回信息", res);
            this.$router.push({
              name: "myVisit",
              query: {
                deptId: sessionStorage.getItem("deptId"),
                active: 1,
                date: this.$route.query.date
              }
            });
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

.editShift {
  .black-font;
  .font-size-md;
  line-height: 20px;
  .shiftDiv {
    padding: 0 16px;
  }
  .diagnosis {
    padding: 13px 0;
  }
  .noneLabel {
    padding-left: 108px;
  }
}
</style>
