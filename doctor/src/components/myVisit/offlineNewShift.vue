<template>
  <div class="newShift">
    <navbar :title="type == '1'?'新增排班':'编辑排班'"></navbar>
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
            <template #button v-if="type == '1'">
              <img
                src="../../assets/img/my/delete.png"
                class="icon-width-height-sm-16"
                @click.stop="deleteTimes(index)"
              />
            </template>
          </van-field>
        </li>
        <div class="addTime" @click="addTimes" v-if="type == '1'">
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
          v-model="appointLimitNum"
          label="限制人数"
          type="digit"
          maxlength="2"
          placeholder="请输入限制人数"
        />
      </div>
      <div class="bottomBtn">
        <button class="publicBtn" v-if="type == '1'" :disabled="btnDisabled" @click="saveVisit">添加</button>
        <button class="publicBtn" v-else :disabled="btnDisabled" @click="saveVisit">保存</button>
      </div>
    </div>
  </div>
</template>

<script>
import navbar from "@/common/navbar";
import date from "@/utils/date";
import myJsTools from "@/utils/myJsTools";
import {Toast} from "vant";
import {
  updateDocDicVisitRealTempOffline,
  addTemplate,
  saveDocDicVisitRealTempOffline,
  saveDicDocVisitRealOffline, updateDicDocVisitRealOffline
} from "../../api/visit";

export default {
  data() {
    return {
      appointLimitNum: "",
      time: "",
      showSelectTime: false,
      timeList: [{}],
      seleIndex: 0,
      type:"",
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
    this.type = this.$route.query.type;
    if(this.$route.query.type == '2'){
      this.timeList = [{
        startTime:this.$route.query.item.startTime,
        endTime: this.$route.query.item.endTime,
        time: this.$route.query.item.startTime + "-" + this.$route.query.item.endTime
      }]
      this.appointLimitNum = this.$route.query.item.appointLimitNum
    }
    let nowDate = date.getFormatDate("/");
    let visitDate;
    if(this.$route.query.visitDate){
      visitDate = date.getNowDate(this.$route.query.visitDate).replace(/-/g,"/");
    }
    if (nowDate == visitDate && this.$route.query.visitDate) {
      let time = date.getNowTime(new Date()).substr(11, 5);
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
  methods: {
    // 添加诊段
    addTimes() {
      for (let m = 0; m < this.timeList.length; m++) {
        const element = this.timeList[m];
        if (!element.startTime) {
          Toast("已存在空白时间段，请先补全时间再添加");
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
      if (this.timeList.length > 0) {
        for (let i = 0; i < this.timeList.length; i++) {
          const element = this.timeList[i];
          if (i == this.seleIndex) {
            continue;
          }else {
            if (element.startTime) {
              arr.push(element);
            }
          }
        }
      }
      for (let m = 0; m < arr.length; m++) {
        const element = arr[m];
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
      if(this.$route.query.visitDate && this.type == '2'){
        return;
      }
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
      if (!this.appointLimitNum) {
        Toast("请输入限制人数");
        return;
      } else {
        if (this.appointLimitNum <= 0) {
          Toast("请输入正整数");
          return;
        }
      }
      var arr = [];
      for (let i = 0; i < this.timeList.length; i++) {
        const element = this.timeList[i];
        arr.push({
          startTime: element.startTime + ":00",
          endTime: element.endTime + ":00",
        });
      }
      var week
      if(query.visitDate){
        week = new Date(query.visitDate.replace(/-/g,'/')).getDay();
      }
      if (query.week && !query.visitDate) {
        week = query.week;
      }
      this.btnDisabled = true;
      //如果接口报错延时将按钮设置为可点击
      setTimeout(() => {
        this.btnDisabled = false;
      }, 2000);
      var param = {
        appointLimitNum: this.appointLimitNum,
        docId: myJsTools.getItem("token_info").docId,
        week: week,
        list:arr
      };
      if (query.type == 1) {
        if(query.visitDate){
          param.visitDate = query.visitDate
          saveDicDocVisitRealOffline(param).then(res=>{
            this.btnDisabled = false;
            this.$router.go(-1);
          })
        }else{
          saveDocDicVisitRealTempOffline(param).then(res => {
            this.btnDisabled = false;
            this.$router.go(-1);
          });
        }

      } else if (query.type == 2) {
        if(query.visitDate){
          updateDicDocVisitRealOffline({
            appointLimitNum:this.appointLimitNum,
            vrId:this.$route.query.item.vrId
          }).then(res=>{
            this.btnDisabled = false;
            this.$router.go(-1)
          })
        }else{
          updateDocDicVisitRealTempOffline({
            appointLimitNum:this.appointLimitNum,
            docId: myJsTools.getItem("token_info").docId,
            endTime: this.timeList[0].endTime,
            startTime: this.timeList[0].startTime,
            dvrtId: this.$route.query.item.dvrtId
          }).then(res => {
            this.btnDisabled = false;
            this.$router.go(-1)
          });
        }
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
