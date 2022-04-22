<template>
  <div class="newShift">
    <navbar title="新增排班"></navbar>
    <div class="shiftDiv">
      <div class="diagnosis">
        <li v-for="(item, index) in timeList" style="width: 100%;" :key="index">
          <van-field
            :class="index == 0 ? 'captcha' : 'captcha noneLabel'"
            @click.stop="showSelect(index)"
            v-model="item.time"
            :label="index == 0 ? '诊段' : ''"
            placeholder="请选择时间段"
            readonly
          >
            <template #button>
              <img
                src="../../assets/img/my/delete.png"
                class="icon-width-height-sm-16"
                @click.stop="deleteTimes(index)"
              />
            </template>
          </van-field>
        </li>
        <div class="addTime" @click="addTimes">
          <img src="../../assets/img/my/addIcon.png" class="icon-width-height-sm-16"/>
          <span>添加</span>
        </div>
        <van-popup v-model="showSelectTime" position="bottom">
          <van-picker
            show-toolbar
            :columns="timeColumns"
            ref="selectTime"
            @cancel="showSelectTime = false"
            @confirm="comfirmTimes"
            @change="changeTime"
          />
        </van-popup>
      </div>
      <div class="diagnosis">
        <van-field
          class="captcha"
          v-model="methodsName"
          label="出诊方式"
          placeholder
          readonly
          @click="showMethods = true"
        >
          <template #button>
            <img src="../../assets/img/my/down.png" class="icon-width-height-sm-16"/>
          </template>
        </van-field>
        <van-popup v-model="showMethods" position="bottom">
          <van-picker
            show-toolbar
            :columns="columns"
            @cancel="showMethods = false"
            @confirm="comfirmMethod"
          />
        </van-popup>
      </div>
      <div class="diagnosis">
        <van-field
          class="captcha"
          v-model="consultationName"
          label="服务类型"
          placeholder
          readonly
          @click="showFwType = true"
        >
          <template #button>
            <img src="../../assets/img/my/down.png" class="icon-width-height-sm-16"/>
          </template>
        </van-field>
        <van-popup v-model="showFwType" position="bottom">
          <van-picker
            show-toolbar
            :columns="fwColumns"
            @cancel="showFwType = false"
            @confirm="comfirmFwType"

          />
        </van-popup>
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
        <button class="publicBtn" :disabled="btnDisabled" @click="saveVisit">添加</button>
      </div>
    </div>
  </div>
</template>

<script>
import navbar from "@/common/navbar";
import date from "@/utils/date";
import myJsTools from "@/utils/myJsTools";
import {Toast} from "vant";
import {addProVisitReal, addTemplate, getDocDefaultDeptVisitType, getSystemZiXunFuZhen} from "../../api/visit";

