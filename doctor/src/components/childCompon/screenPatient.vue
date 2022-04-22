<template>
  <div class="popup">
    <div class="popup_list">
      <div class="popup_item">
        <p>自身条件</p>
        <div class="box">
          <span class="label">性别</span>
          <div class="radio" v-for="(val, i) in sex" :key="i">
                <span
                  :class="i == sexLi ? 'sexActive' : 'sex'"
                  @click="clickSex(val, i)"
                >{{ val }}</span
                >
          </div>
        </div>
      </div>
      <div class="popup_item">
        <p>年龄</p>
        <div class="box">
          <div class="age">
            <span>{{ sliderMin }}</span>
            <div>
              <slider :value-fun="sliderVal" :min="0" :max="100"></slider>
            </div>
            <span>{{ sliderMax }}</span>
          </div>
        </div>
      </div>
      <div class="popup_item">
        <p>问诊信息</p>
        <div class="box">
          <input
            type="text"
            v-model="message"
            placeholder="请输入特定诊断"
          />
        </div>
      </div>
      <div class="popup_item">
        <p>特定药物</p>
        <div class="box">
          <input type="text" v-model="drug" placeholder="请输入特定药物"/>
        </div>
      </div>
      <div class="popup_item">
        <p>线下门诊</p>
        <div class="box_1">
              <span
                class="label"
                v-html="checked == true ? '已开启' : '已关闭'"
              ></span>
          <van-switch v-model="checked"/>
        </div>
      </div>
      <div class="popup_item" v-if="groups.length > 0">
        <p>分组</p>
        <div class="box_3" ref="box">
          <p
            :class="val.isChecked==true ? 'checkActive check' : 'check'"
            v-for="(val,i) in groups"
            :key="i"
            @click="checkedBox(i,val)"
          >
            {{ val.groupName }}
            <span>({{ val.patientCount }})</span>
          </p>
        </div>
        <div class="expend" v-if="isExpend">
          <img src="@/assets/img/expend.png" alt/>
          <span @click="expendGroups" class="font-login-color-blue">展开分组</span>
        </div>
      </div>
      <div class="popup_item">
        <p>问诊时间</p>
        <div class="box_2">
          <p>
            开始<span @click="getStart">{{ startValue }}</span>
          </p>
          <p>
            结束<span @click="getEnd">{{ endValue }}</span>
          </p>
        </div>
      </div>
      <div class="popup_item">
        <p>其他</p>
        <div class="box_4">
          <p
            :class="val.isChecked == true ? 'checkActive' : 'check'"
            v-for="(val, i) in others"
            :key="i"
            @click="otherBox(i, val)"
          >
            {{ val.groupName }}<span>({{ val.patientCount }})</span>
          </p>
        </div>
      </div>
    </div>
    <div class="btns">
      <button class="publicWhiteBtn" @click="reset">重置</button>
      <button class="publicBtn twoBtn" @click="sxSure">确定</button>
    </div>
    <!-- 选择开始时间 -->
    <van-popup v-model="isStart" position="bottom">
      <van-datetime-picker
        v-model="startDate"
        type="date"
        title="选择年月日"
        @confirm="confirmS"
        @cancel="cancelS"
      />
    </van-popup>
    <!-- 选择结束时间 -->
    <van-popup v-model="isEnd" position="bottom">
      <van-datetime-picker
        v-model="endDate"
        type="date"
        title="选择年月日"
        @confirm="confirmE"
        @cancel="cancelE"
      />
    </van-popup>
  </div>
</template>

<script>
import {findGroupNameAndPatientCountByGroupIdNotGroup, findPatientList} from "../../api/myGroups";
import Slider from "../../common/slider";
import myJsTools from "../../utils/myJsTools";