export default {
  data() {
    return {
      showMethods: false,
      showFwType: false,
      num: "",
      time: "",
      methodsName: "",
      columns: [],
      consultationName: "",
      fwColumns:[],
      showSelectTime: false,
      timeList: [{}],
      seleIndex: 0,
      timeColumns: [
        // 第一列
        {
          values: [],
          defaultIndex: 0
        },
        // 第二列
        {
          values: [],
          defaultIndex: 0
        }
      ],
      btnDisabled: false,//保存按钮禁止点击
    };
  },
  components: {navbar},
  created() {
    let nowDate = date.getFormatDate("/");
    let visitDate = date.getNowDate(this.$route.query.visitDate).replace(/-/g, "/");
    if (nowDate == visitDate) {
      let time = date.getNowTime(new Date()).substr(11, 5);
      console.log(time)
      if (time.split(":")[1] >= 30) {
        this.timeColumns[0].values.push(time.split(":")[0] + ":30");
      } else {
        if (time == "00:00") {
          this.timeColumns[0].values.push("00:00");
        }
        this.timeColumns[0].values.push(time.split(":")[0] + ":00");

      }
      for (let m = 0; m < 47; m++) {
        console.log(this.timeColumns[0].values[0]);
        let days = date.dayDifAdd("2020/01/01 " + this.timeColumns[0].values[m]);
        console.log(days);
        if (days > time) {
          this.timeColumns[0].values.push(days);
          this.timeColumns[1].values.push(days);
        }
        if (days == "23:30") {
          this.timeColumns[1].values.push("23:59");
          return;
        }
      }
    } else {
      this.timeColumns[0].values.push("00:00");
      for (let m = 0; m < 47; m++) {
        let days = date.dayDifAdd("2020/01/01 " + this.timeColumns[0].values[m]);
        console.log(days);
        this.timeColumns[0].values.push(days);
        this.timeColumns[1].values.push(days);
      }
      this.timeColumns[1].values.push("23:59");
    }

  },
  mounted() {
    this.getColoums();
  },
  methods: {
    getColoums(){
      getSystemZiXunFuZhen().then(res=>{
        if(res.data){
          this.fwColumns = res.data;
          this.consultationName = res.data[0]
        }
      })
      getDocDefaultDeptVisitType({
        docId: myJsTools.getItem('token_info').docId
      }).then(res=>{
        if(res.data){
          this.columns = res.data;
          this.methodsName = res.data[0]
        }
      })
    },
    // 添加诊段
    addTimes() {
      for (let m = 0; m < this.timeList.length; m++) {
        const element = this.timeList[m];
        if (!element.startTime) {
          Toast("请选择为空诊段");
          return;
        }
      }
      this.timeList.push({
        startTime: "",
        endTime: "",
        time: ""
      });
    },
    // 删除诊段
    deleteTimes(index) {
      if (index == 0 && this.timeList.length == 1) {
        this.timeList = [{
          startTime: "",
          endTime: "",
          time: ""
        }]
      } else {
        this.timeList.splice(index, 1);
      }
    },
    // 选择问诊方式
    comfirmMethod(val) {
      this.showMethods = false;
      this.methodsName = val;
    },
    // 选择服务类型
    comfirmFwType(val) {
      this.showFwType = false;
      this.consultationName = val;
    },
    //时间选择器发生改变
    changeTime(val, val1) {
      console.log(this.$refs.selectTime.getIndexes());
      let indexArr = this.$refs.selectTime.getIndexes();
      if (indexArr[1] < indexArr[0]) {
        console.log("ssss");
        this.$refs.selectTime.setIndexes([indexArr[0], indexArr[0]]);
      }
    },
    // 确认诊段
    comfirmTimes(val) {
      console.log(val);
      let startTime = val[0];
      let endTime = val[1];
      if (endTime <= startTime) {
        Toast("结束时间必须大于开始时间");
        return;
      }
      var arr = [];
      if (this.$route.query.list) {
        for (let x = 0; x < this.$route.query.list.length; x++) {
          const element = this.$route.query.list[x];
          arr.push({
            startTime: element.startTime,
            endTime: element.endTime
          });
        }
      }
      console.log(this.timeList);
      if (this.timeList.length > 0) {
        for (let i = 0; i < this.timeList.length; i++) {
          const element = this.timeList[i];
          if (element.startTime) {
            arr.push(element);
          }
          // arr.push(element);
          if (i == this.seleIndex) {
            continue;
          }
        }
      }
      arr.concat(this.timeList);
      console.log(this.timeList);
      // arr.sort();
      console.log("排班时间", arr);
      for (let m = 0; m < arr.length; m++) {
        const element = arr[m];
        console.log(startTime >= element.endTime)
        if (!(startTime >= element.endTime || endTime <= element.startTime)) {
          Toast("此时间段包含在别的诊段时间内，请重新选择");
          return;
        }
      }
      let item = {
        startTime: startTime,
        endTime: endTime,
        time: val[0] + "-" + val[1]
      };

      this.$set(this.timeList, this.seleIndex, item);
      this.showSelectTime = false;
    },
    // 打开选择时间段界面
    showSelect(index) {
      this.showSelectTime = true;
      this.seleIndex = index;
    },
    // 添加
    saveVisit() {
      var query = this.$route.query;
      if (this.timeList.length == 0) {
        Toast("至少添加一个诊段");
        return;
      }
      for (let i = 0; i < this.timeList.length; i++) {
        if (!this.timeList[i].time) {
          Toast("请选择诊断时间");
          return;
        }
      }
      if (!this.num) {
        Toast("请输入限制人数");
        return;
      } else {
        if (this.num <= 0) {
          Toast("请输入正整数");
          return;
        }
      }
      let visitTypeCode;
      if (this.methodsName == "语音") {
        visitTypeCode = 2;
      } else if (this.methodsName == "视频") {
        visitTypeCode = 4;
      }
      let consultationCode;
      if (this.consultationName == "咨询") {
        consultationCode = 0;
      } else if (this.consultationName == "复诊") {
        consultationCode = 1;
      }
      var arr = [];
      for (let i = 0; i < this.timeList.length; i++) {
        const element = this.timeList[i];
        var apw;
        if (element.startTime >= "00:00" && element.startTime < "12:00") {
          apw = "a";
        } else {
          apw = "p";
        }
        arr.push({
          startTime: element.startTime,
          endTime: element.endTime,
          apw: apw
        });
      }
      var week = new Date(query.visitDate).getDay(); //注意此处必须是先new一个Date
      if (query.week && !query.visitDate) {
        week = query.week;
      }
      this.btnDisabled = true;
      //如果接口报错延时将按钮设置为可点击
      setTimeout(() => {
        this.btnDisabled = false;
      }, 2000);
      var param = {
        appointDay: this.$route.query.num,
        appointLimitNum: this.num,
        consultationCode: consultationCode,
        consultationName: this.consultationName,
        deptId: sessionStorage.getItem("deptId"),
        docId: myJsTools.getItem("token_info").docId,
        isAppoint: "0",
        isStop: "0",
        limitNum: this.num,
        visitTypeName: this.methodsName,
        visitTypeCode: visitTypeCode,
        vrTempType: 2,
        week: week,
      };
      console.log(param);
      if (query.visitDate) {
        param.visitDate = query.visitDate + " 00:00:00";
      } else if (!query.visitDate) {
        param.visitDate = "";
      }
      console.log(arr);
      if (query.type == 2) {
        addTemplate({
          visitData: param,
          timeList: arr,
          visitTypeId: 2,
          vrTempType: 2,
          week: week,
          consultationId: "1",
          docId: myJsTools.getItem("token_info").docId
        }).then(res => {
          console.log("添加排班返回信息", res);
          this.btnDisabled = false;
          this.$router.go(-1);
        });
      } else if (query.type == 1) {
        addProVisitReal({
          visitData: param,
          timeList: arr,
          visitTypeCode: visitTypeCode,
          vrTempType: 2,
          week: week,
          consultationId: "1",
          docId: myJsTools.getItem("token_info").docId,
          hosId: myJsTools.getItem("token_info").hosId,
        }).then(res => {
          console.log("添加自定义排班返回信息", res);
          this.btnDisabled = false;
          this.$router.go(-1)
        });
      }

    }
  }
};
</script>

<style scoped lang="less">


.newShift {
  background: @white !important;
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