export default {
  name: "screenPatient",
  components: {Slider},
  data() {
    return {
      //其他
      others: [],
      groups: [],
      sex: ["男", "女"],
      sexLi: -1,
      sexValue: "",
      message: "",
      drug: "",
      checked: false,
      //是否打开时间选择器（开始）
      isStart: false,
      //是否打开时间选择器（结束）
      isEnd: false,
      //开始时间
      startDate: new Date(),
      startValue: "开始时间",
      //结束时间
      endDate: new Date(),
      isExpend: false,
      endValue: "结束时间",
      // 患者列表
      groupList: [],
      sliderMin: "",
      sliderMax: "",
    }
  },
  created() {
    this.timeFormat(new Date());
    this.getGroups();
  },
  methods: {
    //初始化获取筛选的分组
    getGroups() {
      findGroupNameAndPatientCountByGroupIdNotGroup({}).then(res => {
        res.data.map(item => {
          if (item.groupId == this.$store.getters.getGroupsInfo.groupId){
            return (item.isChecked = true);
          }else{
            return (item.isChecked = false);
          }
        });
        this.groups = res.data.filter(item => item.groupId != "");
        this.others = res.data.filter(item => item.groupId == "");
        console.log(this.others);
        this.others.push({
          patientId: "",
          groupName: "关注患者",
          patientCount: "0",
          isChecked: false
        });
        this.others.map(item => {
          return (item.other = false);
        });
      });
    },
    //确定(筛选)
    sxSure() {
      this.groupIdArray = []
      this.groups.map(item => {
        if (item.isChecked == true && this.$store.getters.getGroupsInfo.groupId != item.groupId) {
          this.groupIdArray.push(item.groupId);
        }
      });
      let sexCode = "";
      let start = "";
      let end = "";
      if (this.startValue == "开始时间") {
        start = "";
      } else {
        start = this.startValue + " " + "00:00:00";
      }
      if (this.endValue == "结束时间") {
        end = "";
      } else {
        end = this.endValue + " " + "23:59:59";
      }
      if (this.sexValue == "男") {
        sexCode = "1";
      } else if (this.sexValue == "女") {
        sexCode = "2";
      }
      let dataForm = {
        ageBegin: String(this.sliderMin),
        ageEnd: String(this.sliderMax),
        attention: this.others[0].other,
        diagName: this.message,
        drugName: this.drug,
        guahaoTimeBegin: start,
        guahaoTimeEnd: end,
        haveOfflineClinic:this.checked?'1':'',
        sexCode: sexCode,
        docId:myJsTools.getItem("token_info").docId
      };
      dataForm.groupIdArray = this.groupIdArray;
      if (this.others.length == 1) {
        if (!this.others[0].other || this.others[0].other == '0') {
          dataForm.attention = "0";
        } else {
          dataForm.attention = "1";
        }
        dataForm.noGroup = '0';
      } else if (this.others.length == 2) {
        console.log(this.others[0].other)
        if (!this.others[0].other || this.others[0].other == '0') {
          dataForm.noGroup = "0";
        } else {
          dataForm.noGroup = "1";
        }
        if (!this.others[1].other || this.others[1].other == '0') {
          dataForm.attention = "0";
        } else {
          dataForm.attention = "1";
        }
      }
      this.$emit("screenPatienList", dataForm);
    },
    //重置(筛选)
    reset() {
      this.sliderMin = "0";
      this.sliderMax = "100";
      this.others[0].other = "0";
      this.sexValue = "";
      this.message = "";
      this.drug = "";
      this.startValue = "开始时间";
      this.endValue = "结束时间";
      this.sexLi = -1;
      this.others[1].other = "0";
      this.groups.map(item => {
        if(item.groupId == this.$store.getters.getGroupsInfo.groupId){
          item.isChecked = true;
        }else{
          item.isChecked = false;
        }

      });
      this.others.map(item => {
        item.isChecked = false;
      });
      this.show = false;
      this.$emit("getList");
    },
    sliderVal(min, max, total) {
      this.sliderMin = min;
      this.sliderMax = max;
    },
    //点击选择性别
    clickSex(val, i) {
      if (this.sexLi == i) {
        this.sexValue = '';
        this.sexLi = -1;
      } else {
        this.sexValue = val;
        this.sexLi = i;
      }
    },
    //打开时间选择器（开始）
    getStart() {
      this.isStart = true;
    },
    //打开时间选择器（结束）
    getEnd() {
      this.isEnd = true;
    },
    //点击确定(开始)
    confirmS() {
      this.startValue = this.timeFormat(this.startDate);
      this.isStart = false;
    },
    //点击确定(结束)
    confirmE() {
      this.endValue = this.timeFormat(this.endDate);
      this.isEnd = false;
    },
    //点击取消(开始)
    cancelS() {
      this.isStart = false;
    },
    //点击取消(结束)
    cancelE() {
      this.isEnd = false;
    },
    //转换时间格式
    timeFormat(time) {
      let year = time.getFullYear();
      let month = time.getMonth() + 1;
      let day = time.getDate();
      return year + "-" + month + "-" + day;
    },
    //展开分组
    expendGroups() {
      this.$refs.box.style = "overflow:visible;height:auto";
      this.isExpend = false;
    },
    //点击多选(分组)
    checkedBox(i, val) {
      if(val.groupId == this.$store.getters.getGroupsInfo.groupId){
        val.isChecked = true;
      }else {
        val.isChecked = !val.isChecked;
      }
    },
    //点击多选(其他)
    otherBox(i, val) {
      val.isChecked = !val.isChecked;
      this.others.map(item => {
        if (item.isChecked == true) {
          item.other = "1";
        } else {
          item.other = "0";
        }
      });
    },
  }
}
</script>

<style scoped lang="less">
@import '../../assets/css/overall';

.popup {
  width: 100% !important;
  padding: 12px 0 !important;
  text-align: left !important;
  overflow: scroll;
  position: relative;
  box-sizing: border-box;
  height: 100%;

  .popup_list {
    overflow-y: scroll;
    padding-bottom: 40px;
    height: 100%;
    box-sizing: border-box;
  }

  &_item {
    margin-bottom: 12px;

    p {
      margin-bottom: 12px;
      font-size: 14px;
      font-weight: 400;
      color: rgba(51, 51, 51, 1);
      line-height: 20px;
    }

    .box,
    .box_1,
    .box_2,
    .box_3 {
      background: rgba(243, 243, 243, 1);
      border-radius: 8px;
      padding: 12px 16px;
      display: flex;
      align-items: center;

      .label {
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(51, 51, 51, 1);
        line-height: 20px;
        display: block;
        width: 30%;
      }

      input {
        width: 100%;
        height: 20px;
        background: none;
      }

      .radio {
        width: 70%;
        display: flex;
        align-items: center;
        justify-content: space-around;

        .sex,
        .sexActive {
          font-size: 14px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: rgba(51, 51, 51, 1);
          line-height: 20px;
          background: #ffffff;
          border-radius: 4px;
          width: 58px;
          text-align: center;
        }

        .sexActive {
          color: rgba(255, 255, 255, 1);
          background: rgba(20, 160, 230, 1);
        }
      }

      .age {
        width: 100%;
        display: flex;
        align-items: center;

        div {
          width: 94%;
          margin: 0 auto;
        }

        span {
          display: block;
          width: 10%;
          text-align: center;
        }
      }
    }

    .box_1,
    .box_2 {
      justify-content: space-between;
    }

    .box_2 {
      p {
        width: 49%;
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(102, 102, 102, 1);
        line-height: 20px;
        margin-bottom: 0;

        span {
          margin-left: 4px;
          color: rgba(20, 160, 230, 1);
        }
      }
    }

    .box_3,
    .box_4 {
      height: 40px;
      background: #ffffff;
      flex-wrap: wrap;
      padding: 0;
      overflow: hidden;

      .check,
      .checkActive {
        padding: 6px 12px;
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(102, 102, 102, 1);
        line-height: 20px;
        margin-right: 8px;
        background: rgba(243, 243, 243, 1);
        border-radius: 8px;
      }

      .checkActive {
        background: rgba(20, 160, 230, 1);
        color: rgba(255, 255, 255, 1);
      }
    }

    .box_4 {
      display: flex;
      height: auto;
      overflow: visible;
    }
  }
}

.btns {
  .display-div;
  position: fixed;
  width: 90%;
  bottom: 0px;
  text-align: center;
  background: white;
  padding: 12px 0;
}
</style>
